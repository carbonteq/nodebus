import {
  IClassHandler,
  IHandlerRegistry,
  IMessage,
  ISerializer,
  ITransport,
  TransportMessage,
} from './base';

export enum BusState {
  Starting = 'starting',
  Started = 'started',
  Stopping = 'stopping',
  Stopped = 'stopped',
}

const sleep = async (timeoutMs: number): Promise<void> =>
  new Promise(resolve => setTimeout(resolve, timeoutMs));

const EMPTY_QUEUE_SLEEP_MS = 500;
const STARTED_STATES = new Set([BusState.Starting, BusState.Started]);
const STOP_STATES = new Set([BusState.Stopping, BusState.Stopped]);

export class Bus {
  private runningWorkerCount = 0;
  private internalState: BusState = BusState.Stopped;

  constructor(
    private readonly transport: ITransport<Record<string, any>, IMessage>,
    private readonly registry: IHandlerRegistry,
    private readonly serializer: ISerializer,
  ) {}

  async send<T extends IMessage>(msg: T): Promise<void> {
    await this.transport.send(msg);
  }

  async start(): Promise<void> {
    if (STARTED_STATES.has(this.internalState)) {
      throw new Error('Bus must be stopped before it can be started');
    }

    this.internalState = BusState.Starting;
    // todo: call transport start

    this.internalState = BusState.Started;

    // todo: add concurrency
    setTimeout(async () => this.applicationLoop(), 0);

    console.info('Bus started with concurrency: 0');
  }

  async stop(): Promise<void> {
    if (STOP_STATES.has(this.internalState)) {
      throw new Error('Bus must be started before it can be stopped');
    }

    this.internalState = BusState.Stopping;
    //todo: call transport stop

    while (this.runningWorkerCount > 0) {
      await sleep(10);
    }

    this.internalState = BusState.Stopped;
    console.info('Bus Stopped');
  }

  private async applicationLoop(): Promise<void> {
    this.runningWorkerCount++;

    while (this.internalState === BusState.Started) {
      const msgHandled = await this.handleNextMessage();

      // Avoids locking up CPU when no messages to be processed
      if (!msgHandled) {
        await sleep(EMPTY_QUEUE_SLEEP_MS);
      }
    }

    this.runningWorkerCount--;
  }

  private async handleNextMessage(): Promise<boolean> {
    try {
      const message = await this.transport.readNextMessage();

      if (message) {
        try {
          // set message handling context
          // add middleware stuff
          this.handleNextMessagePolled(message);
          // afterDispatchEmit
        } catch (err) {
          console.error(err);
          console.error('Sending message back to queue');
          await this.transport.returnMessage(message);
          return false;
        }
        return true;
      }
    } catch (err) {
      //todo: add logger stuff
      console.error(err);
    }

    return false;
  }

  async dispatchMessageToHandlers<T extends IMessage>(msg: T): Promise<void> {
    const handlers = this.registry.get(msg);

    if (handlers.length === 0) {
      console.error(
        `No handlers registered for message<${msg.name}>. Will be discarded`,
      );
      return;
    }

    const handlersToInvoke = handlers.map(handler =>
      this.dispatchMessageToHandler(msg, handler),
    );

    const handlerResults = await Promise.allSettled(handlersToInvoke);
    const failed = handlerResults.filter(r => r.status === 'rejected');

    if (failed.length > 0) {
      const reasons = (failed as PromiseRejectedResult[]).map(h => h.reason);

      console.error(`Failed handling ${msg.name} for some: ${reasons}`);
    }

    console.debug('Message dispatched to all handlers', {
      msg,
      numHandlers: handlers.length,
    });
  }

  async dispatchMessageToHandler<T extends IMessage>(
    msg: T,
    handler: IClassHandler<T>,
  ): Promise<void> {
    return handler.handle(msg);
  }

  private async handleNextMessagePolled<T>(
    msg: TransportMessage<IMessage, T>,
  ): Promise<void> {
    await this.dispatchMessageToHandlers(msg.domainMessage);
    await this.transport.deleteMessage(msg);
  }
}
