export class TaskCompletedEvent {
  readonly occurredAt: string;

  constructor(
    readonly taskId: string,
    readonly taskTitle: string,
  ) {
    this.occurredAt = new Date().toISOString();
  }
}
