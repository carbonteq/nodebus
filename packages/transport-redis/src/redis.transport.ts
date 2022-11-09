import { ILogger, ITransport } from '@carbonteq/nodebus-core';
import type { Redis } from 'ioredis';

export interface RedisTransportConfig {
	client: Redis; // ioredis client

	logger: ILogger;

	queueName?: string;
}

export class RedisTransport implements ITransport {
	static readonly DEFAULT_Q = 'defaultQ';

	private readonly client: Redis;
	private readonly logger: ILogger;
	readonly queueName: string;

	constructor(cfg: RedisTransportConfig) {
		this.client = cfg.client;
		this.logger = cfg.logger;
		this.queueName = cfg.queueName ?? RedisTransport.DEFAULT_Q;

		this.logger.setContext('RedisTransport');
	}

	async initialize(): Promise<void> {
		const pong = await this.client.ping();

		this.logger.debug('Redis Transport: Ping => ', pong);
	}

	async send(message: string): Promise<void> {
		await this.client.lpush(this.queueName, message);
	}

	async readNextMessage(): Promise<string | undefined> {
		const val = await this.client.rpop(this.queueName);

		if (val !== null) {
			return val;
		}
	}

	async deleteMessage(message: string): Promise<void> {
		await this.client.lrem(this.queueName, 1, message);
	}

	async returnMessage(message: string): Promise<void> {
		await this.send(message);
	}

	async length(): Promise<number> {
		return await this.client.llen(this.queueName);
	}

	async resetQueue(): Promise<void> {
		await this.client.del(this.queueName);
	}
}
