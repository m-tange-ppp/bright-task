import { PointHistoryId } from "../valueObjects/PointHistoryId";

export type PointHistoryType = "dislike" | "importance";
export type PointHistoryReason = "task_complete" | "treat_consumption";

export interface PointHistoryProps {
  id: PointHistoryId;
  /** タスク完了時に設定。ご褒美消費時は null */
  taskId: string | null;
  /** ご褒美消費時に設定。タスク完了時は null。Treat 削除後は null になる場合がある */
  treatId: string | null;
  type: PointHistoryType;
  /** 符号付き: +加算 / -減算 */
  changePoints: number;
  reason: PointHistoryReason;
  createdAt: string;
}

/** 不変エンティティ — 生成後の変更なし */
export class PointHistory {
  private constructor(private readonly _props: PointHistoryProps) {}

  static create(props: PointHistoryProps): PointHistory {
    if (props.changePoints === 0) {
      throw new Error("changePoints must not be zero");
    }
    return new PointHistory(props);
  }

  get id(): PointHistoryId {
    return this._props.id;
  }
  get taskId(): string | null {
    return this._props.taskId;
  }
  get treatId(): string | null {
    return this._props.treatId;
  }
  get type(): PointHistoryType {
    return this._props.type;
  }
  get changePoints(): number {
    return this._props.changePoints;
  }
  get reason(): PointHistoryReason {
    return this._props.reason;
  }
  get createdAt(): string {
    return this._props.createdAt;
  }
}
