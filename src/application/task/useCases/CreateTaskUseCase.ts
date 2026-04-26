import * as Crypto from "expo-crypto";
import { INotificationService } from "../../../application/notifications/INotificationService";
import { Task } from "../../../domain/task/entities/Task";
import { ITaskRepository } from "../../../domain/task/repositories/ITaskRepository";
import { DEFAULT_NOTIFICATION_HOUR } from "../../../domain/task/services/taskNotificationRules";
import { DislikeLevel } from "../../../domain/task/valueObjects/DislikeLevel";
import { Importance } from "../../../domain/task/valueObjects/Importance";
import { TaskId } from "../../../domain/task/valueObjects/TaskId";
import { TaskStatus } from "../../../domain/task/valueObjects/TaskStatus";
import { CreateTaskDto } from "../dto/CreateTaskDto";
import { TaskDto } from "../dto/TaskDto";
import { toTaskDto } from "../dto/taskMapper";

export class CreateTaskUseCase {
  constructor(
    private readonly repository: ITaskRepository,
    private readonly notificationService: INotificationService,
  ) {}

  async execute(dto: CreateTaskDto): Promise<TaskDto> {
    const now = new Date().toISOString();
    let task = Task.create({
      id: TaskId.create(Crypto.randomUUID()),
      title: dto.title.trim(),
      description: dto.description,
      dislikeLevel: DislikeLevel.create(dto.dislikeLevel),
      importance: Importance.create(dto.importance),
      status: TaskStatus.PENDING,
      dueDate: dto.dueDate,
      reminderAt: dto.reminderAt,
      hasTime: dto.hasTime,
      preReminderOffsets: dto.preReminderOffsets,
      notificationIds: [],
      completedAt: null,
      createdAt: now,
      updatedAt: now,
    });

    if (dto.dueDate) {
      const notifyDate = new Date(dto.dueDate);
      if (!dto.hasTime) {
        notifyDate.setHours(DEFAULT_NOTIFICATION_HOUR, 0, 0, 0);
      }
      const ids = await this.notificationService.scheduleTaskNotifications(
        task.id.value,
        task.title,
        notifyDate,
        dto.hasTime ? dto.preReminderOffsets : [],
        dto.hasTime,
      );
      task = task.withNotificationIds(ids);
    }

    await this.repository.save(task);
    return toTaskDto(task);
  }
}
