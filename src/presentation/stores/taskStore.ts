import { create } from "zustand";
import { CreateTaskDto } from "../../application/task/dto/CreateTaskDto";
import { TaskDto } from "../../application/task/dto/TaskDto";
import {
  completeTaskUseCase,
  createTaskUseCase,
  deleteTaskUseCase,
  getActiveTasksUseCase,
  getCompletedTasksUseCase,
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
    await completeTaskUseCase.execute(id);
    set((state) => ({
      activeTasks: state.activeTasks.filter((t) => t.id !== id),
    }));
  },

  removeTask: async (id) => {
    await deleteTaskUseCase.execute(id);
    set((state) => ({
      activeTasks: state.activeTasks.filter((t) => t.id !== id),
      completedTasks: state.completedTasks.filter((t) => t.id !== id),
    }));
  },
}));
