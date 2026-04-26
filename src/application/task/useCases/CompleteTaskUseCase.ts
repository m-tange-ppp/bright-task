import { INotificationService } from "../../../application/notifications/INotificationService";
import { ITaskRepository } from "../../../domain/task/repositories/ITaskRepository";
import { TaskDto } from "../dto/TaskDto";
import { toTaskDto } from "../dto/taskMapper";

export class CompleteTaskUseCase {
  constructor(
    private readonly repository: ITaskRepository,
    private readonly notificationService: INotificationService,
  ) {}

  async execute(taskId: string): Promise<TaskDto> {
    const task = await this.repository.findById(taskId);
    if (!task) throw new Error(`Task not found: ${taskId}`);

    // 完了時に残りの通知をキャンセル
    if (task.notificationIds.length > 0) {
      await this.notificationService.cancelTaskNotifications(
        task.notificationIds,
      );
    }

    const { task: completed } = task.complete();
    await this.repository.save(completed);
    return toTaskDto(completed);
  }
}
