import { BulkDeleteTasksUseCase } from "./application/task/useCases/BulkDeleteTasksUseCase";
import { CompleteTaskUseCase } from "./application/task/useCases/CompleteTaskUseCase";
import { CreateTaskUseCase } from "./application/task/useCases/CreateTaskUseCase";
import { DeleteTaskUseCase } from "./application/task/useCases/DeleteTaskUseCase";
import { GetActiveTasksUseCase } from "./application/task/useCases/GetActiveTasksUseCase";
import { GetCompletedTasksUseCase } from "./application/task/useCases/GetCompletedTasksUseCase";
import { UpdateTaskUseCase } from "./application/task/useCases/UpdateTaskUseCase";
import { SQLiteTaskRepository } from "./infrastructure/db/SQLiteTaskRepository";
import { ExpoNotificationService } from "./infrastructure/notifications/ExpoNotificationService";

// Infrastructure
const taskRepository = new SQLiteTaskRepository();
export const notificationService = new ExpoNotificationService();

// Application UseCases
export const createTaskUseCase = new CreateTaskUseCase(taskRepository);
export const completeTaskUseCase = new CompleteTaskUseCase(taskRepository);
export const getActiveTasksUseCase = new GetActiveTasksUseCase(taskRepository);
export const getCompletedTasksUseCase = new GetCompletedTasksUseCase(
  taskRepository,
);
export const deleteTaskUseCase = new DeleteTaskUseCase(taskRepository);
export const updateTaskUseCase = new UpdateTaskUseCase(taskRepository);
export const bulkDeleteTasksUseCase = new BulkDeleteTasksUseCase(
  taskRepository,
);
