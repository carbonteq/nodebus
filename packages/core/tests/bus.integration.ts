import {
  InMemoryTransport,
  Bus,
  BusBuilder,
  BusState,
  ISerializer,
  JSONSerializer,
} from '@carbonteq/nodebus-core';

import { sleep, TestEvent, TestEventHandler } from './common';

const evnt = new TestEvent('integration testing');
describe('Bus Tests', () => {
  describe('correct config', () => {
    let bus: Bus;
    let transport: InMemoryTransport;
    let serializer: ISerializer;
    const goodHandler = new TestEventHandler();

    const goodHandlerSpy = jest.spyOn(goodHandler, 'handle');

    beforeAll(async () => {
      transport = new InMemoryTransport();
      serializer = new JSONSerializer();

      const builder = BusBuilder.configure()
        .withTransport(transport)
        .withSerializer(serializer)
        .withHandler(goodHandler);
      bus = await builder.initialize();
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    describe('when starting bus', () => {
      it('should transition to Started state', async () => {
        await bus.start();
        expect(bus.state).toBe(BusState.Started);

        await bus.stop();
        expect(bus.state).toBe(BusState.Stopped);
      });

      describe('and when bus is started again', () => {
        it('should throw an error', async () => {
          await bus.start();
          await expect(bus.start()).rejects.toThrowError();
          await bus.stop();
        });
      });
    });

    describe('and when stopping the bus', () => {
      describe('when it is already running', () => {
        it('should stop the bus without error', async () => {
          await bus.start();
          await bus.stop();

          expect(bus.state).toBe(BusState.Stopped);
        });
      });

      describe('when it is not running', () => {
        it('should throw an error', async () => {
          await expect(bus.stop()).rejects.toThrowError();
        });
      });
    });

    describe('when a message is successfully handled from the queue', () => {
      beforeAll(async () => {
        await bus.start();
        await bus.send(evnt);
        await sleep(500);
      });

      afterAll(async () => {
        await bus.stop();
      });

      it('should delete msg from queue', async () => {
        expect(transport.length).toBe(0);
        expect(goodHandlerSpy).toHaveBeenCalledWith(serializer.toPlain(evnt));
      });
    });
  });
});
