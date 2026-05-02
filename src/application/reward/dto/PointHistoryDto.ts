export interface PointHistoryDto {
  id: string;
  taskId: string | null;
  treatId: string | null;
  type: string;
  changePoints: number;
  reason: string;
  createdAt: string;
}

export interface PointBalanceDto {
  /** ポイント残高（+と-の合計） */
  balance: number;
  /** 累積獲得ポイント（+のみ合計） */
  totalEarned: number;
}
