import { BusBuilder, Bus } from '@carbonteq/nodebus-core';

export const createBus = async (): Promise<Bus> => {
  const bus = await BusBuilder.configure().initialize();
  await bus.start();

  return bus;
};
