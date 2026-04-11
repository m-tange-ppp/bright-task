import { Task } from "../entities/Task";

export class TaskPriorityService {
  // 嫌さ×重要度の優先スコアで降順ソート
  sortByPriority(tasks: Task[]): Task[] {
    return [...tasks].sort((a, b) => b.priorityScore() - a.priorityScore());
  }
}
