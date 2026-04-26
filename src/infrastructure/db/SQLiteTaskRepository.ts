import { Task } from "../../domain/task/entities/Task";
import { ITaskRepository } from "../../domain/task/repositories/ITaskRepository";
import { DislikeLevel } from "../../domain/task/valueObjects/DislikeLevel";
import { Importance } from "../../domain/task/valueObjects/Importance";
import { TaskId } from "../../domain/task/valueObjects/TaskId";
import { TaskStatus } from "../../domain/task/valueObjects/TaskStatus";
import { getDatabase } from "./schema";

interface TaskRow {
  id: string;
  title: string;
  description: string | null;
  dislike_level: number;
  importance: number;
  status: string;
  due_date: string | null;
  reminder_at: string | null;
  has_time: number;
  pre_reminder_offsets: string;
  notification_ids: string;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
}

function rowToTask(row: TaskRow): Task {
  return Task.create({
    id: TaskId.create(row.id),
    title: row.title,
    description: row.description,
    dislikeLevel: DislikeLevel.create(row.dislike_level),
    importance: Importance.create(row.importance),
    status: TaskStatus.from(row.status),
    dueDate: row.due_date,
    reminderAt: row.reminder_at,
    hasTime: row.has_time === 1,
    preReminderOffsets: JSON.parse(row.pre_reminder_offsets ?? "[]"),
    notificationIds: JSON.parse(row.notification_ids ?? "[]"),
    completedAt: row.completed_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  });
}

export class SQLiteTaskRepository implements ITaskRepository {
  async findById(id: string): Promise<Task | null> {
    const db = await getDatabase();
    const row = await db.getFirstAsync<TaskRow>(
      "SELECT * FROM tasks WHERE id = ?",
      [id],
    );
    return row ? rowToTask(row) : null;
  }

  async findAllActive(): Promise<Task[]> {
    const db = await getDatabase();
    const rows = await db.getAllAsync<TaskRow>(
      "SELECT * FROM tasks WHERE status IN ('pending', 'in_progress', 'snoozed')",
    );
    return rows.map(rowToTask);
  }

  async findAllCompleted(): Promise<Task[]> {
    const db = await getDatabase();
    const rows = await db.getAllAsync<TaskRow>(
      "SELECT * FROM tasks WHERE status = 'completed' ORDER BY completed_at DESC",
    );
    return rows.map(rowToTask);
  }

  async save(task: Task): Promise<void> {
    const db = await getDatabase();
    await db.runAsync(
      `INSERT INTO tasks (id, title, description, dislike_level, importance, status, due_date, reminder_at, has_time, pre_reminder_offsets, notification_ids, completed_at, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
       ON CONFLICT(id) DO UPDATE SET
         title = excluded.title,
         description = excluded.description,
         dislike_level = excluded.dislike_level,
         importance = excluded.importance,
         status = excluded.status,
         due_date = excluded.due_date,
         reminder_at = excluded.reminder_at,
         has_time = excluded.has_time,
         pre_reminder_offsets = excluded.pre_reminder_offsets,
         notification_ids = excluded.notification_ids,
         completed_at = excluded.completed_at,
         updated_at = excluded.updated_at`,
      [
        task.id.value,
        task.title,
        task.description,
        task.dislikeLevel.value,
        task.importance.value,
        task.status.value,
        task.dueDate,
        task.reminderAt,
        task.hasTime ? 1 : 0,
        JSON.stringify(task.preReminderOffsets),
        JSON.stringify(task.notificationIds),
        task.completedAt,
        task.createdAt,
        task.updatedAt,
      ],
    );
  }

  async delete(id: string): Promise<void> {
    const db = await getDatabase();
    await db.runAsync("DELETE FROM tasks WHERE id = ?", [id]);
  }

  async deleteAllActive(): Promise<void> {
    const db = await getDatabase();
    await db.runAsync(
      "DELETE FROM tasks WHERE status IN ('pending', 'in_progress', 'snoozed')",
    );
  }

  async deleteAllCompleted(): Promise<void> {
    const db = await getDatabase();
    await db.runAsync("DELETE FROM tasks WHERE status = 'completed'");
  }

  async deleteAll(): Promise<void> {
    const db = await getDatabase();
    await db.runAsync("DELETE FROM tasks");
  }
}
