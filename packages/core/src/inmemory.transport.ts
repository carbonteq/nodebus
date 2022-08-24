import { EventEmitter } from 'node:events';
import {
  ITransport,
  IMessage,
  IHandlerRegistry,
  InvalidHandlerRegistry,
  TransportMessage,
} from './base';

export interface InMemoryTransportConfig {
  maxRetries: number;
  receiveTimeoutMs: number; // number of seconds to wait while attempting to wait for the next message
}

const defaultConfig: Readonly<InMemoryTransportConfig> = {
  maxRetries: 10,
  receiveTimeoutMs: 1000, // 1 second
};

export interface InMemoryMessage<T extends IMessage> {
  inFlight: boolean;
  seenCount: number;
  payload: T;
}

type InMemoryQueue<T extends IMessage> = TransportMessage<
  T,
  InMemoryMessage<T>
>[];

// todo: add logger and retry strat
export class InMemoryTransport<T extends IMessage>
  implements ITransport<InMemoryMessage<T>, T>
{
  private queue: InMemoryQueue<T> = [];
  private queuePushed: EventEmitter = new EventEmitter();
  /* private _deadLetterQueue: InMemoryQueue = []; */
  private messagesWithHandlers: Set<string>;

  private handlerRegistery: IHandlerRegistry;

  constructor(private readonly cfg: InMemoryTransportConfig = defaultConfig) {
    this.messagesWithHandlers = new Set();

    this.handlerRegistery = new InvalidHandlerRegistry();
  }

  async initialize(registry: IHandlerRegistry): Promise<void> {
    this.handlerRegistery = registry;

    // a set is optimized for lookup, not for list operations like push
    // adding values to a set in a loop is more expensive than adding them to a list
    // the list can then be used to construct the set, which is usually a cheaper operation
    const availableMessages: string[] = [];
    this.handlerRegistery.getAll().forEach((s) => {
      s.forEach((msgName) => availableMessages.push(msgName.eventType.name));
    });

    this.messagesWithHandlers = new Set(availableMessages);
  }

  async send(message: T): Promise<void> {
    this.addToQueue(message);
  }

  readNextMessage(): Promise<
    TransportMessage<T, InMemoryMessage<T>> | undefined
  > {
    console.debug('Reading next message', { len: this.length });

    return new Promise((resolve) => {
      const onMessageEmitted = () => {
        unsubscribeEmitter();
        clearTimeout(timeoutToken);
        resolve(getNextMessage());
      };

      this.queuePushed.on('pushed', onMessageEmitted);
      const unsubscribeEmitter = () => {
        this.queuePushed.off('pushed', onMessageEmitted);
      };

      const getNextMessage = () => {
        const availableMsgs = this.queue.filter((m) => !m.raw.inFlight);

        if (availableMsgs.length === 0) {
          console.debug('No messages available in the queue');
          return;
        }

        const message = availableMsgs[0];
        message.raw.inFlight = true;

        return message;
      };

      const timeoutToken = setTimeout(() => {
        unsubscribeEmitter();
        resolve(undefined);
      }, this.cfg.receiveTimeoutMs);

      const nextMsg = getNextMessage();
      if (nextMsg) {
        unsubscribeEmitter();
        clearTimeout(timeoutToken);
        resolve(nextMsg);
      }
    });
  }

  async deleteMessage(
    message: TransportMessage<T, InMemoryMessage<T>>,
  ): Promise<void> {
    const msgIdx = this.queue.indexOf(message);

    if (msgIdx < 0) {
      console.debug('Message already deleted', { message });
      return;
    }

    console.debug('Deleting messge', { len: this.length, msgIdx });
    this.queue.splice(msgIdx, 1);
    console.debug('Deleted messge', { len: this.length, msgIdx });
  }

  async returnMessage(
    message: TransportMessage<T, InMemoryMessage<T>>,
  ): Promise<void> {
    // todo: replace with retry strategy
    const delay = 2000; // ms

    message.raw.seenCount++;

    if (message.raw.seenCount >= this.cfg.maxRetries) {
      console.info('Message retry limit exceeded', { message });
      // send to dead letter queue?
    } else {
      setTimeout(() => {
        message.raw.inFlight = false;
      }, delay);
    }
  }

  private addToQueue(message: T) {
    if (this.messagesWithHandlers.has(message.name)) {
      /* const transportMessage = this.serializer.serialize(message); */
      const transportMessage = this.toInMemoryTransportMessage(message);

      this.queue.push(transportMessage);
      console.debug('Added message to the queue', {
        queueSize: this.length,
        message,
      });
    }
    // todo: log when message has no handler
  }

  get length(): number {
    return this.queue.length;
  }

  private toInMemoryTransportMessage(
    message: T,
  ): TransportMessage<T, InMemoryMessage<T>> {
    return {
      id: undefined,
      domainMessage: message,
      raw: {
        payload: message,
        inFlight: false,
        seenCount: 0,
      },
    };
  }
}
