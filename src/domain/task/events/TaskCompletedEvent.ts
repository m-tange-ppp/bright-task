export class TaskCompletedEvent {
  readonly occurredAt: string;

  constructor(
    readonly taskId: string,
    readonly taskTitle: string,
    readonly dislikeLevel: number,
    readonly importance: number,
  ) {
    this.occurredAt = new Date().toISOString();
  }
}
