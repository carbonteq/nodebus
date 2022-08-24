import {
  InMemoryTransport,
  DefaultHandlerRegistry,
} from '@carbonteq/nodebus-core';
import {
  TestEvent,
  TestEventHandler,
  FooEvent,
  BarCommand,
  BarCommandHandler,
} from './common';

describe('in-memory transport', () => {
  const evnt = new TestEvent('some id');
  const evntWoHandler = new FooEvent('foo id');
  const cmd = new BarCommand('bar cmd');

  const testHandler = new TestEventHandler();
  const cmdHandler = new BarCommandHandler();

  const registry = new DefaultHandlerRegistry();
  registry.register(testHandler);
  registry.register(cmdHandler);

  let transport: InMemoryTransport<TestEvent>;

  beforeEach(() => {
    transport = new InMemoryTransport<TestEvent>();

    transport.initialize(registry);
  });

  it("sending an event without handler doesn't add it to queue", () => {
    transport.send(evntWoHandler);

    expect(transport.length).toBe(0);
  });

  it('sending an event with handler adds it to queue', async () => {
    transport.send(evnt);

    expect(transport.length).toBe(1);
  });

  it('reading next message on empty queue returns undefined', async () => {
    const currentlyInQueue = await transport.readNextMessage();

    expect(currentlyInQueue).toBeUndefined();
  });

  it('readNextMessage returns a defined transport message after send', async () => {
    transport.send(evnt);

    /* await sleep(transport.cfg.receiveTimeoutMs); */
    const nextMsg = await transport.readNextMessage();

    expect(nextMsg).toBeDefined();
    expect(nextMsg?.domainMessage).toEqual(evnt);
  });

  it('should read new messages with seenCount equal to 0', async () => {
    await transport.send(cmd);
    const message = await transport.readNextMessage();

    expect(message?.raw.seenCount).toEqual(0);
  });

  it('should return oldest message when multiple in queue', async () => {
    await transport.send(cmd);
    await transport.send(evnt);

    const firstMsg = await transport.readNextMessage();
    expect(firstMsg!.domainMessage).toEqual(cmd);

    const secondMessage = await transport.readNextMessage();
    expect(secondMessage!.domainMessage).toEqual(evnt);
  });

  it('should retain queue length while messafe is unacknowledged', async () => {
    await transport.send(evnt);
    expect(transport.length).toBe(1);

    const msg = await transport.readNextMessage();
    expect(transport.length).toBe(1);
    expect(msg).toBeDefined();

    await transport.deleteMessage(msg!);
    expect(transport.length).toBe(0);
  });
});
