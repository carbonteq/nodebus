import { ClassConstructor } from './type-utils';
import { IMessage } from './message';

export interface IClassHandler<T extends IMessage> {
  eventType: ClassConstructor<T>;

  handle(event: T): void;
}
