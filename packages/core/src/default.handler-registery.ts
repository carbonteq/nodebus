import {
  IHandlerRegistery,
  IClassHandler as IMessageHandler,
  IMessage,
  ClassConstructor,
} from '@src/base';

export class DefaultHandlerRegistery implements IHandlerRegistery {
  private listenerMap: Map<string, Set<IMessageHandler<IMessage>>> = new Map();

  register<T extends IMessage>(
    eventType: ClassConstructor<T>,
    handler: IMessageHandler<T>,
  ): void {
    const event = new eventType();
    const eventName = event.name;

    if (this.listenerMap.has(eventName)) {
      this.listenerMap.get(eventName)!.add(handler);
    } else {
      this.listenerMap.set(eventName, new Set([handler]));
    }
  }

  getAll(): ReadonlyMap<string, ReadonlySet<IMessageHandler<IMessage>>> {
    // warn: maybe send a copy instead of the original to prevent mutation
    return this.listenerMap;
  }

  reset(): void {
    this.listenerMap.clear();
  }
}
