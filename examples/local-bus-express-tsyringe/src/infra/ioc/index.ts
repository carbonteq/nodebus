import { container } from 'tsyringe';
import { BusServiceProvider } from '@src/infra/message-bus';
import { BusService } from '@src/app/services';
import { BusServiceToken } from '@src/app/ioc/constants';

container.register<BusService>(BusServiceToken, {
  useClass: BusServiceProvider,
});
