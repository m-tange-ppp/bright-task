export interface TaskDto {
  id: string;
  title: string;
  description: string | null;
  dislikeLevel: number;
  importance: number;
  status: string;
  dueDate: string | null;
  hasTime: boolean;
  reminderAt: string | null;
  preReminderOffsets: number[];
  notificationIds: string[];
  completedAt: string | null;
  createdAt: string;
  updatedAt: string;
}
