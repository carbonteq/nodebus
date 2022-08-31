import { Bus } from '@carbonteq/nodebus-core';

export abstract class BusService {
  abstract getBus(): Promise<Bus>;
}
