import { container } from 'tsyringe';

import { TestController } from './test.controller';

import type { Express } from 'express';
import type { Controller } from './base.controller';

type Constructor<T> = new (...args: any[]) => T;

const controllers: Constructor<Controller>[] = [TestController];

export const setupRoutes = (app: Express) => {
  for (const c of controllers) {
    const controller = container.resolve(c);
    const controllerRouter = controller.getRouter();
    const prefix = controller.prefix ?? '/';

    app.use(prefix, controllerRouter);
  }
};
