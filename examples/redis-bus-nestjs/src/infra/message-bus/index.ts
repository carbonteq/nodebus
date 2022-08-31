import { Global, Module } from "@nestjs/common";
import { MemoryBusProvider } from "./message-bus.redis";

@Global()
@Module({
  providers: [MemoryBusProvider],
  exports: [MemoryBusProvider],
})
export class MessageBusModule {}
