import { ITaskRepository } from "../../../domain/task/repositories/ITaskRepository";
import { TaskDto } from "../dto/TaskDto";
import { toTaskDto } from "../dto/taskMapper";

export class CompleteTaskUseCase {
  constructor(private readonly repository: ITaskRepository) {}

  async execute(taskId: string): Promise<TaskDto> {
    const task = await this.repository.findById(taskId);
    if (!task) throw new Error(`Task not found: ${taskId}`);

    const { task: completed } = task.complete();
    await this.repository.save(completed);
    return toTaskDto(completed);
  }
}
