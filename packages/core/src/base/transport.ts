import { IHandlerRegistry } from './handler-registry';
import { IMessage } from './message';

export interface TransportMessage<
  DomainMessageType extends IMessage,
  TransportMessageType
> {
  id: string | undefined;
  domainMessage: DomainMessageType;
  raw: TransportMessageType;
}

// The message must not only extend IMessage, but should also be serializable by the serializer passed in the initialize step
export interface ITransport<
  TransportMessageType,
  DomainMessageType extends IMessage
> {
  initialize(registry: IHandlerRegistry): Promise<void>;

  send(message: DomainMessageType): Promise<void>;

  readNextMessage(): Promise<
    TransportMessage<DomainMessageType, TransportMessageType> | undefined
  >;

  deleteMessage(
    message: TransportMessage<DomainMessageType, TransportMessageType>,
  ): Promise<void>;

  /**
   * Return message back to the queue
   */
  returnMessage(
    message: TransportMessage<DomainMessageType, TransportMessageType>,
  ): Promise<void>;
}
