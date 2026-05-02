import { PointHistory } from "../entities/PointHistory";

export class PointBalanceService {
  /**
   * ポイント残高を返す（+と-の合計）
   * ごほうび消費の残高チェック・表示に使用する
   */
  computeBalance(histories: PointHistory[]): number {
    return histories.reduce((sum, h) => sum + h.changePoints, 0);
  }

  /**
   * 獲得ポイント合計を返す（+のみ合計）
   * ユーザーへの累積実績表示に使用する
   */
  computeTotalEarned(histories: PointHistory[]): number {
    return histories
      .filter((h) => h.changePoints > 0)
      .reduce((sum, h) => sum + h.changePoints, 0);
  }
}
