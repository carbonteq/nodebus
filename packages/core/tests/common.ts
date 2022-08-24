import { IClassHandler, IEvent } from '@carbonteq/nodebus-core';

export const sleep = (ms: number) =>
  new Promise(resolve => setTimeout(resolve, ms));

export class TestEvent implements IEvent {
  name = 'TestEvent';
  time: Date;

  constructor(readonly id: string) {
    this.time = new Date();
  }
}

export class TestEventHandler implements IClassHandler<TestEvent> {
  eventType = TestEvent;

  handle(event: TestEvent): void {
    console.log('Handling: ', event);
  }
}
