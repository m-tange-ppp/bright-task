import { ITaskRepository } from "../../../domain/task/repositories/ITaskRepository";
import { TaskPriorityService } from "../../../domain/task/services/TaskPriorityService";
import { TaskDto } from "../dto/TaskDto";
import { toTaskDto } from "../dto/taskMapper";

export class GetActiveTasksUseCase {
  private readonly priorityService = new TaskPriorityService();

  constructor(private readonly repository: ITaskRepository) {}

  async execute(): Promise<TaskDto[]> {
    const tasks = await this.repository.findAllActive();
    return this.priorityService.sortByPriority(tasks).map(toTaskDto);
  }
}
