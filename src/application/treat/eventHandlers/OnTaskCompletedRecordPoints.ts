import * as Crypto from "expo-crypto";
import { PointHistory } from "../../../domain/treat/entities/PointHistory";
import { IPointHistoryRepository } from "../../../domain/treat/repositories/IPointHistoryRepository";
import { PointHistoryId } from "../../../domain/treat/valueObjects/PointHistoryId";
import { TaskCompletedEvent } from "../../../domain/task/events/TaskCompletedEvent";

/**
 * TaskCompletedEvent を購読し、dislike / importance それぞれの
 * PointHistory レコードを挿入するハンドラ
 */
export class OnTaskCompletedRecordPoints {
  constructor(
    private readonly pointHistoryRepository: IPointHistoryRepository,
  ) {}

  async handle(event: TaskCompletedEvent): Promise<void> {
    const now = new Date().toISOString();

    const dislikeHistory = PointHistory.create({
      id: PointHistoryId.create(Crypto.randomUUID()),
      taskId: event.taskId,
      treatId: null,
      type: "dislike",
      changePoints: event.dislikeLevel,
      reason: "task_complete",
      createdAt: now,
    });

    const importanceHistory = PointHistory.create({
      id: PointHistoryId.create(Crypto.randomUUID()),
      taskId: event.taskId,
      treatId: null,
      type: "importance",
      changePoints: event.importance,
      reason: "task_complete",
      createdAt: now,
    });

    await this.pointHistoryRepository.save(dislikeHistory);
    await this.pointHistoryRepository.save(importanceHistory);
  }
}
