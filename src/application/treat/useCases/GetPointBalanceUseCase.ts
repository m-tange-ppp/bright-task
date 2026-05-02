import { IPointHistoryRepository } from "../../../domain/treat/repositories/IPointHistoryRepository";
import { PointBalanceService } from "../../../domain/treat/services/PointBalanceService";
import { PointBalanceDto } from "../dto/PointHistoryDto";

export class GetPointBalanceUseCase {
  constructor(
    private readonly pointHistoryRepository: IPointHistoryRepository,
    private readonly pointBalanceService: PointBalanceService,
  ) {}

  async execute(): Promise<PointBalanceDto> {
    const histories = await this.pointHistoryRepository.findByType("dislike");
    return {
      balance: this.pointBalanceService.computeBalance(histories),
      totalEarned: this.pointBalanceService.computeTotalEarned(histories),
    };
  }
}
