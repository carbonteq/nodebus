import { ISerializer, ClassConstructor } from './base';

export type JsonValue =
  | string
  | number
  | boolean
  | Date
  | { [x: string]: JsonValue }
  | Array<JsonValue>;

export type JsonObject = { [x: string]: JsonValue };

export class JSONSerializer implements ISerializer<JsonObject> {
  serialize(obj: JsonObject): string {
    return JSON.stringify(obj);
  }

  deserialize(
    val: string,
    classType: ClassConstructor<JsonObject>,
  ): JsonObject {
    let obj = JSON.parse(val);

    return this.toClass(obj, classType);
  }

  toPlain(obj: JsonObject): object {
    return JSON.parse(JSON.stringify(obj));
  }

  toClass(
    obj: object,
    classConstructor: ClassConstructor<JsonObject>,
  ): JsonObject {
    const instance = new classConstructor();

    Object.assign(instance, obj);

    return instance;
  }
}
