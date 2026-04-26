import { INotificationService } from "../../../application/notifications/INotificationService";
import { ITaskRepository } from "../../../domain/task/repositories/ITaskRepository";

export class DeleteTaskUseCase {
  constructor(
    private readonly repository: ITaskRepository,
    private readonly notificationService: INotificationService,
  ) {}

  async execute(taskId: string): Promise<void> {
    const task = await this.repository.findById(taskId);
    if (task && task.notificationIds.length > 0) {
      await this.notificationService.cancelTaskNotifications(
        task.notificationIds,
      );
    }
    await this.repository.delete(taskId);
  }
}
