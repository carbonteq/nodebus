import {ILogger, ITransport} from '@carbonteq/nodebus-core';
import type { Redis } from 'ioredis';

export class RedisTransport implements ITransport {
  static readonly DEFAULT_Q = 'defaultQ';

  constructor(readonly client: Redis, private readonly logger: ILogger) {
    logger.setContext("RedisTransport")
  }

  async initialize(): Promise<void> {
    const pong = await this.client.ping();

    this.logger.debug('Redis Transport: Ping => ', pong);
  }

  async send(message: string): Promise<void> {
    await this.client.lpush(RedisTransport.DEFAULT_Q, message);
  }

  async readNextMessage(): Promise<string | undefined> {
    const val = await this.client.rpop(RedisTransport.DEFAULT_Q);

    if (val !== null) return val;
  }

  async deleteMessage(message: string): Promise<void> {
    await this.client.lrem(RedisTransport.DEFAULT_Q, 1, message);
  }

  async returnMessage(message: string): Promise<void> {
    await this.send(message);
  }

  async length(): Promise<number> {
    return await this.client.llen(RedisTransport.DEFAULT_Q)
  }

  async resetQueue(): Promise<void>{
    await this.client.del(RedisTransport.DEFAULT_Q)
  }
}
