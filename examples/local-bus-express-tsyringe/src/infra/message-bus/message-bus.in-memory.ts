import { BusBuilder, Bus } from '@carbonteq/nodebus-core';
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
      const bus = await BusBuilder.configure()
        .addHandler(new FooEventHandler()) // or inject it
        .initialize();
      await bus.start();

      this.bus = bus;
    }

    return this.bus;
  }
}
