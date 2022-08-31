import { inject, injectable } from 'inversify';
import { BusService } from './bus.service';

@injectable()
export class BarService {
  @inject(BusService)
  private busService: BusService;

  async doSomething(withId: string): Promise<void> {
    // console.log('Bus: ', this.bus());
    const bus = await this.busService.getBus();
    console.log('Bus: ', bus.state);

    console.debug('lala');
  }
}
