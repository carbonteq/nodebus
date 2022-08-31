import { Bus } from '@carbonteq/nodebus-core';
import { BarService } from '@src/app/services';
import { Container } from 'inversify';
import { createBus } from '@src/infra/message-bus';
import { makeLoggerMiddleware } from 'inversify-logger-middleware';

export const container = new Container();
const logger = makeLoggerMiddleware();

container.applyMiddleware(logger);

// container.bind<() => Promise<Bus>>('BusProvider').toProvider<Bus>((ctx) => {
//   return () => {
//     return new Promise((resolve, reject) => {
//       createBus().then(resolve).catch(reject);
//     });
//   };
// });
// container
//   .bind<Bus>(Bus)
//   .toDynamicValue(
//     (ctx) => new Promise((resolve) => createBus().then((bus) => resolve(bus))),
//   );
container.bind<BarService>(BarService).toSelf().inSingletonScope();
// container.bind<Bus>(Bus).toFactory<Bus>(createBus);
