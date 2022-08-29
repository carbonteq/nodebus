import { Bus } from "@carbonteq/nodebus-core";
import { Injectable } from "@nestjs/common";
import { FooEvent } from "./events/foo.event";

@Injectable()
export class BarService {
  constructor(private readonly bus: Bus) {}

  async doSomething(withId: string): Promise<void> {
    // do thing A
    // do thing B
    const event = new FooEvent(withId);

    await this.bus.send(event);
    // do final thing
  }
}
