import { Task } from "../../../domain/task/entities/Task";
import { TaskDto } from "../dto/TaskDto";

export function toTaskDto(task: Task): TaskDto {
  return {
    id: task.id.value,
    title: task.title,
    description: task.description,
    dislikeLevel: task.dislikeLevel.value,
    importance: task.importance.value,
    status: task.status.value,
    dueDate: task.dueDate,
    hasTime: task.hasTime,
    reminderAt: task.reminderAt,
    preReminderOffsets: task.preReminderOffsets,
    notificationIds: task.notificationIds,
    completedAt: task.completedAt,
    createdAt: task.createdAt,
    updatedAt: task.updatedAt,
  };
}
