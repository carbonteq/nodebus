import { IClassHandler } from '@carbonteq/nodebus-core';
import { FooEvent } from '@src/app/events';

export class FooEventHandler implements IClassHandler<FooEvent> {
  eventType = FooEvent;

  handle(event: FooEvent): void {
    console.debug('Received event in FooHandler: ', event);
  }
}
