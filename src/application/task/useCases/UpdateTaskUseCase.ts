import { ITaskRepository } from "../../../domain/task/repositories/ITaskRepository";
import { DislikeLevel } from "../../../domain/task/valueObjects/DislikeLevel";
import { Importance } from "../../../domain/task/valueObjects/Importance";
import { TaskDto } from "../dto/TaskDto";
import { toTaskDto } from "../dto/taskMapper";
import { UpdateTaskDto } from "../dto/UpdateTaskDto";

export class UpdateTaskUseCase {
  constructor(private readonly repository: ITaskRepository) {}

  async execute(dto: UpdateTaskDto): Promise<TaskDto> {
    const task = await this.repository.findById(dto.id);
    if (!task) {
      throw new Error(`Task not found: ${dto.id}`);
    }

    const updated = task.update({
      title: dto.title.trim(),
      description: dto.description,
      dislikeLevel: DislikeLevel.create(dto.dislikeLevel),
      importance: Importance.create(dto.importance),
      dueDate: dto.dueDate,
      reminderAt: dto.reminderAt,
    });

    await this.repository.save(updated);
    return toTaskDto(updated);
  }
}
