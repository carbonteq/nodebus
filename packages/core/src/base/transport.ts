import type { IHandlerRegistry } from './handler-registry';
import type { IMessage } from './message';
import type { TransportMessage, DomainMessage } from './transport-message';
import type { ISerializer } from './serializer';

// The message must not only extend IMessage, but should also be serializable by the serializer passed in the initialize step
export interface ITransport<AdapterMessageType> {
	initialize(registry: IHandlerRegistry): Promise<void>;

	send(domainMessage: DomainMessage): Promise<void>;

	readNextMessage(): Promise<TransportMessage<AdapterMessageType> | undefined>;

	deleteMessage(message: TransportMessage<AdapterMessageType>): Promise<void>;

	/**
	 * Return message back to the queue
	 */
	returnMessage(message: TransportMessage<AdapterMessageType>): Promise<void>;

	toTransportMessage(
		domainMessage: DomainMessage,
	): TransportMessage<AdapterMessageType>;
}
