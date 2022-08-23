/* warn: this may case issue as rollup treats absoule paths as internal */
/* can maybe use https://github.com/dot-build/rollup-plugin-includepaths to remedy this */
import {
  IHandlerRegistry,
  IClassHandler as IMessageHandler,
  IMessage,
} from 'src/base';

export class DefaultHandlerRegistry implements IHandlerRegistry {
  private listenerMap: Map<string, Set<IMessageHandler<IMessage>>> = new Map();

  register<T extends IMessage>(handler: IMessageHandler<T>): void {
    const eventType = handler.eventType;

    const event = new eventType();
    const eventName = event.name;

    if (this.listenerMap.has(eventName)) {
      this.listenerMap.get(eventName)?.add(handler);
    } else {
      this.listenerMap.set(eventName, new Set([handler]));
    }
  }

  getAll(): ReadonlyMap<string, ReadonlySet<IMessageHandler<IMessage>>> {
    return this.listenerMap;
  }

  reset(): void {
    this.listenerMap.clear();
  }
}
