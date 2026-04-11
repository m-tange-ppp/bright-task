import { ITaskRepository } from "../../../domain/task/repositories/ITaskRepository";

export class DeleteTaskUseCase {
  constructor(private readonly repository: ITaskRepository) {}

  async execute(taskId: string): Promise<void> {
    await this.repository.delete(taskId);
  }
}
