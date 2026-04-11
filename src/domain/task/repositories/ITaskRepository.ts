import { Task } from "../entities/Task";

export interface ITaskRepository {
  findById(id: string): Promise<Task | null>;
  findAllActive(): Promise<Task[]>;
  findAllCompleted(): Promise<Task[]>;
  save(task: Task): Promise<void>;
  delete(id: string): Promise<void>;
}
