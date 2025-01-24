import { Component } from '../base/Component';
import { createElement, ensureElement } from '../../utils/utils';
import { EventEmitter } from '../base/events';
import { Card } from '../Card';
import { IBasketView, IAction } from '../../types/index';

export class Basket extends Component<IBasketView> {
  protected _list: HTMLElement;
  protected _total: HTMLElement;
  protected _button: HTMLElement;

  constructor(container: HTMLElement, protected events: EventEmitter) {
    super(container);

		this._list = ensureElement<HTMLElement>('.basket__list', this.container);
		this._total = this.container.querySelector('.basket__price');
		this._button = this.container.querySelector('.basket__button');
		this._button.addEventListener('click', () => {
				events.emit('order:open');
		});
    this.items = [];
  }

  set items(items: HTMLElement[]) {
    if (items.length) {
      this._list.replaceChildren(...items);
    } else {
      this._list.replaceChildren(createElement<HTMLParagraphElement>('p', {textContent: `Корзина пуста`}));
    };
  }

  get items(): HTMLElement[] {
    if (this._list.childElementCount === 0) {
      return [
        createElement<HTMLParagraphElement>('p', { 
          textContent: `Корзина пуста` 
        })
      ];
    }
    return Array.from(this._list.children) as HTMLElement[];
  }
  
	set selected(items: string[]) {
		if (items.length) {
			this.setDisabled(this._button, false);
		} else {
			this.setDisabled(this._button, true);
		}
	}

	set total(total: number) {
		this.setText(this._total, total + ' синапсов');
	}
}

export type IBasketIndex = {
  index: number;
}

export class BasketItem extends Card<IBasketIndex> {
  protected _index: HTMLElement;
  protected _button: HTMLButtonElement;
  constructor(container: HTMLElement, act?: IAction) {
    super('card', container);

    this._index = container.querySelector('.basket__item-index');
    this._button = container.querySelector('.basket__item-delete');
    this._button.addEventListener('click', act.onClick);
  }
  set index(value: number) { this.setText(this._index, value) }
}