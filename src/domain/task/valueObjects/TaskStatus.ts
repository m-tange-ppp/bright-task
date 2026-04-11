export type TaskStatusValue =
  | "pending"
  | "in_progress"
  | "completed"
  | "snoozed";

export class TaskStatus {
  private constructor(readonly value: TaskStatusValue) {}

  static readonly PENDING = new TaskStatus("pending");
  static readonly IN_PROGRESS = new TaskStatus("in_progress");
  static readonly COMPLETED = new TaskStatus("completed");
  static readonly SNOOZED = new TaskStatus("snoozed");

  static from(value: string): TaskStatus {
    const map: Record<string, TaskStatus> = {
      pending: TaskStatus.PENDING,
      in_progress: TaskStatus.IN_PROGRESS,
      completed: TaskStatus.COMPLETED,
      snoozed: TaskStatus.SNOOZED,
    };
    const status = map[value];
    if (!status) throw new Error(`Invalid TaskStatus: ${value}`);
    return status;
  }

  isCompleted(): boolean {
    return this.value === "completed";
  }

  isActive(): boolean {
    return (
      this.value === "pending" ||
      this.value === "in_progress" ||
      this.value === "snoozed"
    );
  }
}
