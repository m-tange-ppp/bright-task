export class TaskId {
  private constructor(readonly value: string) {}

  static create(value: string): TaskId {
    if (!value || value.trim().length === 0) {
      throw new Error("TaskId cannot be empty");
    }
    return new TaskId(value);
  }

  equals(other: TaskId): boolean {
    return this.value === other.value;
  }
}
