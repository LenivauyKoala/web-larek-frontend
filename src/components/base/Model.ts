import { IEvents } from './events';

export const isModel = (obj: unknown): obj is Model<any> => {
	return obj instanceof Model;
}

export abstract class Model<T> {
	constructor(data: Partial<T>, protected event: IEvents) {
		Object.assign(this, data);
	}

	emitChanges(event: string, payload?: object) {
		this.event.emit(event, payload ?? {});
	}
}