import {RedisTransport} from '@carbonteq/nodebus-transport-redis';
import {ILogger, PinoLogger} from "@carbonteq/nodebus-core";
import {default as Redis} from 'ioredis'

jest.mock('ioredis', () => require('ioredis-mock'))

describe('Redis Transport', () => {
    const client = new Redis()

    const logger: ILogger = new PinoLogger()

    const loggerDebugSpy = jest.spyOn(logger, 'debug')

    let transport: RedisTransport;

    beforeEach(async () => {
        transport = new RedisTransport(client, logger);

        await transport.initialize()
        await transport.resetQueue()
    });

    it('debug logs on initialize', () => {
        expect(loggerDebugSpy).toHaveBeenCalledWith("Redis Transport: Ping => ", "PONG")
    })

    it('initial queue length is 0', async () => {
        const len = await transport.length()

        expect(len).toBe(0)
    })

    it('send works correctly', async () => {
        await transport.send("some message")
    })

    it('send increases the length by 1', async () => {
        await transport.send("some message")

        const len = await transport.length()

        expect(len).toBe(1)
    })

    it('readNextMessage returns the correct message', async () => {
        const msg = "message asdasd"

        await transport.send(msg)

        const nextMsg = await transport.readNextMessage()

        expect(nextMsg).toBe(msg)
    })

    it('readNextMessage returns undefined when no message in queue', async () => {
        const nextMsg = await transport.readNextMessage()

        expect(nextMsg).toBeUndefined()
    })

    it('queue order (FIFO) is maintained', async () => {
        const msg1 = "message 123"
        const msg2 = "message 456"

        await transport.send(msg1)
        await transport.send(msg2)

        expect(await transport.readNextMessage()).toBe(msg1)
        expect(await transport.readNextMessage()).toBe(msg2)
    })


    it('msg is deleted without error when no message in queue', async () => {
        expect(await transport.readNextMessage()).toBeUndefined()

        await expect(async () => {
            await transport.deleteMessage("radasdad")
        }).not.toThrow()

        expect(await transport.readNextMessage()).toBeUndefined()
    })

    it("msg is deleted correctly when only one is queue", async () => {
        const msg = "message 123"

        await transport.send(msg)

        expect(await transport.length()).toBe(1)

        await transport.deleteMessage(msg)

        expect(await transport.length()).toBe(0)
        expect(await transport.readNextMessage()).toBeUndefined()
    })

    it('middle message is removed properly', async () => {
        const msg1 = "message 123"
        const msg2 = "message 456"
        const msg3 = "message 789"

        await transport.send(msg1)
        await transport.send(msg2)
        await transport.send(msg3)

        expect(await transport.length()).toBe(3)

        await transport.deleteMessage(msg2)

        expect(await transport.readNextMessage()).toBe(msg1)
        expect(await transport.readNextMessage()).toBe(msg3)
    })

    it('returnMessage returns message to queue', async () => {
        const msg1 = "message 123"
        const msg2 = "message 456"

        await transport.send(msg1)
        await transport.send(msg2)

        expect(await transport.readNextMessage()).toBe(msg1)

        await transport.returnMessage(msg1)

        expect(await transport.readNextMessage()).toBe(msg2)
        expect(await transport.readNextMessage()).toBe(msg1)
    })
});
