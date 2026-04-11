export interface CreateTaskDto {
  title: string;
  description: string | null;
  dislikeLevel: number;
  importance: number;
  dueDate: string | null;
  reminderAt: string | null;
}
