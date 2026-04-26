export interface INotificationService {
  requestPermission(): Promise<boolean>;
  getPermissionStatus(): Promise<boolean>;

  /**
   * タスクの通知をスケジュールする。
   * - dueDate 丁度の通知を常にスケジュールする
   * - preReminderOffsets の各値（分）だけ前にも通知をスケジュールする
   * - 過去の日時はスキップする
   * @returns スケジュールされた全通知 ID の配列
   */
  scheduleTaskNotifications(
    taskId: string,
    title: string,
    dueDate: Date,
    preReminderOffsets: number[],
    hasTime?: boolean,
  ): Promise<string[]>;

  /** 指定した通知 ID をキャンセルする */
  cancelTaskNotifications(notificationIds: string[]): Promise<void>;

  /** 全スケジュール済み通知をキャンセルする（一括削除用） */
  cancelAllTaskNotifications(): Promise<void>;
}
