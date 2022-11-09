import {
	InMemoryTransport,
	DefaultHandlerRegistry,
} from '@carbonteq/nodebus-core';
import {
	TestEvent,
	TestEventHandler,
	BarCommand,
	BarCommandHandler,
} from './common';

const evnt = new TestEvent('some id');

const cmd = new BarCommand('bar cmd');

const testHandler = new TestEventHandler();
const cmdHandler = new BarCommandHandler();

const registry = new DefaultHandlerRegistry();
registry.register(testHandler);
registry.register(cmdHandler);

describe('in-memory transport', () => {
	let transport: InMemoryTransport;

	beforeEach(() => {
		transport = new InMemoryTransport();

		transport.initialize();
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
		expect(nextMsg).toEqual(evnt);
	});

	it('should return oldest message when multiple in queue', async () => {
		await transport.send(cmd);
		await transport.send(evnt);

		const firstMsg = await transport.readNextMessage();
		expect(firstMsg).toEqual(cmd);

		const secondMessage = await transport.readNextMessage();
		expect(secondMessage).toEqual(evnt);
	});

	// it('should retain queue length while messafe is unacknowledged', async () => {
	//   await transport.send(evnt);
	//   expect(transport.length).toBe(1);
	//
	//   const msg = await transport.readNextMessage();
	//   expect(transport.length).toBe(1);
	//   expect(msg).toBeDefined();
	//
	//   await transport.deleteMessage(msg!);
	//   expect(transport.length).toBe(0);
	// });
});
