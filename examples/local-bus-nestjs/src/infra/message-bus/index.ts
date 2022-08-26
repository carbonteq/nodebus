import { Global, Module } from "@nestjs/common";
import { MemoryBusProvider } from "./message-bus.in-memory";

@Global()
@Module({
  providers: [MemoryBusProvider],
  exports: [MemoryBusProvider]
})
export class MessageBusModule {}
