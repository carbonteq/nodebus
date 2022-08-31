import { BarService } from '@src/app/services';
import { Router } from 'express';
import { autoInjectable } from 'tsyringe';
import type { Controller } from './base.controller';

@autoInjectable()
export class TestController implements Controller {
  readonly prefix = '/test';

  private readonly router: Router = Router();

  constructor(private readonly serv: BarService) {}

  async testEventDefaultId() {
    const id = 'some random id';

    this.serv.doSomething(id);

    return { id };
  }

  async testEventWithId(id: string) {
    this.serv.doSomething(id);

    return { id };
  }

  getRouter(): Router {
    this.router.get('/', async (_, resp) =>
      resp.send(await this.testEventDefaultId()),
    );

    this.router.get('/:id', async (req, resp) => {
      const id = req.params.id;

      await this.testEventWithId(id);

      return resp.send({ id });
    });

    return this.router;
  }
}
