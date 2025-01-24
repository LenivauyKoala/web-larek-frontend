//Тип для категории продуктов которые написаны в карточках товаров
export type productCategory = 'софт-скил' | 'другое' | 'дополнительное' | 'кнопка' | 'хард-скил'

//Интерфейс для продукта
export interface IProduct {
  id: string;
  category: productCategory;
  title: string;
  description: string;
  image: string;
  price: number | null;
}

//Интерфейс для формы заказа
export interface IOrderForm extends IContactForm {
  items: string[];
  address: string;
  payment: string;
  total: number;
}

export interface IContactForm {
  email: string;
  phone: string;
}

//Интерфейс для результата заказа
export interface IOrderResult {
  id: string;
  total: number;
}

// Новое

export interface IAction {
  onClick: (evt: MouseEvent) => void; 
}

export interface IPage {
  counter: number;
  products: HTMLElement[];
  locked: boolean;
}

export interface IBasketView {
	items: HTMLElement[];
	total: number;
	selected: string[];
}

export interface OrderUnion extends ContactsErrors, OrderErrors {}

export type OrderErrors = {
  address?: string;
  payment?: string;
};

export type ContactsErrors = {
  email?: string;
  phone?: string;
};

export interface IState {
  validation: boolean;
  errors: string[];
}

export interface IOrderSuccess extends ContactsErrors, OrderErrors, IState {
  items: string[];
  total: number;
}