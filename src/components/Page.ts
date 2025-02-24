import { ensureElement } from '../utils/utils';
import { Component } from './base/Component';
import { IEvents } from './base/events';
import { IPage } from '../types/index';

export class Page extends Component<IPage> {
  protected _counter: HTMLElement;
  protected _products: HTMLElement;
  protected _wrapper: HTMLElement;
  protected _basket: HTMLElement;

  constructor(container: HTMLElement, protected events: IEvents) {
    super(container);

    this._counter = ensureElement<HTMLElement>('.header__basket-counter');
    this._products = ensureElement<HTMLElement>('.gallery');
    this._wrapper = ensureElement<HTMLElement>('.page__wrapper');
    this._basket = ensureElement<HTMLElement>('.header__basket');
    this._basket.addEventListener('click', () => this.events.emit('basket:open'));
  }

  set counter(value: number) {
    this.setText(this._counter, String(value));
  }

  set products(items: HTMLElement[]) {
    this._products.replaceChildren(...items);
  }

  set locked(value: boolean) {
		if (value) {
			this._wrapper.classList.add('page__wrapper_locked');
		} else {
			this._wrapper.classList.remove('page__wrapper_locked');
		}
	}
}