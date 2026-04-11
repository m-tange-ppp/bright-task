export interface TaskDto {
  id: string;
  title: string;
  description: string | null;
  dislikeLevel: number;
  importance: number;
  status: string;
  dueDate: string | null;
  reminderAt: string | null;
  completedAt: string | null;
  createdAt: string;
  updatedAt: string;
}
