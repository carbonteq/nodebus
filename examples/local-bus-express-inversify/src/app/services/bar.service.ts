import { Bus } from '@carbonteq/nodebus-core';
import { createBus } from '@src/infra/message-bus';
import { inject, injectable, interfaces } from 'inversify';

@injectable()
export class BarService {
  // @inject('BusProvider')
  // private busProvider: interfaces.Provider<Bus>;
  // @inject(Bus)
  private bus: Bus;

  constructor() {
    this.getBus();
  }

  async getBus(): Promise<Bus> {
    if (!this.bus) {
      console.log('Creating bus');
      this.bus = await createBus();
      console.log('Created bus');
    }

    return this.bus;
  }

  async doSomething(withId: string): Promise<void> {
    // console.log('Bus: ', this.bus());
    // const bus = await this.getBus();
    console.log('Bus: ', this.bus.state);

    console.debug('lala');
  }
}
