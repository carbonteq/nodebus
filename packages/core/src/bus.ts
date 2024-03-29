import {
	IClassHandler,
	IHandlerRegistry,
	Logger,
	IMessage,
	ISerializer,
	ITransport,
	TransportMessage,
} from './base';

export enum BusState {
	Starting = 'starting',
	Started = 'started',
	Stopping = 'stopping',
	Stopped = 'stopped',
}

const sleep = async (timeoutMs: number): Promise<void> =>
	new Promise((resolve) => setTimeout(resolve, timeoutMs));

const STARTED_STATES = new Set([BusState.Starting, BusState.Started]);
const STOP_STATES = new Set([BusState.Stopping, BusState.Stopped]);

export class Bus<TransportMessageType> {
	private runningWorkerCount = 0;
	private internalState: BusState = BusState.Stopped;

	static readonly EMPTY_QUEUE_SLEEP_MS = 500;

	constructor(
		private readonly transport: ITransport<TransportMessageType>,
		private readonly registry: IHandlerRegistry,
		private readonly serializer: ISerializer,
		private readonly logger: Logger,
	) {
		logger.setContext('Bus');

		const registeredMessages = Array.from(this.registry.getAll().keys());
		logger.debug('Bus initialized', { registeredMessages });
	}

	async send<T extends IMessage>(msg: T): Promise<void> {
		const serializedMsg = this.serializer.serialize(msg);

		await this.transport.send(serializedMsg);
	}

	async start(): Promise<void> {
		if (STARTED_STATES.has(this.internalState)) {
			throw new Error('Bus must be stopped before it can be started');
		}

		this.internalState = BusState.Starting;
		// todo: call transport start

		this.internalState = BusState.Started;

		// todo: add concurrency

		// await Promise.all([this.applicationLoop()]); // WARN: Never use this
		setTimeout(async () => this.applicationLoop(), 0);
		// setImmediate(async () => this.applicationLoop());

		this.logger.debug('Bus started with concurrency: 1');
	}

	async stop(): Promise<void> {
		if (STOP_STATES.has(this.internalState)) {
			throw new Error('Bus must be started before it can be stopped');
		}

		this.internalState = BusState.Stopping;
		//todo: call transport stop

		while (this.runningWorkerCount > 0) {
			await sleep(10);
		}

		this.internalState = BusState.Stopped;
		this.logger.info('Bus Stopped');
	}

	private async applicationLoop(): Promise<void> {
		this.runningWorkerCount++;

		this.logger.debug('Started application loop');
		while (this.internalState === BusState.Started) {
			const msgHandled = await this.handleNextMessage();

			// Avoids locking up CPU when no messages to be processed
			if (!msgHandled) {
				await sleep(Bus.EMPTY_QUEUE_SLEEP_MS);
			}
		}

		this.logger.debug('Stopping application loop');
		this.runningWorkerCount--;
	}

	private async handleNextMessage(): Promise<boolean> {
		const message = await this.transport.readNextMessage();
		if (!message) {
			return false;
		}

		this.logger.debug('Read next message from the transport');

		// add middleware stuff
		this.handleNextMessagePolled(message);
		// afterDispatchEmit

		return true;
	}

	async dispatchMessageToHandlers<T extends IMessage>(
		msg: T,
		handlers: IClassHandler<T>[],
	): Promise<void> {
		const handlersToInvoke = handlers.map((handler) =>
			this.dispatchMessageToHandler(msg, handler),
		);

		const handlerResults = await Promise.allSettled(handlersToInvoke);
		this.logger.debug('Message dispatched to all handlers', {
			msg,
			numHandlers: handlers.length,
		});

		const failed = handlerResults.filter((r) => r.status === 'rejected');

		if (failed.length > 0) {
			const reasons = (failed as PromiseRejectedResult[]).map((h) => h.reason);

			this.logger.error('Some handlers failed to run', { msg, reasons });
		}
	}

	async dispatchMessageToHandler<T extends IMessage>(
		msg: T,
		handler: IClassHandler<T>,
	): Promise<void> {
		return handler.handle(msg);
	}

	private async handleNextMessagePolled(
		msg: TransportMessage<TransportMessageType>,
	): Promise<void> {
		const naiveParsed = this.serializer.naiveDeserialize(msg.domainMessage);
		if (!this.verifyIsValidMessage(naiveParsed)) {
			this.logger.debug('Invalid message', msg);
			return;
		}

		const handlers = this.registry.get(naiveParsed as unknown as IMessage);
		if (handlers.length === 0) {
			this.logger.debug(
				`No handlers registered for ${naiveParsed}. Discarding...`,
			);
			return;
		}

		const msgDeserialized = this.serializer.deserialize(
			msg.domainMessage,
			handlers[0]._type,
		);

		// todo: maybe do the following two concurrently
		await this.dispatchMessageToHandlers(msgDeserialized, handlers);
		await this.transport.deleteMessage(msg);
	}

	get state(): BusState {
		return this.internalState;
	}

	// replace with error or result
	private verifyIsValidMessage(candidate: Record<string, unknown>): boolean {
		if (typeof candidate?.name !== 'string') {
			return false;
		}

		if (typeof candidate?.id !== 'string') {
			return false;
		}

		const time = candidate?.time;

		if (!time || typeof time !== 'string') {
			return false;
		}

		return new Date(time) !== null;
	}
}
