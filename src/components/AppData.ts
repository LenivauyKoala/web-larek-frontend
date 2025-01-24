import { IState, IProduct, IOrderForm, OrderErrors, ContactsErrors, OrderUnion} from '../types/index';
import { Model } from './base/Model';

export class AppData extends Model<IState> {
  catalogue: IProduct[];
  order: IOrderForm = {
    email: '',
    phone: '',
    address: '',
    payment: '',
    total: null,
    items: [],
  };
  formOrderErrors: OrderErrors = {};
  formContactsErrors: ContactsErrors = {};

  toggleOrderedProduct(id: string, isIncluded: boolean) {
    if (isIncluded) {
      this.order.items = [...new Set([...this.order.items, id])];
    } else {
      this.order.items = this.order.items.filter((it) => it !== id);
    }
  }

  clearBasket() {
    this.order.items.forEach((id) => this.toggleOrderedProduct(id, false));
    this.clearOrderData();
    this.emitChanges('basket:changed', { order: this.order });
  }

  clearOrderData() {
    this.order.email = '';
    this.order.address = '';
    this.order.payment = '';
    this.order.phone = '';
  }

  getTotal() {
    return (this.order.total = this.order.items.reduce(
      (acc, curr) => acc + Number(this.catalogue.find((it) => it.id === curr)?.price || 0),
      0
    ));
  }

  setCatalogue(items: IProduct[]) {
    this.catalogue = items;
    this.emitChanges('items:changed', { catalogue: this.catalogue });
  }

  getCards(): IProduct[] {
    return this.catalogue.filter((item) => this.order.items.includes(item.id));
  }

  isFullDataOrder(): boolean {
    return !!this.order.address && !!this.order.payment;
  }

  isFullDataContacts(): boolean {
    return !!this.order.email && !!this.order.phone;
  }

  

  setData(field: keyof OrderUnion, value: string) {
    this.order[field] = value;

    if (['address', 'payment'].includes(field)) {
      this.validateOrder();
    }

    if (['email', 'phone'].includes(field)) {
      this.validateContacts();
    }
  }

  validateOrder() {
    const errors: typeof this.formOrderErrors = {};
    if (!this.order.address) errors.address = 'Укажите адрес';
    if (!this.order.payment) errors.payment = 'Укажите способ оплаты';

    this.formOrderErrors = errors;
    this.event.emit('formOrderErrors:change', this.formOrderErrors);
    return Object.keys(errors).length === 0;
  }

  validateContacts() {
    const errors: typeof this.formContactsErrors = {};
    if (!this.order.email) errors.email = 'Укажите email';
    if (!this.order.phone) errors.phone = 'Укажите номер телефона';

    this.formContactsErrors = errors;
    this.event.emit('formContactsErrors:change', this.formContactsErrors);
    return Object.keys(errors).length === 0;
  }
}