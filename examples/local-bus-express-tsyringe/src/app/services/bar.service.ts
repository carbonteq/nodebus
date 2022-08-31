import { inject, injectable } from 'tsyringe';
import { FooEvent } from '../events';
import { BusService } from './bus.service';
import { BusServiceToken } from '@src/app/ioc/constants';

@injectable()
export class BarService {
  constructor(
    @inject(BusServiceToken) private readonly busService: BusService,
  ) {}

  async doSomething(withId: string): Promise<void> {
    const bus = await this.busService.getBus();

    const event = new FooEvent(withId);
    await bus.send(event);
  }
}
