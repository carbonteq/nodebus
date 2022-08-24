import { ClassConstructor } from './type-utils';

export type BaseSerializable = Record<string, unknown>;
export interface ISerializer<T extends BaseSerializable> {
  serialize(obj: T): string;
  deserialize(val: string, classType: ClassConstructor<T>): T;

  toPlain(obj: T): object;
  toClass(obj: object, classConstructor: ClassConstructor<T>): T;
}

export class InvalidSerializer implements ISerializer<never> {
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
