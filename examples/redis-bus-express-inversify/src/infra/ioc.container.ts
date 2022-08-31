import { BarService, BusService } from '@src/app/services';
import { Container } from 'inversify';
import { BusServiceProvider } from '@src/infra/message-bus';
import { makeLoggerMiddleware } from 'inversify-logger-middleware';

export const container = new Container();
const logger = makeLoggerMiddleware();

container.applyMiddleware(logger);

container
  .bind<BusService>(BusService)
  .to(BusServiceProvider)
  .inSingletonScope();
container.bind<BarService>(BarService).toSelf().inSingletonScope();
