import { ITaskRepository } from "../../../domain/task/repositories/ITaskRepository";
import { TaskDto } from "../dto/TaskDto";
import { toTaskDto } from "../dto/taskMapper";

export class GetCompletedTasksUseCase {
  constructor(private readonly repository: ITaskRepository) {}

  async execute(): Promise<TaskDto[]> {
    const tasks = await this.repository.findAllCompleted();
    return tasks.map(toTaskDto);
  }
}
