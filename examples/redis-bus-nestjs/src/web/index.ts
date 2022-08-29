import { Module } from "@nestjs/common";
import { AppModule } from "@src/app/app.module";
import { modules as InfraModules } from "@src/infra/infra.modules";
import { MainController } from "./controllers/main.controller";

@Module({
  imports: [AppModule, ...InfraModules],
  controllers: [MainController]
})
export class WebModule {}
