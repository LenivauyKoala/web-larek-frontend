//Тип для категории продуктов которые написаны в карточках товаров
export type productCategory = 'софт-скил' | 'другое' | 'дополнительное' | 'кнопка' | 'хард-скил'

//Интерфейс для продукта
export interface IProduct {
  id: string;
  category: productCategory;
  title: string;
  description: string;
  image: string;
  cost: number;
}

//Интерфейс для формы заказа
export interface IOrderForm {
  email: string;
  phone: string;
  address: string;
  payMethod: 'онлайн' | 'при получении'; 
}

//Интерфейс для заказа, расширяет интерфейс IOrderForm
export interface IOrder extends IOrderForm {
  items: string[];
}

//Интерфейс для результата заказа
export interface IOrderResult {
  id: string;
  sum: number;
}

//Тип для ошибок формы
export type FormErrors = Partial<Record<keyof IOrder, string>>;

//Интерфейс описывает состояние приложения
export interface IState {
  catalog: IProduct[];
  basket: string[];
  preview: string | null;
  order: IOrder | null;
  loading: boolean;
}