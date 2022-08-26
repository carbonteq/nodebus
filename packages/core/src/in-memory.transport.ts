import { EventEmitter } from 'node:events';
import { ITransport, TransportMessage } from './base';

export interface InMemoryTransportConfig {
  maxRetries: number;
  receiveTimeoutMs: number; // number of seconds to wait while attempting to wait for the next message
}

const defaultConfig: Readonly<InMemoryTransportConfig> = {
  maxRetries: 10,
  receiveTimeoutMs: 1000, // 1 second
};

// todo: add logger, queue and retry strat
export class InMemoryTransport implements ITransport {
  private queue: TransportMessage[] = [];
  private queuePushed: EventEmitter = new EventEmitter();
  /* private _deadLetterQueue: InMemoryQueue = []; */

  constructor(readonly cfg: InMemoryTransportConfig = defaultConfig) {}

  async initialize(): Promise<void> {
    // connect to underlying transport here
  }

  async send(message: TransportMessage): Promise<void> {
    this.addToQueue(message);
  }

  readNextMessage(): Promise<TransportMessage | undefined> {
    // console.debug('Reading next message', { len: this.length });

    return new Promise(resolve => {
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
        // const availableMsgs = this.queue.filter(m => !m.inFlight);

        const message = this.queue.shift();
        if (message === undefined) {
          console.debug('No messages available in the queue');
          return;
        }

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

  async deleteMessage(message: TransportMessage): Promise<void> {
    console.debug('No need to delete message from in-memory queue', {
      message,
    });
    // const msgIdx = this.queue.indexOf(message);
    //
    // if (msgIdx < 0) {
    //   console.debug('Message already deleted', { message });
    //   return;
    // }
    //
    // console.debug('Deleting message', { len: this.length, msgIdx });
    // this.queue.splice(msgIdx, 1);
    // console.debug('Deleted message', { len: this.length, msgIdx });
  }

  async returnMessage(message: TransportMessage): Promise<void> {
    // todo: replace with retry strategy
    const delay = 2000; // ms

    setTimeout(() => {
      this.queue.push(message);
    }, delay);
  }

  private addToQueue(message: TransportMessage) {
    this.queue.push(message);

    console.debug('Added message to the queue', {
      queueSize: this.length,
      message,
    });
  }

  get length(): number {
    return this.queue.length;
  }
}
