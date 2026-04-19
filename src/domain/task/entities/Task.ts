import { TaskCompletedEvent } from "../events/TaskCompletedEvent";
import { DislikeLevel } from "../valueObjects/DislikeLevel";
import { Importance } from "../valueObjects/Importance";
import { TaskId } from "../valueObjects/TaskId";
import { TaskStatus } from "../valueObjects/TaskStatus";

export interface TaskProps {
  id: TaskId;
  title: string;
  description: string | null;
  dislikeLevel: DislikeLevel;
  importance: Importance;
  status: TaskStatus;
  dueDate: string | null;
  reminderAt: string | null;
  completedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export class Task {
  private _props: TaskProps;

  private constructor(props: TaskProps) {
    this._props = props;
  }

  static create(props: TaskProps): Task {
    if (!props.title || props.title.trim().length === 0) {
      throw new Error("Task title cannot be empty");
    }
    return new Task(props);
  }

  get id(): TaskId {
    return this._props.id;
  }
  get title(): string {
    return this._props.title;
  }
  get description(): string | null {
    return this._props.description;
  }
  get dislikeLevel(): DislikeLevel {
    return this._props.dislikeLevel;
  }
  get importance(): Importance {
    return this._props.importance;
  }
  get status(): TaskStatus {
    return this._props.status;
  }
  get dueDate(): string | null {
    return this._props.dueDate;
  }
  get reminderAt(): string | null {
    return this._props.reminderAt;
  }
  get completedAt(): string | null {
    return this._props.completedAt;
  }
  get createdAt(): string {
    return this._props.createdAt;
  }
  get updatedAt(): string {
    return this._props.updatedAt;
  }

  complete(): { task: Task; event: TaskCompletedEvent } {
    if (this._props.status.isCompleted()) {
      throw new Error("Task is already completed");
    }
    const now = new Date().toISOString();
    const updated = new Task({
      ...this._props,
      status: TaskStatus.COMPLETED,
      completedAt: now,
      updatedAt: now,
    });
    const event = new TaskCompletedEvent(
      this._props.id.value,
      this._props.title,
    );
    return { task: updated, event };
  }

  snooze(): Task {
    const now = new Date().toISOString();
    return new Task({
      ...this._props,
      status: TaskStatus.SNOOZED,
      updatedAt: now,
    });
  }

  priorityScore(): number {
    // 嫌さ × 重要度 で優先スコアを算出（ドメインルール）
    return this._props.dislikeLevel.value * this._props.importance.value;
  }

  update(fields: {
    title: string;
    description: string | null;
    dislikeLevel: DislikeLevel;
    importance: Importance;
    dueDate: string | null;
    reminderAt: string | null;
  }): Task {
    if (!fields.title || fields.title.trim().length === 0) {
      throw new Error("Task title cannot be empty");
    }
    return new Task({
      ...this._props,
      ...fields,
      updatedAt: new Date().toISOString(),
    });
  }
}
