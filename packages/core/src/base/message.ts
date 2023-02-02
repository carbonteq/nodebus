export interface IMessage {
	readonly name: string;
	readonly time: Date;
}

export type ICommand = IMessage;
export type IEvent = IMessage;
