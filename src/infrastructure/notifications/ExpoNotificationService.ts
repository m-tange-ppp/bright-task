import * as Notifications from "expo-notifications";
import { Platform } from "react-native";
import { INotificationService } from "../../application/notifications/INotificationService";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

/** オフセット（分）を日本語表現に変換 */
function offsetToLabel(minutes: number): string {
  if (minutes < 60) return `${minutes}分`;
  if (minutes < 1440) return `${minutes / 60}時間`;
  return `${minutes / 1440}日`;
}

export class ExpoNotificationService implements INotificationService {
  async requestPermission(): Promise<boolean> {
    if (Platform.OS === "android") {
      await Notifications.setNotificationChannelAsync("task-reminders", {
        name: "タスクリマインダー",
        importance: Notifications.AndroidImportance.HIGH,
        vibrationPattern: [0, 250, 250, 250],
      });
    }

    const { status: existing } = await Notifications.getPermissionsAsync();
    if (existing === "granted") return true;

    const { status } = await Notifications.requestPermissionsAsync();
    return status === "granted";
  }

  async getPermissionStatus(): Promise<boolean> {
    const { status } = await Notifications.getPermissionsAsync();
    return status === "granted";
  }

  async scheduleTaskNotifications(
    taskId: string,
    title: string,
    dueDate: Date,
    preReminderOffsets: number[],
    hasTime = true,
  ): Promise<string[]> {
    const now = new Date();
    const ids: string[] = [];

    // 期限X分前の通知
    for (const offsetMinutes of preReminderOffsets) {
      const triggerDate = new Date(
        dueDate.getTime() - offsetMinutes * 60 * 1000,
      );
      if (triggerDate <= now) continue; // 過去はスキップ

      const id = await Notifications.scheduleNotificationAsync({
        content: {
          title: "⏰ もうすぐ期限です",
          body: `「${title}」の期限まであと${offsetToLabel(offsetMinutes)}です!!`,
          data: { taskId },
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.DATE,
          date: triggerDate,
          channelId: "task-reminders",
        },
      });
      ids.push(id);
    }

    // 期限丁度（時間指定なし時は当日9:00）の通知
    if (dueDate > now) {
      const id = await Notifications.scheduleNotificationAsync({
        content: {
          title: hasTime ? "📅 期限が来ました" : "📅 今日が期限日です",
          body: hasTime
            ? `「${title}」の期限です!!`
            : `「${title}」は今日が期限です。忘れずに取り組みましょう!!`,
          data: { taskId },
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.DATE,
          date: dueDate,
          channelId: "task-reminders",
        },
      });
      ids.push(id);
    }

    return ids;
  }

  async cancelTaskNotifications(notificationIds: string[]): Promise<void> {
    await Promise.all(
      notificationIds.map((id) =>
        Notifications.cancelScheduledNotificationAsync(id),
      ),
    );
  }

  async cancelAllTaskNotifications(): Promise<void> {
    await Notifications.cancelAllScheduledNotificationsAsync();
  }
}
