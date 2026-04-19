import { ITaskRepository } from "../../../domain/task/repositories/ITaskRepository";

export type BulkDeleteScope = "all" | "active" | "completed";

export class BulkDeleteTasksUseCase {
  constructor(private readonly taskRepository: ITaskRepository) {}

  async execute(scope: BulkDeleteScope): Promise<void> {
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
