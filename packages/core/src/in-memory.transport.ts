import { EventEmitter } from 'node:events';
import { Logger, ITransport, TransportMessage, DomainMessage } from './base';
import { PinoLogger } from './pino.logger';
import { randomUUID } from 'node:crypto';

export interface InMemoryTransportConfig {
	receiveTimeoutMs: number; // number of seconds to wait while attempting to wait for the next message
}

const defaultConfig: Readonly<InMemoryTransportConfig> = {
	receiveTimeoutMs: 1000, // 1 second
};

type InMemoryTransportMessageType = string;
export type InMemoryTransportMessage =
	TransportMessage<InMemoryTransportMessageType>;

// todo: add retry strat and better queue impl
export class InMemoryTransport
	implements ITransport<InMemoryTransportMessageType>
{
	private readonly logger: Logger;
	private readonly cfg: InMemoryTransportConfig;

	static readonly QUEUE_REENTRY_DELAY_MS = 2000;

	private queue: InMemoryTransportMessage[] = [];
	private queuePushed: EventEmitter = new EventEmitter();
	/* private _deadLetterQueue: InMemoryQueue = []; */

	constructor(cfg?: Partial<InMemoryTransportConfig> & { logger?: Logger }) {
		this.logger = cfg?.logger ?? new PinoLogger('InMemoryTransport');
		this.cfg = {
			receiveTimeoutMs: cfg?.receiveTimeoutMs ?? defaultConfig.receiveTimeoutMs,
		};
	}

	async initialize(): Promise<void> {
		// connect to underlying transport here
	}

	async send(domainMessage: string): Promise<void> {
		this.addToQueue(domainMessage);
	}

	readNextMessage(): Promise<InMemoryTransportMessage | undefined> {
		// this.logger.debug('Reading next message', { len: this.length });

		return new Promise((resolve) => {
			const onMessageEmitted = () => {
				unsubscribeEmitter();
				clearTimeout(timeoutToken);
				resolve(getNextMessage());
			};

			this.queuePushed.on('pushed', onMessageEmitted);
			const unsubscribeEmitter = () => {
				this.queuePushed.off('pushed', onMessageEmitted);
			};

			const getNextMessage = () => {
				// const availableMsgs = this.queue.filter(m => !m.inFlight);

				const message = this.queue.shift();
				if (message === undefined) {
					this.logger.debug('No messages available in the queue');
					return;
				}

				return message;
			};

			const timeoutToken = setTimeout(() => {
				unsubscribeEmitter();
				resolve(undefined);
			}, this.cfg.receiveTimeoutMs);

			const nextMsg = getNextMessage();
			if (nextMsg) {
				unsubscribeEmitter();
				clearTimeout(timeoutToken);
				resolve(nextMsg);
			}
		});
	}

	async deleteMessage(message: InMemoryTransportMessage): Promise<void> {
		this.logger.debug('No need to delete message from in-memory queue', {
			message,
		});
		// const msgIdx = this.queue.indexOf(message);
		//
		// if (msgIdx < 0) {
		//   this.logger.debug('Message already deleted', { message });
		//   return;
		// }
		//
		// this.logger.debug('Deleting message', { len: this.length, msgIdx });
		// this.queue.splice(msgIdx, 1);
		// this.logger.debug('Deleted message', { len: this.length, msgIdx });
	}

	async returnMessage(message: InMemoryTransportMessage): Promise<void> {
		// todo: replace with retry strategy

		setTimeout(() => {
			this.queue.push(message);
		}, InMemoryTransport.QUEUE_REENTRY_DELAY_MS);
	}

	toTransportMessage(domainMessage: DomainMessage): InMemoryTransportMessage {
		return {
			id: randomUUID(),
			domainMessage,
			raw: domainMessage,
		};
	}

	private addToQueue(message: DomainMessage) {
		const transportMsg = this.toTransportMessage(message);
		this.queue.push(transportMsg);

		this.logger.debug('Added message to the queue', {
			queueSize: this.length,
			transportMsg,
		});
	}

	get length(): number {
		return this.queue.length;
	}
}
