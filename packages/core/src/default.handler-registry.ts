import type { IHandlerRegistry, IClassHandler, IMessage } from './base';

export class DefaultHandlerRegistry implements IHandlerRegistry {
	private listenerMap: Map<string, Set<IClassHandler<IMessage>>> = new Map();

	register<T extends IMessage>(handler: IClassHandler<T>): void {
		const messageType = handler._type;

		const event = new messageType();
		const eventName = event.name;

		if (this.listenerMap.has(eventName)) {
			this.listenerMap.get(eventName)?.add(handler);
		} else {
			this.listenerMap.set(eventName, new Set([handler]));
		}
	}

	get<T extends IMessage>(msg: T): IClassHandler<T>[] {
		const handlers = this.listenerMap.get(msg.name);

		if (handlers !== undefined) {
			return Array.from(handlers.values()) as IClassHandler<T>[];
		}

		return [];
	}

	getAll(): ReadonlyMap<string, ReadonlySet<IClassHandler<IMessage>>> {
		return this.listenerMap;
	}

	reset(): void {
		this.listenerMap.clear();
	}
}
