import * as events from 'node:events';

import {
  IClassHandler,
  IHandlerRegistry,
  IMessage,
  IMessageBus,
  // ISerializable,
  // ISerializer,
} from 'src/base';
/* import { JSONSerializer } from './json.serializer'; */
import { DefaultHandlerRegistry } from './default.handler-registry';

/* const builder = new BusBuilder() */
/**/
/* builder.build() -> LocalBus */
/**/
/**/
/* builder.setDriver(bustype).build() -> bustype */
/**/
/* builder.setTransport(redisClient).setSerializer().build() -> redisBusInstanceA */

export class LocalBus implements IMessageBus {
  // warn: unused
  // private readonly serializer: ISerializer<ISerializable>;
  private readonly handlerRegistry: IHandlerRegistry;
  // fixme: why static?
  private static readonly eventEmitter = new events.EventEmitter();

  constructor() {
    // this.serializer = new JSONSerializer();
    this.handlerRegistry = new DefaultHandlerRegistry();
  }

  // warn: this requires the bus to be started either explicitly,
  // or we have to ensure that all the required events are registered before the bus starts
  async start(): Promise<void> {
    const listenerMap = this.handlerRegistry.getAll();

    listenerMap.forEach((handlers, eventName) => {
      handlers.forEach((handler) => {
        LocalBus.eventEmitter.on(eventName, handler.handle);
      });
    });
  }

  async publish(event: IMessage): Promise<IMessage> {
    // note: maybe serializer should be used here
    LocalBus.eventEmitter.emit(event.name, event);

    return event;
  }

  subscribe<T extends IMessage>(handler: IClassHandler<T>): void {
    this.handlerRegistry.register(handler);
  }
}
