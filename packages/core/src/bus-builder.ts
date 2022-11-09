import {
	IClassHandler,
	IHandlerRegistry,
	IMessage,
	ITransport,
	ISerializer,
	ILogger,
} from './base';
import { Bus } from './bus';
import { DefaultHandlerRegistry } from './default.handler-registry';
import { InMemoryTransport } from './in-memory.transport';
import { JSONSerializer } from './json.serializer';
import { PinoLogger } from './pino.logger';

export class BusBuilder {
	private transport?: ITransport;
	private busInstance?: Bus;

	private registry: IHandlerRegistry;
	private serializer: ISerializer;
	private logger: ILogger;

	private constructor() {
		this.registry = new DefaultHandlerRegistry();
		this.serializer = new JSONSerializer();
		this.logger = new PinoLogger('Bus');
	}

	static configure(): BusBuilder {
		return new BusBuilder();
	}

	// todo: make transport initialize optional
	async initialize(): Promise<Bus> {
		this.verifyNotAlreadyInitialized();

		const transport = this.transport ?? new InMemoryTransport();

		await transport.initialize(this.registry);

		this.busInstance = new Bus(
			transport,
			this.registry,
			this.serializer,
			this.logger,
		);

		return this.busInstance;
	}

	addHandler(handler: IClassHandler<IMessage>): this {
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

	withLogger(logger: ILogger): this {
		this.logger = logger;

		return this;
	}

	private verifyNotAlreadyInitialized() {
		if (this.busInstance !== undefined) {
			throw new Error('bus already initialized');
		}
	}
}
