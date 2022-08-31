import { Module } from "@nestjs/common";
import { BarService } from "./bar.service";

@Module({
  providers: [BarService],
  exports: [BarService],
})
export class AppModule {}
