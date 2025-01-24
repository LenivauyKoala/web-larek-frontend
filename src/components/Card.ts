import { IProduct, IAction } from '../types/index';
import { ensureElement, bem } from '../utils/utils';
import { Component } from './base/Component';

// Отображение карточки продукта
export class Card<T extends IProduct | {}> extends Component<T | IProduct> {
  protected _category?: HTMLElement;
  protected _title: HTMLElement;
  protected _description?: HTMLElement;
  protected _image?: HTMLImageElement;
  protected _price: HTMLElement;
  protected _button?: HTMLButtonElement;

  constructor(protected blockName: string, container: HTMLElement, action?: IAction) {
    super(container);
    
    this._title = ensureElement<HTMLElement>(`.${blockName}__title`, container);
    this._image = container.querySelector(`.${blockName}__image`);
    this._price = ensureElement<HTMLElement>(`.${blockName}__price`, container);
    this._category = container.querySelector(`.${blockName}__category`);
    this._button = container.querySelector(`.${blockName}__button`);
    this._description = container.querySelector(`.${blockName}__text`);
    
    if (action?.onClick) {
      if (this._button) {
        this._button.textContent = 'Купить';
        this._button.addEventListener('click', action.onClick);
      } else {
        container.addEventListener('click', action.onClick);
      }
    }
  }

  public isPressed(value: boolean) {
    return value
      ? this.setText(this._button, 'В корзину')
      : this.setText(this._button, 'Купить')
  }

  set id(value: string) { 
    this.container.dataset.id = value
  }
  get id() { 
    return this.container.dataset.id || ''
  }
  
  set title(value: string) {
    this.setText(this._title, value)
  }
  get title() {
    return this._title.textContent || ''
  }

  set image(value: string) {
    this._image.setAttribute('src', value)
  }

  set price(value: number) {
    if (value === null || isNaN(value)) {
      this.setText(this._price, 'Бесценно');
      this.setDisabled(this._button, true);
    } else {
      this.setText(this._price, value + ' синапс');
      if (value !== 1) {
        this._price.textContent += 'ов';
      }
      this.setDisabled(this._button, false);
    }
  }  

  set category(value: string) { 
    const categorySkill: Record<string, string> = {
      ['софт-скил']: 'soft',
      ['хард-скил']: 'hard',
      ['кнопка']: 'button',
      ['другое']: 'other',
      ['дополнительное']: 'additional',
    };
    const categoryClass = bem(this.blockName, 'category', categorySkill[value]).name
    this.setText(this._category, value);
    this.toggleClass(this._category, categoryClass, true);
  }

  set description(value: string | string[]) {
    if (Array.isArray(value)) {
      this._description?.querySelectorAll('.description-item').forEach((element: HTMLElement, index: number) => { 
        this.setText(element, value[index]);
      });
    } else {
      this.setText(this._description, value);
    }
  }
}
