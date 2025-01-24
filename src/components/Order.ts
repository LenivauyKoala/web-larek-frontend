import { IEvents } from './base/events';
import { ensureElement } from '../utils/utils';
import { Form } from './common/Form';
import { OrderUnion } from '../types';

export class Order extends Form<OrderUnion> {
  protected _submit: HTMLButtonElement;
  protected _button: HTMLButtonElement;
  protected _buttonCard: HTMLButtonElement;
	protected _buttons: HTMLButtonElement[];

  constructor(container: HTMLFormElement, events: IEvents) {
    super(container, events);

    this._submit = ensureElement<HTMLButtonElement>('button[type=submit]', this.container);
    this._button = container.querySelector('[name=cash]');
    this._buttonCard = container.querySelector('[name=card]');

    if (this._button) {
        this._button.addEventListener('click', () => {
            this.onPaymentChange('offline');
            this._button.classList.add('button_alt-active');
            if (this._buttonCard) {
                this._buttonCard.classList.remove('button_alt-active');
            }
        });
    }

    if (this._buttonCard) {
        this._buttonCard.addEventListener('click', () => {
            this.onPaymentChange('online');
            this._buttonCard.classList.add('button_alt-active');
            if (this._button) {
                this._button.classList.remove('button_alt-active');
            }
        });
    }
    
    this.container.addEventListener('submit', (evt: Event) => {
      evt.preventDefault();
      this.events.emit('contacts:open');
    })
  }

  set valid(value: boolean) {
    this._submit.disabled = !value;
  }

  set address(value: string) { (this.container.elements.namedItem('address') as HTMLInputElement).value = value; }
}