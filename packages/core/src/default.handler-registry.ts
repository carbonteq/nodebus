/* warn: this may case issue as rollup treats absoule paths as internal */
/* can maybe use https://github.com/dot-build/rollup-plugin-includepaths to remedy this */
import { IHandlerRegistry, IClassHandler, IMessage } from 'src/base';

export class DefaultHandlerRegistry implements IHandlerRegistry {
	private listenerMap: Map<string, Set<IClassHandler<IMessage>>> = new Map();

	register<T extends IMessage>(handler: IClassHandler<T>): void {
		const eventType = handler.eventType;

		const event = new eventType();
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
