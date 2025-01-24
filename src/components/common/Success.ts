import { ensureElement } from '../../utils/utils';
import { Component } from '../base/Component';

interface ISuccess {
  total: number;
}

interface IActionsSuccess {
	onClick: () => void;
}

export class Success extends Component<ISuccess> {
  protected _close: HTMLElement;
  protected _total: HTMLElement;
  constructor(container: HTMLElement, act?: IActionsSuccess) {
    super(container);
    this._total = ensureElement<HTMLElement>('.order-success__description', this.container);
    this._close = ensureElement<HTMLElement>('.button', this.container);
    this._close.addEventListener('click', act.onClick);
  }
  
  set total(total: number) {
    this.setText(this._total, `Списано ${total} синапсов`)
  }

}