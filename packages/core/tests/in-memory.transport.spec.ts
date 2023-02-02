import {
	InMemoryTransport,
	DefaultHandlerRegistry,
	DomainMessage,
} from '@carbonteq/nodebus-core';
import {
	TestEvent,
	TestEventHandler,
	BarCommand,
	BarCommandHandler,
} from './common';

const evnt = new TestEvent('some id');
const domainEvnt: DomainMessage = JSON.stringify(evnt);

const cmd = new BarCommand('bar cmd');
const domainCmd: DomainMessage = JSON.stringify(cmd);

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
		transport.send(domainEvnt);

		expect(transport.length).toBe(1);
	});

	it('reading next message on empty queue returns undefined', async () => {
		const currentlyInQueue = await transport.readNextMessage();

		expect(currentlyInQueue).toBeUndefined();
	});

	it('readNextMessage returns a defined transport message after send', async () => {
		transport.send(domainEvnt);

		/* await sleep(transport.cfg.receiveTimeoutMs); */
		const nextMsg = await transport.readNextMessage();

		expect(nextMsg).toBeDefined();
		expect(nextMsg?.domainMessage).toEqual(domainEvnt);
	});

	it('should return oldest message when multiple in queue', async () => {
		await transport.send(domainCmd);
		await transport.send(domainEvnt);

		const firstMsg = await transport.readNextMessage();
		expect(firstMsg?.domainMessage).toEqual(domainCmd);

		const secondMessage = await transport.readNextMessage();
		expect(secondMessage?.domainMessage).toEqual(domainEvnt);
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
