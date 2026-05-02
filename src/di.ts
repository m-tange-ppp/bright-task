import { OnTaskCompletedRecordPoints } from "./application/reward/eventHandlers/OnTaskCompletedRecordPoints";
import { ConsumeTreatUseCase } from "./application/reward/useCases/ConsumeTreatUseCase";
import { CreateTreatUseCase } from "./application/reward/useCases/CreateTreatUseCase";
import { DeleteTreatUseCase } from "./application/reward/useCases/DeleteTreatUseCase";
import { GetPointBalanceUseCase } from "./application/reward/useCases/GetPointBalanceUseCase";
import { GetTreatsUseCase } from "./application/reward/useCases/GetTreatsUseCase";
import { UpdateTreatUseCase } from "./application/reward/useCases/UpdateTreatUseCase";
import { BulkDeleteTasksUseCase } from "./application/task/useCases/BulkDeleteTasksUseCase";
import { CompleteTaskUseCase } from "./application/task/useCases/CompleteTaskUseCase";
import { CreateTaskUseCase } from "./application/task/useCases/CreateTaskUseCase";
import { DeleteTaskUseCase } from "./application/task/useCases/DeleteTaskUseCase";
import { GetActiveTasksUseCase } from "./application/task/useCases/GetActiveTasksUseCase";
import { GetCompletedTasksUseCase } from "./application/task/useCases/GetCompletedTasksUseCase";
import { UpdateTaskUseCase } from "./application/task/useCases/UpdateTaskUseCase";
import { PointBalanceService } from "./domain/reward/services/PointBalanceService";
import { domainEventBus } from "./domain/shared/DomainEventBus";
import { TaskCompletedEvent } from "./domain/task/events/TaskCompletedEvent";
import { SQLitePointHistoryRepository } from "./infrastructure/db/SQLitePointHistoryRepository";
import { SQLiteTaskRepository } from "./infrastructure/db/SQLiteTaskRepository";
import { SQLiteTreatRepository } from "./infrastructure/db/SQLiteTreatRepository";
import { ExpoNotificationService } from "./infrastructure/notifications/ExpoNotificationService";

// Infrastructure
const taskRepository = new SQLiteTaskRepository();
const treatRepository = new SQLiteTreatRepository();
const pointHistoryRepository = new SQLitePointHistoryRepository();
export const notificationService = new ExpoNotificationService();

// Domain Services
const pointBalanceService = new PointBalanceService();

// Application UseCases — Task
export const createTaskUseCase = new CreateTaskUseCase(
  taskRepository,
  notificationService,
);
export const completeTaskUseCase = new CompleteTaskUseCase(
  taskRepository,
  notificationService,
);
export const getActiveTasksUseCase = new GetActiveTasksUseCase(taskRepository);
export const getCompletedTasksUseCase = new GetCompletedTasksUseCase(
  taskRepository,
);
export const deleteTaskUseCase = new DeleteTaskUseCase(
  taskRepository,
  notificationService,
);
export const updateTaskUseCase = new UpdateTaskUseCase(
  taskRepository,
  notificationService,
);
export const bulkDeleteTasksUseCase = new BulkDeleteTasksUseCase(
  taskRepository,
  notificationService,
);

// Application UseCases — Reward
export const createTreatUseCase = new CreateTreatUseCase(treatRepository);
export const updateTreatUseCase = new UpdateTreatUseCase(treatRepository);
export const deleteTreatUseCase = new DeleteTreatUseCase(
  treatRepository,
  pointHistoryRepository,
);
export const getTreatsUseCase = new GetTreatsUseCase(treatRepository);
export const consumeTreatUseCase = new ConsumeTreatUseCase(
  treatRepository,
  pointHistoryRepository,
  pointBalanceService,
);
export const getPointBalanceUseCase = new GetPointBalanceUseCase(
  pointHistoryRepository,
  pointBalanceService,
);

// Domain Event subscriptions
const onTaskCompletedRecordPoints = new OnTaskCompletedRecordPoints(
  pointHistoryRepository,
);
domainEventBus.subscribe(TaskCompletedEvent.name, (event: TaskCompletedEvent) =>
  onTaskCompletedRecordPoints.handle(event),
);
