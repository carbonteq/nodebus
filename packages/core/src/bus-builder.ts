import {
  IClassHandler,
  IHandlerRegistry,
  IMessage,
  ITransport,
  ISerializer,
} from './base';
import { Bus } from './bus';
import { DefaultHandlerRegistry } from './default.handler-registry';
import { InMemoryTransport } from './in-memory.transport';
import { JSONSerializer } from './json.serializer';

export class BusBuilder {
  private transport?: ITransport;
  private busInstance?: Bus;

  private registry: IHandlerRegistry;
  private serializer: ISerializer;

  private constructor() {
    this.registry = new DefaultHandlerRegistry();
    this.serializer = new JSONSerializer();
  }

  static configure(): BusBuilder {
    return new BusBuilder();
  }

  async initialize(): Promise<Bus> {
    this.verifyNotAlreadyInitialized();

    const transport = this.transport ?? new InMemoryTransport();

    await transport.initialize(this.registry);

    this.busInstance = new Bus(transport, this.registry, this.serializer);

    const registeredMessages = Array.from(this.registry.getAll().keys());
    console.debug('Bus initialized', { registeredMessages });

    return this.busInstance;
  }

  withHandler(handler: IClassHandler<IMessage>): this {
    this.verifyNotAlreadyInitialized();

    /* const handlerInstance = new handler() */
    this.registry.register(handler);

    return this;
  }

  withTransport(transport: ITransport): this {
    this.verifyNotAlreadyInitialized();

    this.transport = transport;

    return this;
  }

  withSerializer(serializer: ISerializer): this {
    this.serializer = serializer;

    return this;
  }

  private verifyNotAlreadyInitialized() {
    if (this.busInstance !== undefined) {
      throw new Error('bus already initialized');
    }
  }
}
