import { AwsSqsTransport } from '@carbonteq/nodebus-transport-aws-sqs';
import { mockClient } from 'aws-sdk-client-mock';
import {
	SQSClient,
	ReceiveMessageCommand,
	SendMessageCommand,
	GetQueueUrlCommand,
} from '@aws-sdk/client-sqs';
import { PinoLogger } from '@carbonteq/nodebus-core';

const TEST_Q = 'testQueue';
const TEST_Q_URL = 'testQueueUrl';

const client = mockClient(SQSClient);
const logger = new PinoLogger();
const transport = new AwsSqsTransport({
	client: new SQSClient({}),
	queueName: TEST_Q,
	logger,
});

const loggerDebugSpy = jest.spyOn(logger, 'debug');

beforeEach((done) => {
	client.reset();

	done();
});

describe('SQS Command Tests', () => {
	describe('when initializing', () => {
		it('should construct correct queueUrl', async () => {
			client.on(GetQueueUrlCommand).resolves({ QueueUrl: TEST_Q_URL });

			await transport.initialize();

			expect(transport.queueUrl).toBe(TEST_Q_URL);
		});
	});

	describe('when sending messages', () => {
		it('should debug log messageId on send', async () => {
			const msgId = '123';

			client.on(SendMessageCommand).resolves({ MessageId: msgId });

			await transport.send('some message');

			expect(loggerDebugSpy).toHaveBeenCalledWith(msgId);
		});

		it('should have correct message body on send', async () => {
			const msg = 'abc 123 message lalala';

			client.on(SendMessageCommand).resolves({ MessageId: 'some-message-id' });

			await transport.send(msg);

			const calls = client.commandCalls(SendMessageCommand, {
				MessageBody: msg,
			});

			expect(calls).toHaveLength(1);
		});
	});

	describe('when receiving messages', () => {
		it('should return correct message for correct mock', async () => {
			const msgId = '123';
			const msg = { abc: 456 };
			const msgBody = JSON.stringify(msg);

			client
				.on(ReceiveMessageCommand)
				.resolves({ Messages: [{ MessageId: msgId, Body: msgBody }] });

			const r = await transport.readNextMessage();

			const transportMsg = transport.toTransportMessage(msgBody);
			transportMsg.id = msgId;
			transportMsg.raw.MessageId = msgId;

			expect(r).toEqual(transportMsg);
		});

		it('should fail for incorrect mock', async () => {
			const msgId = '123';
			const msg = { abc: 123 };
			const msgBody = JSON.stringify(msg);

			client
				.on(ReceiveMessageCommand)
				.resolves({ Messages: [{ MessageId: msgId, Body: `${msgBody}1` }] });

			const r = await transport.readNextMessage();

			expect(r).not.toEqual(msgBody);
		});

		it('should return undefined when no message in queue', async () => {
			client.on(ReceiveMessageCommand).resolves({ Messages: [] });
			const r = await transport.readNextMessage();

			expect(r).toBeUndefined();
		});
	});
});
