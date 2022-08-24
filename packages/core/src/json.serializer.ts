import { ISerializer, ClassConstructor } from 'src/base';

export type JsonValue =
  | string
  | number
  | boolean
  | Date
  | { [x: string]: JsonValue }
  | Array<JsonValue>;

export type JsonObject = { [x: string]: JsonValue };

export class JSONSerializer implements ISerializer {
  serialize<T extends object = JsonObject>(obj: T): string {
    return JSON.stringify(obj);
  }

  deserialize<T extends object>(
    val: string,
    classType: ClassConstructor<T>,
  ): T {
    const obj = JSON.parse(val);

    return this.toClass(obj, classType);
  }

  toPlain<T extends object>(obj: T): object {
    return JSON.parse(JSON.stringify(obj));
  }

  toClass<T extends object>(
    obj: object,
    classConstructor: ClassConstructor<T>,
  ): T {
    const instance = new classConstructor();

    Object.assign(instance, obj);

    return instance;
  }
}
