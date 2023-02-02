import {
	Logger,
	ITransport,
	TransportMessage,
	DomainMessage,
} from '@carbonteq/nodebus-core';
import type { Redis } from 'ioredis';
import { randomUUID } from 'node:crypto';

export interface RedisTransportConfig {
	client: Redis; // ioredis client

	logger: Logger;

	queueName?: string;
}

export type RedisMessageType = string;
export type RedisTransportMessage = TransportMessage<RedisMessageType>;

export class RedisTransport implements ITransport<RedisMessageType> {
	static readonly DEFAULT_Q = 'defaultQ';

	private readonly client: Redis;
	private readonly logger: Logger;
	readonly queueName: string;

	constructor(cfg: RedisTransportConfig) {
		this.client = cfg.client;
		this.logger = cfg.logger;
		this.queueName = cfg.queueName ?? RedisTransport.DEFAULT_Q;

		this.logger.setContext('RedisTransport');
	}

	async initialize(): Promise<void> {
		const pong = await this.client.ping();
		console.log(pong);

		this.logger.debug('Redis Transport: Ping => ', pong);
	}

	private async addToQ(val: RedisMessageType): Promise<void> {
		await this.client.lpush(this.queueName, val);
	}

	async send(message: DomainMessage): Promise<void> {
		await this.addToQ(message);
	}

	async readNextMessage(): Promise<RedisTransportMessage | undefined> {
		const val = await this.client.rpop(this.queueName);

		if (val !== null) {
			const transportMsg = this.toTransportMessage(val);

			return transportMsg;
			// return JSON.parse(val);
		}
	}

	async deleteMessage(message: RedisTransportMessage): Promise<void> {
		await this.client.lrem(this.queueName, 1, message.raw);
	}

	async returnMessage(message: RedisTransportMessage): Promise<void> {
		await this.addToQ(message.raw);
	}

	toTransportMessage(domainMessage: DomainMessage): RedisTransportMessage {
		return {
			id: randomUUID(),
			raw: domainMessage,
			domainMessage,
		};
	}

	async length(): Promise<number> {
		return await this.client.llen(this.queueName);
	}

	async resetQueue(): Promise<void> {
		await this.client.del(this.queueName);
	}
}
