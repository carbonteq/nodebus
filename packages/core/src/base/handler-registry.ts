import { IClassHandler } from './class-handler';
import { IMessage } from './message';

export interface IHandlerRegistry {
  register<T extends IMessage>(handler: IClassHandler<T>): void;

  getAll(): ReadonlyMap<string, ReadonlySet<IClassHandler<IMessage>>>;

  reset(): void;
}

export class InvalidHandlerRegistry implements IHandlerRegistry {
  constructor() {
    throw new Error('invalid handler registry');
  }
  register(): void {
    throw new Error('Method not implemented.');
  }
  getAll(): never {
    throw new Error('Method not implemented.');
  }
  reset(): never {
    throw new Error('Method not implemented.');
  }
}
