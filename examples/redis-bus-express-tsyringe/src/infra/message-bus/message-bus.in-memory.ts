import Redis from 'ioredis';
import { BusBuilder, Bus, PinoLogger } from '@carbonteq/nodebus-core';
import { RedisTransport } from '@carbonteq/nodebus-transport-redis';
import { FooEventHandler } from '@src/app/handlers';
import { BusService } from '@src/app/services';
import { singleton } from 'tsyringe';

@singleton()
export class BusServiceProvider implements BusService {
  private bus: Bus;

  constructor() {
    this.getBus();
  }

  async getBus(): Promise<Bus> {
    if (!this.bus) {
      const redisClient = new Redis();
      const logger = new PinoLogger('redis-express-tsyringe');

      const transport = new RedisTransport({ client: redisClient, logger });

      const bus = await BusBuilder.configure()
        .withTransport(transport)
        .withLogger(logger)
        .addHandler(new FooEventHandler()) // or inject it
        .initialize();
      await bus.start();

      this.bus = bus;
    }

    return this.bus;
  }
}
