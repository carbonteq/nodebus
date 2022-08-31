import { inject, injectable } from 'inversify';
import { FooEvent } from '../events';
import { BusService } from './bus.service';

@injectable()
export class BarService {
  @inject(BusService)
  private busService: BusService;

  async doSomething(withId: string): Promise<void> {
    const bus = await this.busService.getBus();

    const event = new FooEvent(withId);
    await bus.send(event);
  }
}
