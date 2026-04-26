export interface CreateTaskDto {
  title: string;
  description: string | null;
  dislikeLevel: number;
  importance: number;
  dueDate: string | null;
  hasTime: boolean;
  reminderAt: string | null;
  preReminderOffsets: number[];
}
