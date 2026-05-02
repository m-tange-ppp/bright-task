import { Treat } from "../../domain/treat/entities/Treat";
import { ITreatRepository } from "../../domain/treat/repositories/ITreatRepository";
import { CostPoints } from "../../domain/treat/valueObjects/CostPoints";
import { TreatId } from "../../domain/treat/valueObjects/TreatId";
import { getDatabase } from "./schema";

interface TreatRow {
  id: string;
  title: string;
  description: string | null;
  cost_points: number;
  created_at: string;
  updated_at: string;
}

function rowToTreat(row: TreatRow): Treat {
  return Treat.create({
    id: TreatId.create(row.id),
    title: row.title,
    description: row.description,
    costPoints: CostPoints.create(row.cost_points),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  });
}

export class SQLiteTreatRepository implements ITreatRepository {
  async findById(id: string): Promise<Treat | null> {
    const db = await getDatabase();
    const row = await db.getFirstAsync<TreatRow>(
      "SELECT * FROM treats WHERE id = ?",
      [id],
    );
    return row ? rowToTreat(row) : null;
  }

  async findAll(): Promise<Treat[]> {
    const db = await getDatabase();
    const rows = await db.getAllAsync<TreatRow>(
      "SELECT * FROM treats ORDER BY created_at DESC",
    );
    return rows.map(rowToTreat);
  }

  async save(treat: Treat): Promise<void> {
    const db = await getDatabase();
    await db.runAsync(
      `INSERT INTO treats (id, title, description, cost_points, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?)
       ON CONFLICT(id) DO UPDATE SET
         title       = excluded.title,
         description = excluded.description,
         cost_points = excluded.cost_points,
         updated_at  = excluded.updated_at`,
      [
        treat.id.value,
        treat.title,
        treat.description,
        treat.costPoints.value,
        treat.createdAt,
        treat.updatedAt,
      ],
    );
  }

  async delete(id: string): Promise<void> {
    const db = await getDatabase();
    await db.runAsync("DELETE FROM treats WHERE id = ?", [id]);
  }
}
