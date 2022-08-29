import { NestFactory } from "@nestjs/core";
import { WebModule } from "./web";

async function bootstrap() {
  const app = await NestFactory.create(WebModule, {
    logger: ["debug", "warn", "log", "error", "verbose"]
  });

  await app.listen(3000);
}

bootstrap();
