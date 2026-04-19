import { create } from "zustand";
import { CreateTaskDto } from "../../application/task/dto/CreateTaskDto";
import { TaskDto } from "../../application/task/dto/TaskDto";
import { UpdateTaskDto } from "../../application/task/dto/UpdateTaskDto";
import { BulkDeleteScope } from "../../application/task/useCases/BulkDeleteTasksUseCase";
import {
  bulkDeleteTasksUseCase,
  completeTaskUseCase,
  createTaskUseCase,
  deleteTaskUseCase,
  getActiveTasksUseCase,
  getCompletedTasksUseCase,
  updateTaskUseCase,
} from "../../di";

interface TaskStore {
  activeTasks: TaskDto[];
  completedTasks: TaskDto[];
  isLoadingActive: boolean;
  isLoadingCompleted: boolean;

  loadActiveTasks: () => Promise<void>;
  loadCompletedTasks: () => Promise<void>;
  addTask: (dto: CreateTaskDto) => Promise<TaskDto>;
  finishTask: (id: string) => Promise<void>;
  removeTask: (id: string) => Promise<void>;
  updateTask: (dto: UpdateTaskDto) => Promise<void>;
  bulkRemoveTasks: (scope: BulkDeleteScope) => Promise<void>;
}

export const useTaskStore = create<TaskStore>((set) => ({
  activeTasks: [],
  completedTasks: [],
  isLoadingActive: false,
  isLoadingCompleted: false,

  loadActiveTasks: async () => {
    set({ isLoadingActive: true });
    try {
      const tasks = await getActiveTasksUseCase.execute();
      set({ activeTasks: tasks });
    } finally {
      set({ isLoadingActive: false });
    }
  },

  loadCompletedTasks: async () => {
    set({ isLoadingCompleted: true });
    try {
      const tasks = await getCompletedTasksUseCase.execute();
      set({ completedTasks: tasks });
    } finally {
      set({ isLoadingCompleted: false });
    }
  },

  addTask: async (dto) => {
    const task = await createTaskUseCase.execute(dto);
    set((state) => ({ activeTasks: [...state.activeTasks, task] }));
    return task;
  },

  finishTask: async (id) => {
    const completed = await completeTaskUseCase.execute(id);
    set((state) => ({
      activeTasks: state.activeTasks.filter((t) => t.id !== id),
      completedTasks: [completed, ...state.completedTasks],
    }));
  },

  removeTask: async (id) => {
    await deleteTaskUseCase.execute(id);
    set((state) => ({
      activeTasks: state.activeTasks.filter((t) => t.id !== id),
      completedTasks: state.completedTasks.filter((t) => t.id !== id),
    }));
  },

  updateTask: async (dto) => {
    const updated = await updateTaskUseCase.execute(dto);
    set((state) => ({
      activeTasks: state.activeTasks.map((t) =>
        t.id === dto.id ? updated : t,
      ),
    }));
  },

  bulkRemoveTasks: async (scope) => {
    await bulkDeleteTasksUseCase.execute(scope);
    set((state) => ({
      activeTasks: scope === "completed" ? state.activeTasks : [],
      completedTasks: scope === "active" ? state.completedTasks : [],
    }));
  },
}));
