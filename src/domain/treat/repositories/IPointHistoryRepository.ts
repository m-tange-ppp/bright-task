import { PointHistory, PointHistoryType } from "../entities/PointHistory";

export interface IPointHistoryRepository {
  save(history: PointHistory): Promise<void>;
  findByType(type: PointHistoryType): Promise<PointHistory[]>;
  /** Treat 削除時に呼び出す。該当する treat_id を NULL に更新する */
  nullifyTreatId(treatId: string): Promise<void>;
}
