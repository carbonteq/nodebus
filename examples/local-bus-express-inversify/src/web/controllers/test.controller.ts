import { BarService } from '@src/app/services';
import {
  controller,
  interfaces,
  httpGet,
  requestParam,
} from 'inversify-express-utils';
import { inject } from 'inversify';

@controller('/test')
export class TestController implements interfaces.Controller {
  @inject(BarService)
  private serv: BarService;

  @httpGet('/')
  async testEventDefaultId() {
    const id = 'some random id';

    this.serv.doSomething(id);

    return { id };
  }

  @httpGet('/:id')
  async testEventWithId(@requestParam('id') id: string) {
    this.serv.doSomething(id);

    return { id };
  }
}
