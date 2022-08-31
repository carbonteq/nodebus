import { Bus, BusBuilder } from "@carbonteq/nodebus-core";
import { Provider } from "@nestjs/common";
import { FooEventHandler } from "@src/app/handlers/foo.handler";

export const MemoryBusProvider: Provider<Bus> = {
  provide: Bus,
  useFactory: async () => {
    const bus = await BusBuilder.configure()
      // you can also mark FooEventHandler as Injectable if you want a singleton with some specific config etc
      // and then use https://docs.nestjs.com/fundamentals/custom-providers#factory-providers-usefactory to inject it here
      .addHandler(new FooEventHandler())
      .initialize();

    await bus.start();

    return bus;
  },
};
