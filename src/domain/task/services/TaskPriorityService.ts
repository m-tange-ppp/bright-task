import { Task } from "../entities/Task";

export class TaskPriorityService {
  // 嫌さ×重要度の優先スコアで降順ソート
  sortByPriority(tasks: Task[]): Task[] {
    return [...tasks].sort((a, b) => b.priorityScore() - a.priorityScore());
  }

  // 完了タスクの嫌さレベル合計（達成ポイント）
  totalDislikeLevel(tasks: Task[]): number {
    return tasks.reduce((sum, t) => sum + t.dislikeLevel.value, 0);
  }

  // 完了タスクの重要度合計（達成ポイント）
  totalImportance(tasks: Task[]): number {
    return tasks.reduce((sum, t) => sum + t.importance.value, 0);
  }
}
