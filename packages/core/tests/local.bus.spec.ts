import { LocalBus, IEvent, IClassHandler } from '@carbonteq/nodebus-core';

class TestEvent implements IEvent {
  name = 'testEvent';
  time: Date;
  id: string;

  constructor(id: string) {
    this.id = id;
    this.time = new Date();
  }
}

class TestEventHandler implements IClassHandler<TestEvent> {
  eventType = TestEvent;

  handle(event: TestEvent): void {
    console.log(event);
  }
}

afterEach(() => {
  jest.restoreAllMocks();
});

describe('local bus', () => {
  it('event fires properly (and is handled)', async () => {
    const eventHandler = new TestEventHandler();

    const eventHandlerSpy = jest
      .spyOn(eventHandler, 'handle')
      .mockImplementationOnce(() => {});

    const event = new TestEvent('randomId');
    const eventBus = new LocalBus();
    eventBus.subscribe(eventHandler);

    await eventBus.start();
    await eventBus.publish(event);

    expect(eventHandlerSpy).toHaveBeenCalled();
    expect(eventHandlerSpy).toHaveBeenCalledWith(event);
    expect(eventHandlerSpy).toHaveReturnedWith(undefined);
  });
});
