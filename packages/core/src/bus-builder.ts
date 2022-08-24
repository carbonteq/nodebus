import {
  IClassHandler,
  IHandlerRegistry,
  IMessage,
  ITransport,
  ISerializer,
  BaseSerializable,
} from './base';
import { Bus } from './bus';
import { DefaultHandlerRegistry } from './default.handler-registry';
import { InMemoryTransport } from './in-memory.transport';
import { JsonObject, JSONSerializer } from './json.serializer';

interface BuilderOpts<TransportMessageType extends BaseSerializable> {
  transport?: ITransport<TransportMessageType, IMessage>;
  registry?: IHandlerRegistry;
  serializer?: ISerializer;
}

export class BusBuilder<
  TransportMessageType extends BaseSerializable = JsonObject
> {
  private transport?: ITransport<TransportMessageType, IMessage>;
  private busInstance?: Bus;

  private registry: IHandlerRegistry;
  private serializer: ISerializer;

  private constructor(opts?: BuilderOpts<TransportMessageType>) {
    this.transport = opts?.transport;
    this.registry = opts?.registry ?? new DefaultHandlerRegistry();
    this.serializer = opts?.serializer ?? new JSONSerializer();
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

  withTransport<T>(transport: ITransport<T, IMessage>): BusBuilder<T> {
    this.verifyNotAlreadyInitialized();

    const cfg = this.getOpts();

    return new BusBuilder({
      ...cfg,
      transport,
    });
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

  private getOpts(): BuilderOpts<TransportMessageType> {
    return {
      transport: this.transport,
      serializer: this.serializer,
      registry: this.registry,
    };
  }
}
