import { IClassHandler } from './class-handler';
import { IMessage } from './message';

export interface IHandlerRegistry {
  register<T extends IMessage>(handler: IClassHandler<T>): void;

  getAll(): ReadonlyMap<string, ReadonlySet<IClassHandler<IMessage>>>;

  reset(): void;
}
