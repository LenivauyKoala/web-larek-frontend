# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Webpack

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```
## Сборка

```
npm run build
```

или

```
yarn build
```

## Краткое описание проекта

Мини веб-приложение, которое предоствляет асмортимент разных товаров. Пользователь может ознакомиться с ними и оформить заказ.

## Описание возможных взаимодействий с проектом

Каталог товаров:
• При открытии веб-приложения, на странице отображаются товары
• У каждой карточки есть: категория товара, название, изображение и цена
• При нажатии на карточку товара, открывается модальное окно

Модальное окно карточки:
• Продублирована информация о товаре (категория, название, изображение, цена) и добавлено краткое описание
• Окно можно закрыть, нажав на «Крестик» или на задний фон
• Доступна возможность добавить товар в корзину, нажав кнопку «Купить»

Модальное окно корзины:
• Содержит список добавленных товаров (название, цена) и общую стоимость заказа
• Доступна возможность очистить корзину 
• Окно можно закрыть, нажав на «Крестик» или на задний фон
• При нажатии на кнопку «Оформить» произойдет переход к оформлению заказа

Модальное окно оформления заказа:
• Выбор способа оплаты: онлайн или при получении
• Заполнение адреса доставки
• Переход к следующему шагу по кнопке «Далее»
• Ввод данных получателя: email (почта) и телефон
• Подтверждение оформления заказа по кнопке «Оплатить»


## Архитектура приложения | Модель: MVP

Код разбит на три части по шаблону MVP:

• View: отображение данных
• Model: работа с данными
• Presenter: связывает Model и View

## Базовый код

### Класс «EventEmitter»

Обеспечивает работу событий. Его функции: возможность установить и снять слушателей событий, вызвать слушателей при возникновении события.

on(eventName, callback): установить обработчик события
off(eventName, callback): убрать обработчик события
onAll(callback): установить обработчик на все события
offAll(): убрать все обработчики
emit(eventName, data): инициализация события
trigger(eventName, context): коллбек-триггер, который создаёт событие при вызове

### Класс «Api»

Класс обеспечивает базовую логику отправки запросов.

constructor(baseUrl: string, options: RequestInit = {}) - инициализация API

baseUrl - базовый URL API
options - настройка запроса

get(uri: string) - отправляет GET запрос
post(uri: string, data: object, method: ApiPostMethods = 'POST') - отправляет POST запрос
handleResponse(response: Response) - обрабатывает ответ сервера и возвращает = ответ или ошибку

### Класс «Component»

Класс для всех компонентов, который можно использовать для создания DOM-элементов

constructor(container) - создание компонента

container - контейнер компонента

toggleClass(element, className, state?) - переключить класс
setText(element, value) - задать текстовое описание
setImage(element, src, alt) - задать изображение
setHidden(element) - скрыть элемент
setVisible(element) - показать элемент
setDisabled(element, state)
render(data?) - отображает модальное окно с указанными данными

### Класс «Model»

Модель данных, её задача управлять состоянием модели.

constructor(data, events) - создание модели

data - базовые данные
events - объект для работы с событиями

Тип для категории продуктов которые написаны в карточках товаров
type productCategory = 'софт-скил' | 'другое' | 'дополнительное' | 'кнопка' | 'хард-скил'

Интерфейс для продукта
interface IProduct {
  id: string;
  category: productCategory;
  title: string;
  description: string;
  image: string;
  cost: number;
}

Интерфейс для формы заказа
interface IOrderForm {
  email: string;
  phone: string;
  address: string;
  payMethod: 'онлайн' | 'при получении'; 
}

Интерфейс для заказа, расширяет интерфейс IOrderForm
interface IOrder extends IOrderForm {
  items: string[];
}

Интерфейс для результата заказа
interface IOrderResult {
  id: string;
  sum: number;
}

Тип для ошибок формы
type FormErrors = Partial<Record<keyof IOrder, string>>;

Интерфейс описывает состояние приложения
interface IState {
  catalog: IProduct[];
  basket: string[];
  preview: string | null;
  order: IOrder | null;
  loading: boolean;
}

## Компоненты

• Page: отображает страницу сайта

counter: HTMLElement - счётчик элементов
catalog: HTMLElement - каталог товаров
basket: HTMLElement - элемент корзины


• Product: карточка товара

id: HTMLElement - индивидуальный номер карточки
category: HTMLElement - категория карточки
title: HTMLElement - название карточки
description: HTMLElement - описание карточки
image: HTMLElement - изображение карточки
cost: HTMLElement - стоимость товара

• Order: форма заказа

phone: string - поле для ввода телефона
email: string - поле для ввода почты
address: string - поле для ввода адреса
payMethod: string - метод оплаты


• Basket: форма корзины

list: HTMLElement - список товаров в корзине
sum: HTMLElement - общая стоимость товаров
button: HTMLElement - кнопка оформления заказа

• Modal: работа модльных окон

buttonClose: HTMLElement - кнопка закрытия модального окна
content: HTMLElement - содержимое модального окна

• Complete: успешное оформление заказа

buttonСlose: HTMLElement - кнопка закрытия модального окна

• Success: отображение успешного заказа

total: HTMLElement - общая сумма заказа

## Интерфейс

IProduct - интерфейс для продукта
IOrder  - интерфейс описывает заказ
IOrderForm - интерфейс для формы заказа
IOrderResult - интерфейс для результата заказа
IState - интерфейс описывает состояние приложения


