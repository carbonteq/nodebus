import { Controller, Get, Param } from "@nestjs/common";
import { BarService } from "@src/app/bar.service";

@Controller("/test")
export class MainController {
  // private readonly logger: Logger = new Logger(MainController.name);

  constructor(private readonly serv: BarService) {}

  @Get()
  async testWithRandomId() {
    const id = "some random id";

    await this.serv.doSomething(id);

    return { id };
  }

  @Get("/:id")
  async testWithCustomId(@Param("id") id: string) {
    await this.serv.doSomething(id);

    return { id };
  }
}
