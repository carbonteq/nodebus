import { ClassConstructor, IClassHandler } from "@carbonteq/nodebus-core";
import { Logger } from "@nestjs/common";
import { FooEvent } from "../events/foo.event";

export class FooEventHandler implements IClassHandler<FooEvent> {
  eventType: ClassConstructor<FooEvent> = FooEvent;

  // better to define your own logger in infra and its interface/base in domain or app
  private readonly logger = new Logger("FooEventHandler");

  handle(event: FooEvent): void {
    // throw new Error("Method not implemented.");

    this.logger.debug(`Received event in FooHandler: ${JSON.stringify(event)}`);
  }
}
