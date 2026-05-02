import * as Crypto from "expo-crypto";
import { PointHistory } from "../../../domain/treat/entities/PointHistory";
import { IPointHistoryRepository } from "../../../domain/treat/repositories/IPointHistoryRepository";
import { ITreatRepository } from "../../../domain/treat/repositories/ITreatRepository";
import { PointBalanceService } from "../../../domain/treat/services/PointBalanceService";
import { PointHistoryId } from "../../../domain/treat/valueObjects/PointHistoryId";

export class ConsumeTreatUseCase {
  constructor(
    private readonly treatRepository: ITreatRepository,
    private readonly pointHistoryRepository: IPointHistoryRepository,
    private readonly pointBalanceService: PointBalanceService,
  ) {}

  async execute(treatId: string): Promise<void> {
    const treat = await this.treatRepository.findById(treatId);
    if (!treat) throw new Error(`Treat not found: ${treatId}`);

    // dislike ポイントの残高チェック
    const histories = await this.pointHistoryRepository.findByType("dislike");
    const balance = this.pointBalanceService.computeBalance(histories);
    if (balance < treat.costPoints.value) {
      throw new Error(
        `ポイントが不足しています（残高: ${balance}, 必要: ${treat.costPoints.value}）`,
      );
    }

    const history = PointHistory.create({
      id: PointHistoryId.create(Crypto.randomUUID()),
      taskId: null,
      treatId: treat.id.value,
      type: "dislike",
      changePoints: -treat.costPoints.value,
      reason: "treat_consumption",
      createdAt: new Date().toISOString(),
    });
    await this.pointHistoryRepository.save(history);
  }
}
