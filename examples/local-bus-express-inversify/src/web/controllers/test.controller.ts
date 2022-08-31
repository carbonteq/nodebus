import { BarService } from '@src/app/services';
import { controller, interfaces, httpGet } from 'inversify-express-utils';
import { inject } from 'inversify';

@controller('/test')
export class TestController implements interfaces.Controller {
  @inject(BarService)
  private serv: BarService;

  @httpGet('/')
  async testEventDispatch() {
    this.serv.doSomething('some random id');

    return { status: 'ok' };
  }
}
