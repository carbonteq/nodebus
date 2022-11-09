import {
	ISerializer,
	ClassConstructor,
	IMessage,
	BaseSerializable,
} from 'src/base';

// export type JsonValue =
//   | string
//   | number
//   | boolean
//   | Date
//   | { [x: string]: JsonValue }
//   | Array<JsonValue>;

// export type JsonObject = { [x: string]: JsonValue };
export type JsonObject = BaseSerializable;

export class JSONSerializer implements ISerializer {
	serialize<T extends JsonObject>(obj: T): string {
		return JSON.stringify(obj);
	}

	naiveDeserialize(val: string): Record<string, unknown> {
		return JSON.parse(val) as Record<string, unknown>;
	}

	deserialize<T extends IMessage>(
		val: string,
		classType: ClassConstructor<T>,
	): T {
		const obj = JSON.parse(val);

		return this.toClass(obj, classType);
	}

	toPlain<T extends JsonObject>(obj: T): object {
		return JSON.parse(JSON.stringify(obj));
	}

	toClass<T extends IMessage>(
		obj: object,
		classConstructor: ClassConstructor<T>,
	): T {
		const instance = new classConstructor();

		Object.assign(instance, obj);

		return instance;
	}
}
