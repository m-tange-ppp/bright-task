import { INotificationService } from "../../../application/notifications/INotificationService";
import { ITaskRepository } from "../../../domain/task/repositories/ITaskRepository";
import { DEFAULT_NOTIFICATION_HOUR } from "../../../domain/task/services/taskNotificationRules";
import { DislikeLevel } from "../../../domain/task/valueObjects/DislikeLevel";
import { Importance } from "../../../domain/task/valueObjects/Importance";
import { TaskDto } from "../dto/TaskDto";
import { toTaskDto } from "../dto/taskMapper";
import { UpdateTaskDto } from "../dto/UpdateTaskDto";

export class UpdateTaskUseCase {
  constructor(
    private readonly repository: ITaskRepository,
    private readonly notificationService: INotificationService,
  ) {}

  async execute(dto: UpdateTaskDto): Promise<TaskDto> {
    const task = await this.repository.findById(dto.id);
    if (!task) {
      throw new Error(`Task not found: ${dto.id}`);
    }

    // 旧通知をキャンセル
    if (task.notificationIds.length > 0) {
      await this.notificationService.cancelTaskNotifications(
        task.notificationIds,
      );
    }

    let updated = task.update({
      title: dto.title.trim(),
      description: dto.description,
      dislikeLevel: DislikeLevel.create(dto.dislikeLevel),
      importance: Importance.create(dto.importance),
      dueDate: dto.dueDate,
      reminderAt: dto.reminderAt,
      hasTime: dto.hasTime,
      preReminderOffsets: dto.preReminderOffsets,
    });

    // 新しい通知をスケジュール
    if (dto.dueDate) {
      const notifyDate = new Date(dto.dueDate);
      if (!dto.hasTime) {
        notifyDate.setHours(DEFAULT_NOTIFICATION_HOUR, 0, 0, 0);
      }
      const ids = await this.notificationService.scheduleTaskNotifications(
        updated.id.value,
        updated.title,
        notifyDate,
        dto.hasTime ? dto.preReminderOffsets : [],
        dto.hasTime,
      );
      updated = updated.withNotificationIds(ids);
    }

    await this.repository.save(updated);
    return toTaskDto(updated);
  }
}
