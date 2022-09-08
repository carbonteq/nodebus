import { Controller, Get, Param } from "@nestjs/common";
import { BarService } from "@src/app/bar.service";

@Controller("/test")
export class MainController {
  constructor(private readonly serv: BarService) {}

  @Get()
  async test() {
    const id = "nestjs redis";

    await this.serv.doSomething(id);

    return { id };
  }

  @Get("/:id")
  async testWithSpecificId(@Param("id") id: string) {
    await this.serv.doSomething(id);

    return { id };
  }
}
