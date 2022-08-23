import { ClassConstructor } from './type-utils';

export interface ISerializer<T extends Record<string, unknown>> {
  serialize(obj: T): string;
  deserialize(val: string, classType: ClassConstructor<T>): T;

  toPlain(obj: T): object;
  toClass(obj: object, classConstructor: ClassConstructor<T>): T;
}
