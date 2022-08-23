export interface IMessage {
  readonly name: string;
  readonly time: Date;
  readonly id: string;
}

export type ICommand = IMessage;
export type IEvent = IMessage;
