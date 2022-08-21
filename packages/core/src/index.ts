// TODO: add docs
export type ClassConstructor<T> = new (...args: unknown[]) => T;

export interface Message {
  readonly name: string;
  readonly time: Date;
  readonly id: string;
}

export type Command = Message
export type Event = Message

export interface ClassHandler<T extends Message> {
  eventType: ClassConstructor<T>;

  handle(event: T): void;
}

export interface HandlerRegistery {
  // FIXME: duplication of eventType
  register<T extends Message>(
    eventType: ClassConstructor<T>,
    handler: ClassHandler<T>,
  ): void;

  getAll(): Map<string, Set<ClassHandler<Message>>>;

  reset(): void;
}

type TSerializable = Record<string, unknown>;
export interface Serializer {
  serialize<T extends TSerializable = TSerializable>(obj: T): string;

  deserialize<T extends TSerializable = TSerializable>(
    val: string,
    classType: ClassConstructor<T>,
  ): T;

  toPlain<T extends TSerializable = TSerializable>(obj: T): object;
  toClass<T extends TSerializable = TSerializable>(
    obj: object,
    classConstructor: ClassConstructor<T>,
  ): T;
}

export interface MessageBus {
  publish(event: Message): Promise<Message>;

  subscribe<T extends Message>(handler: ClassHandler<T>): void;

  start(): void;
}
