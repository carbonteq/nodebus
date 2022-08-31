import { BusBuilder, Bus, PinoLogger } from '@carbonteq/nodebus-core';
import { FooEventHandler } from '@src/app/handlers';
import { BusService } from '@src/app/services';
import { injectable } from 'inversify';
import Redis from 'ioredis';
import {
  RedisTransport,
  RedisTransportConfig,
} from '@carbonteq/nodebus-transport-redis';

@injectable()
export class BusServiceProvider implements BusService {
  private bus: Bus;

  constructor() {
    this.getBus();
  }

  async getBus(): Promise<Bus> {
    if (!this.bus) {
      const redisClient = new Redis();
      const pinoLogger = new PinoLogger(); // not required

      const cfg: RedisTransportConfig = {
        client: redisClient,
        logger: pinoLogger,
        queueName: 'redisExpressInversify', // optional
      };

      const transport = new RedisTransport(cfg);
      // await transport.initialize();

      const bus = await BusBuilder.configure()
        .withTransport(transport)
        .withLogger(pinoLogger)
        .addHandler(new FooEventHandler()) // or inject it
        .initialize(); // transport will init here

      await bus.start();

      this.bus = bus;
    }

    return this.bus;
  }
}
