import {
  PointHistory,
  PointHistoryType,
} from "../../domain/reward/entities/PointHistory";
import { IPointHistoryRepository } from "../../domain/reward/repositories/IPointHistoryRepository";
import { PointHistoryId } from "../../domain/reward/valueObjects/PointHistoryId";
import { getDatabase } from "./schema";

interface PointHistoryRow {
  id: string;
  task_id: string | null;
  treat_id: string | null;
  type: string;
  change_points: number;
  reason: string;
  created_at: string;
}

function rowToPointHistory(row: PointHistoryRow): PointHistory {
  return PointHistory.create({
    id: PointHistoryId.create(row.id),
    taskId: row.task_id,
    treatId: row.treat_id,
    type: row.type as PointHistoryType,
    changePoints: row.change_points,
    reason: row.reason as "task_complete" | "treat_consumption",
    createdAt: row.created_at,
  });
}

export class SQLitePointHistoryRepository implements IPointHistoryRepository {
  async save(history: PointHistory): Promise<void> {
    const db = await getDatabase();
    await db.runAsync(
      `INSERT INTO point_history (id, task_id, treat_id, type, change_points, reason, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        history.id.value,
        history.taskId,
        history.treatId,
        history.type,
        history.changePoints,
        history.reason,
        history.createdAt,
      ],
    );
  }

  async findByType(type: PointHistoryType): Promise<PointHistory[]> {
    const db = await getDatabase();
    const rows = await db.getAllAsync<PointHistoryRow>(
      "SELECT * FROM point_history WHERE type = ? ORDER BY created_at ASC",
      [type],
    );
    return rows.map(rowToPointHistory);
  }

  async nullifyTreatId(treatId: string): Promise<void> {
    const db = await getDatabase();
    await db.runAsync(
      "UPDATE point_history SET treat_id = NULL WHERE treat_id = ?",
      [treatId],
    );
  }
}
