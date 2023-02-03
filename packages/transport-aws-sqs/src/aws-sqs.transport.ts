import {
	DomainMessage,
	ITransport,
	Logger,
	TransportMessage,
} from '@carbonteq/nodebus-core';
import {
	SQSClient,
	SendMessageCommand,
	GetQueueUrlCommand,
	ReceiveMessageCommand,
	DeleteMessageCommand,
	Message as SqsMessage,
} from '@aws-sdk/client-sqs';
import { randomUUID } from 'node:crypto';

export interface AwsSqsTransportConfig {
	logger: Logger;

	queueName: string;
	client: SQSClient;
}

export type AwsSqsTransportMessage = TransportMessage<SqsMessage>;

export class AwsSqsTransport implements ITransport<SqsMessage> {
	readonly client: SQSClient;
	readonly queueName: string;
	private _queueUrl: string | undefined;
	readonly messageGroupId: string;

	readonly logger: Logger;

	constructor(cfg: Readonly<AwsSqsTransportConfig>) {
		this.messageGroupId = randomUUID();

		this.client = cfg.client;
		this.queueName = cfg.queueName;

		this.logger = cfg.logger;
		this.logger.setContext('AwsSqsTransport');
	}

	get queueUrl(): string | undefined {
		return this._queueUrl;
	}

	async initialize(): Promise<void> {
		const cmd = new GetQueueUrlCommand({
			QueueName: this.queueName,
		});
		const r = await this.client.send(cmd);
		this._queueUrl = r.QueueUrl;
	}

	async send(message: DomainMessage): Promise<void> {
		const cmd = new SendMessageCommand({
			MessageBody: message,
			QueueUrl: this._queueUrl,
			MessageGroupId: this.messageGroupId,
			MessageDeduplicationId: randomUUID(),
		});

		const r = await this.client.send(cmd);

		this.logger.debug(r.MessageId);
	}

	async readNextMessage(): Promise<AwsSqsTransportMessage | undefined> {
		const cmd = new ReceiveMessageCommand({
			QueueUrl: this._queueUrl,
			MaxNumberOfMessages: 1,
		});

		const r = await this.client.send(cmd);
		const res = r.Messages?.[0];

		if (!res) return;

		return {
			domainMessage: res.Body || '',
			id: res.MessageId || '',
			raw: res,
		};
	}

	deleteMessage(message: AwsSqsTransportMessage): Promise<void> {
		throw new Error('Method not implemented.');
	}

	returnMessage(message: AwsSqsTransportMessage): Promise<void> {
		throw new Error('Method not implemented.');
	}

	toTransportMessage(
		domainMessage: DomainMessage,
	): TransportMessage<SqsMessage> {
		const id = randomUUID();

		return {
			domainMessage,
			id,
			raw: {
				Body: domainMessage,
				MessageId: id,
			},
		};
	}
}
