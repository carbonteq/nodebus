import { Global, Module } from "@nestjs/common";
import { RedisBusProvider } from "./message-bus.redis";

@Global()
@Module({
  providers: [RedisBusProvider],
  exports: [RedisBusProvider],
})
export class MessageBusModule { }
