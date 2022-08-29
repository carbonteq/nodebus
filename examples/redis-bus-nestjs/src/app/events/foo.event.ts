import { IEvent } from "@carbonteq/nodebus-core";

export class FooEvent implements IEvent {
  readonly name = "FooEvent";

  readonly time: Date;

  constructor(readonly id: string) {
    this.time = new Date();
  }
}
