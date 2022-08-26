import { Controller, Get } from "@nestjs/common";
import { BarService } from "src/app/bar.service";

@Controller("/test")
export class MainController {
  // private readonly logger: Logger = new Logger(MainController.name);

  constructor(private readonly serv: BarService) {}

  @Get()
  async test() {
    await this.serv.doSomething("some random Id");

    return { status: "ok" };
  }
}
