import { IClassHandler } from './class-handler';
import { IMessage } from './message';

export interface IHandlerRegistry {
	register<T extends IMessage>(handler: IClassHandler<T>): void;

	get<T extends IMessage>(msg: T): IClassHandler<T>[];
	getAll(): ReadonlyMap<string, ReadonlySet<IClassHandler<IMessage>>>;

	reset(): void;
}

export class InvalidHandlerRegistry implements IHandlerRegistry {
	constructor() {
		throw new Error('invalid handler registry');
	}

	get(): IClassHandler<never>[] {
		throw new Error('Method not implemented.');
	}

	register(): void {
		throw new Error('Method not implemented.');
	}
	getAll(): never {
		throw new Error('Method not implemented.');
	}
	reset(): never {
		throw new Error('Method not implemented.');
	}
}
