import { IMessage } from './message';
import { IClassHandler } from './class-handler';

export interface IMessageBus {
  publish(event: IMessage): Promise<IMessage>;

  subscribe<T extends IMessage>(handler: IClassHandler<T>): void;

  start(): void;
}
