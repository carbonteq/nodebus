import { BusBuilder, Bus } from '@carbonteq/nodebus-core';
import { BusService } from '@src/app/services';
import { injectable } from 'inversify';

@injectable()
export class BusServiceProvider implements BusService {
  private bus: Bus;

  constructor() {
    this.getBus();
  }

  async getBus(): Promise<Bus> {
    if (!this.bus) {
      const bus = await BusBuilder.configure().initialize();
      await bus.start();

      this.bus = bus;
    }

    return this.bus;
  }
}
