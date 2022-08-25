import { IMessage } from './message';
import { ClassConstructor } from './type-utils';

export type BaseSerializable = Record<string, any>;

export interface ISerializer {
  serialize<T extends BaseSerializable>(obj: T): string;

  naiveDeserialize(val: string): Record<string, unknown>;
  deserialize<T extends IMessage>(
    val: string,
    classType: ClassConstructor<T>,
  ): T;

  toPlain<T extends BaseSerializable>(obj: T): object;
  toClass<T extends IMessage>(
    obj: object,
    classConstructor: ClassConstructor<T>,
  ): T;
}

export class InvalidSerializer implements ISerializer {
  constructor() {
    throw new Error('invalid serializer');
  }

  naiveDeserialize(): never {
    throw new Error('Method not implemented.');
  }

  /* eslint-disable no-unused-vars */
  serialize(): never {
    throw new Error('Method not implemented.');
  }
  deserialize(): never {
    throw new Error('Method not implemented.');
  }
  toPlain(): never {
    throw new Error('Method not implemented.');
  }
  toClass(): never {
    throw new Error('Method not implemented.');
  }
}
