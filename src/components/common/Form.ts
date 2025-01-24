import { IState } from '../../types/index';
import { ensureElement } from '../../utils/utils';
import { Component } from '../base/Component';
import { IEvents } from '../base/events';


export class Form<T> extends Component<IState> {
	protected _errors: HTMLElement;

	constructor(protected container: HTMLFormElement, protected events: IEvents) {
		super(container);

		this._errors = ensureElement<HTMLElement>('.form__errors', this.container);
		this.container.addEventListener('input', (e: Event) => {
			const target = e.target as HTMLInputElement;
			const field = target.name as keyof T;
			const value = target.value;
			this.onInputChange(field, value);
		});
	}

	protected onInputChange(field: keyof T, value: string) {
		this.events.emit(`order:change`, { field, value });
	}

	protected onPaymentChange(value: string) {
		this.events.emit(`order:change`, { field: 'payment', value });
	}	

	set errors(value: string) {
		this.setText(this._errors, value);
	}

	render(state: Partial<T> & IState) {
		const { validation, errors, ...inputs } = state;
		super.render({ validation, errors });
		Object.assign(this, inputs);
		return this.container;
	}
}