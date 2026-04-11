import * as Crypto from "expo-crypto";
import { Task } from "../../../domain/task/entities/Task";
import { ITaskRepository } from "../../../domain/task/repositories/ITaskRepository";
import { DislikeLevel } from "../../../domain/task/valueObjects/DislikeLevel";
import { Importance } from "../../../domain/task/valueObjects/Importance";
import { TaskId } from "../../../domain/task/valueObjects/TaskId";
import { TaskStatus } from "../../../domain/task/valueObjects/TaskStatus";
import { CreateTaskDto } from "../dto/CreateTaskDto";
import { TaskDto } from "../dto/TaskDto";
import { toTaskDto } from "../dto/taskMapper";

export class CreateTaskUseCase {
  constructor(private readonly repository: ITaskRepository) {}

  async execute(dto: CreateTaskDto): Promise<TaskDto> {
    const now = new Date().toISOString();
    const task = Task.create({
      id: TaskId.create(Crypto.randomUUID()),
      title: dto.title.trim(),
      description: dto.description,
      dislikeLevel: DislikeLevel.create(dto.dislikeLevel),
      importance: Importance.create(dto.importance),
      status: TaskStatus.PENDING,
      dueDate: dto.dueDate,
      reminderAt: dto.reminderAt,
      completedAt: null,
      createdAt: now,
      updatedAt: now,
    });

    await this.repository.save(task);
    return toTaskDto(task);
  }
}
