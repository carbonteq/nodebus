import {
  InMemoryTransport,
  DefaultHandlerRegistry,
} from '@carbonteq/nodebus-core';
import { TestEvent, TestEventHandler } from './common';

describe('in-memory transport', () => {
  const transport = new InMemoryTransport<TestEvent>();
  const evnt = new TestEvent('some id');
  const handler = new TestEventHandler();
  const registry = new DefaultHandlerRegistry();
  registry.register(handler);

  transport.initialize(registry);

  it('readNextMessage returns a defined transport message after send', async () => {
    const currentlyInQueue = await transport.readNextMessage();

    expect(currentlyInQueue).toBeUndefined();

    transport.send(evnt);

    /* await sleep(transport.cfg.receiveTimeoutMs); */
    const nextMsg = await transport.readNextMessage();
    const expected = transport.toInMemoryTransportMessage(evnt);
    expected.raw.inFlight = true; // message would be in flight

    expect(nextMsg).toBeDefined();
    expect(nextMsg).toEqual(expected);
  });
});
