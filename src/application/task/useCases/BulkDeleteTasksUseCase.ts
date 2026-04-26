import { INotificationService } from "../../../application/notifications/INotificationService";
import { ITaskRepository } from "../../../domain/task/repositories/ITaskRepository";

export type BulkDeleteScope = "all" | "active" | "completed";

export class BulkDeleteTasksUseCase {
  constructor(
    private readonly taskRepository: ITaskRepository,
    private readonly notificationService: INotificationService,
  ) {}

  async execute(scope: BulkDeleteScope): Promise<void> {
    // 削除前に対象タスクの通知を一括キャンセル
    await this.notificationService.cancelAllTaskNotifications();

    switch (scope) {
      case "active":
        await this.taskRepository.deleteAllActive();
        break;
      case "completed":
        await this.taskRepository.deleteAllCompleted();
        break;
      case "all":
        await this.taskRepository.deleteAll();
        break;
    }
  }
}
