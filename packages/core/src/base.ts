// TODO: add docs
export type ClassConstructor<T> = new (...args: unknown[]) => T;

export interface IMessage {
  readonly name: string;
  readonly time: Date;
  readonly id: string;
}

export type ICommand = IMessage;
export type IEvent = IMessage;

export interface IClassHandler<T extends IMessage> {
  eventType: ClassConstructor<T>;

  handle(event: T): void;
}

export interface IHandlerRegistery {
  // FIXME: duplication of eventType
  register<T extends IMessage>(
    eventType: ClassConstructor<T>,
    handler: IClassHandler<T>,
  ): void;

  getAll(): Map<string, Set<IClassHandler<IMessage>>>;

  reset(): void;
}

export type ISerializable = Record<string, unknown>;

// export interface ISerializer {
//   serialize<T extends ISerializable = ISerializable>(obj: T): string;
//
//   deserialize<T extends ISerializable = ISerializable>(
//     val: string,
//     classType: ClassConstructor<T>,
//   ): T;
//
//   toPlain<T extends ISerializable = ISerializable>(obj: T): object;
//   toClass<T extends ISerializable = ISerializable>(
//     obj: object,
//     classConstructor: ClassConstructor<T>,
//   ): T;
// }

export interface ISerializer<T extends ISerializable> {
  serialize(obj: T): string;
  deserialize(val: string, classType: ClassConstructor<T>): T;

  toPlain(obj: T): object;
  toClass(obj: object, classConstructor: ClassConstructor<T>): T;
}

export interface IMessageBus {
  publish(event: IMessage): Promise<IMessage>;

  subscribe<T extends IMessage>(handler: IClassHandler<T>): void;

  start(): void;
}
