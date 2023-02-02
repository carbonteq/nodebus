import type { ClassConstructor } from './type-utils';
import type { IMessage } from './message';

export interface IClassHandler<T extends IMessage> {
	_type: ClassConstructor<T>;

	handle(message: T): void;
}
