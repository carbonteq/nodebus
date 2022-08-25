import { ClassConstructor } from './type-utils';
import { IMessage } from './message';

export interface IClassHandler<T extends IMessage> {
  // warn: should change this to message type, or just _type
  eventType: ClassConstructor<T>;

  handle(event: T): void;
}
