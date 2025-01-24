import './scss/styles.scss';

import { ProductAPI } from './components/ProductAPI';
import { API_URL, CDN_URL } from './utils/constants';
import { ensureElement, cloneTemplate } from './utils/utils';
import { EventEmitter } from './components/base/events';
import { AppData } from './components/AppData';
import { Page } from './components/Page';
import { Card } from './components/Card';
import { Order } from './components/Order';
import { Contacts } from './components/Contacts'
import { Basket, BasketItem } from './components/common/Basket';
import { Modal } from './components/common/Modal';
import { apiCache, handleSuccess } from './components/CacheAPI';
import { IProduct, OrderUnion } from './types/index';

const api = new ProductAPI(CDN_URL, API_URL);
const events = new EventEmitter();

// Чтобы мониторить все события, для отладки
events.onAll(({ eventName, data }) => {
	console.log(eventName, data);
})

// Все шаблоны
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const basketCardTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');

export const successTemplate = ensureElement<HTMLTemplateElement>('#success');

// Модель данных приложения
const appData = new AppData({}, events);

// Глобальные контейнеры
const page = new Page(document.body, events);
export const modal = new Modal(
	ensureElement<HTMLElement>('#modal-container'),
	events
);

// Переиспользуемые части интерфейса
const basket = new Basket(cloneTemplate(basketTemplate), events);
const order = new Order(cloneTemplate(orderTemplate), events);
const contact = new Contacts(cloneTemplate(contactsTemplate), events);

// Дальше идет бизнес-логика
// Поймали событие, сделали что нужно

// Загрузка главной страницы
events.on('items:changed', () => {
  page.products = appData.catalogue.map((item) => {
    const card = new Card(`card`, cloneTemplate(cardCatalogTemplate), {
      onClick: () => {
        events.emit('card:select', item);
      }
    });
    return card.render({
      id: item.id,
      title: item.title,
      image: item.image,
      category: item.category,
			price: item.price,
    });
  });
});

// Открытие модального окна карточки
events.on('card:select', (item: IProduct) => {
	if (item) {
			api.getProductItem(item.id)
				.then((res) => {
					const card = new Card('card', cloneTemplate(cardPreviewTemplate), {
						onClick: (evt) => {
							const btn = evt.target as HTMLButtonElement;
							if (btn.textContent === 'Купить') {
								btn.textContent = 'В корзину';
								appData.toggleOrderedProduct(res.id, true);
								page.counter = appData.order.items.length;
								events.emit('basket:changed');
							} else if (btn.textContent === 'В корзину') {
								events.emit('basket:open', item);
							};
						}
					});
					
					card.isPressed(appData.order.items.includes(res.id));

					modal.render({
						content: card.render({
							title: res.title,
							image: res.image,
							description: res.description,
							price: res.price,
							category: res.category
						}),
					});
				})
				.catch((err) => {
					console.error(`Error: ` + err);
				});
	} else {
		modal.close();
	} 
})

// Открыть корзину
events.on('basket:open', () => {
  modal.render({
    content: basket.render(),
  });
});

// Изминенение корзины
events.on('basket:changed', () => {
  basket.items = appData.getCards().map((item, i) => {
    const card = new BasketItem(cloneTemplate(basketCardTemplate), {
      onClick: () => {
        appData.toggleOrderedProduct(item.id, false);
        page.counter = appData.order.items.length;
        basket.items = basket.items.filter((i) => i.dataset.id !== item.id);
        basket.total = appData.getTotal();
        basket.selected = appData.order.items;
      },
    });
    return card.render({
      id: item.id,
      title: item.title,
      price: item.price,
      index: i + 1,
    });
  });
  page.counter = appData.order.items.length;
  basket.total = appData.getTotal();
  basket.selected = appData.order.items;
});

// Блок заказа: способ оплаты и адрес
events.on('order:open', () => {
	modal.render({
		content: order.render({
			address: appData.order.address,
			validation: appData.isFullDataOrder(),
			errors: [],
		}),
	});
});

// Валидация ошибок: способ оплаты и адрес
events.on('formOrderErrors:change', (errors: Partial<OrderUnion>) => {
	const { address, payment } = errors;
	order.valid = !address && !payment;
	order.errors = Object.values({ address, payment })
		.filter((i) => !! i)
		.join('; ');
});

// Блок заказа: почта и телефон
events.on('contacts:open', () => {
	modal.render({
		content: contact.render({
			email: appData.order.email,
			phone: appData.order.phone,
			validation: appData.isFullDataContacts(),
			errors: [],
		}),
	});
});

// Валидация ошибок: почта и телефон
events.on('formContactsErrors:change', (errors: Partial<OrderUnion>) => {
	const { email, phone } = errors;
	contact.valid = !email && !phone;
	contact.errors = Object.values({ email, phone })
		.filter((i) => !!i)
		.join('; ');
});

// Обрботка полей заказа
events.on('order:change', (data: {field: keyof OrderUnion; value: string}) => {
	appData.setData(data.field, data.value);
})

// Блок отпрвки успешного оформления
events.on('order:submit', () => {
  const cachedResult = apiCache[JSON.stringify(appData.order)]; 
  if (cachedResult) {
    handleSuccess(cachedResult);
  } else {
    api 	
      .orderProducts(appData.order)
      .then((res) => {
        apiCache[JSON.stringify(appData.order)] = res;
        appData.clearBasket();
        handleSuccess(res);
      })
      .catch((err) => {
        console.error(err);
      });
  }
});

// Блок крутки если открыт попап
events.on('modal:open', () => {
	page.locked = true;
});

// (то что выше ↑↑↑) Разблок прокрутки
events.on('modal:close', () => {
	page.locked = false;
});

// Получаем товары с сервера
api
	.getProductList()
	.then(appData.setCatalogue.bind(appData))
	.catch((err) => {
		console.error(err);
	});