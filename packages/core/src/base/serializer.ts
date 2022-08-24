import { ClassConstructor } from './type-utils';

export type BaseSerializable = Record<string, any>;

export interface ISerializer {
  serialize<T extends object>(obj: T): string;
  deserialize<T extends object>(val: string, classType: ClassConstructor<T>): T;

  toPlain<T extends object>(obj: T): object;
  toClass<T extends object>(
    obj: object,
    classConstructor: ClassConstructor<T>,
  ): T;
}

export class InvalidSerializer implements ISerializer {
  constructor() {
    throw new Error('invalid serializer');
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
