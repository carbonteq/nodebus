import {
  IClassHandler,
  IEvent,
  ICommand,
  ClassConstructor,
  IMessage,
} from '@carbonteq/nodebus-core';

export const sleep = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

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
    console.log('Handling TestEvent: ', event);
  }
}

export const getErronousHandler = <T extends IMessage>(
  msgType: ClassConstructor<T>,
) => {
  return class ErronousHandler implements IClassHandler<T> {
    eventType = msgType;
    timesFailed = 0;

    constructor(readonly timesToFail: number) {}

    handle(event: T): void {
      if (this.timesFailed++ < this.timesToFail) {
        throw new Error('from bad handler');
      }

      console.debug('Successful handling by bad handler', event);
    }
  };
};

export class FooEvent implements IEvent {
  name = 'FooEvent';
  time: Date;

  constructor(readonly id: string) {
    this.time = new Date();
  }
}

export class FooEventHandler implements IClassHandler<FooEvent> {
  eventType = FooEvent;

  handle(event: FooEvent): void {
    console.log('Handling FooEvent: ', event);
  }
}

export class BarCommand implements ICommand {
  name = 'BarCommand';

  time: Date;

  constructor(readonly id: string) {
    this.time = new Date();
  }
}

export class BarCommandHandler implements IClassHandler<BarCommand> {
  eventType: ClassConstructor<BarCommand> = BarCommand;

  handle(event: BarCommand): void {
    console.log('Handling BarCommand: ', event);
  }
}
