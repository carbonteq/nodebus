import { Bus, BusBuilder, PinoLogger } from "@carbonteq/nodebus-core";
import { Provider } from "@nestjs/common";
import { FooEventHandler } from "@src/app/handlers/foo.handler";
import Redis from "ioredis";
import {
  RedisTransport,
  RedisTransportConfig,
} from "@carbonteq/nodebus-transport-redis";

export const RedisBusProvider: Provider<Bus> = {
  provide: Bus,
  useFactory: async () => {
    const redisClient = new Redis();
    const pinoLogger = new PinoLogger();

    const cfg: RedisTransportConfig = {
      client: redisClient,
      logger: pinoLogger,
      queueName: "randomName", // optional, RedisTransport.DEFAULT_Q by default
    };

    const redisTransport = new RedisTransport(cfg);

    const bus = await BusBuilder.configure()
      .withTransport(redisTransport)
      // you can also mark FooEventHandler as Injectable if you want a singleton with some specific config etc
      // and then use https://docs.nestjs.com/fundamentals/custom-providers#factory-providers-usefactory to inject it here
      .addHandler(new FooEventHandler())
      .initialize(); // transport will init here

    await bus.start();

    return bus;
  },
};
