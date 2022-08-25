import { IHandlerRegistry } from './handler-registry';

export type TransportMessage = string;

// The message must not only extend IMessage, but should also be serializable by the serializer passed in the initialize step
export interface ITransport {
  initialize(registry: IHandlerRegistry): Promise<void>;

  send(message: TransportMessage): Promise<void>;

  readNextMessage(): Promise<TransportMessage | undefined>;

  deleteMessage(message: TransportMessage): Promise<void>;

  /**
   * Return message back to the queue
   */
  returnMessage(message: TransportMessage): Promise<void>;
}
