import { IPointHistoryRepository } from "../../../domain/reward/repositories/IPointHistoryRepository";
import { ITreatRepository } from "../../../domain/reward/repositories/ITreatRepository";

export class DeleteTreatUseCase {
  constructor(
    private readonly treatRepository: ITreatRepository,
    private readonly pointHistoryRepository: IPointHistoryRepository,
  ) {}

  async execute(id: string): Promise<void> {
    const treat = await this.treatRepository.findById(id);
    if (!treat) throw new Error(`Treat not found: ${id}`);

    // ご褒美削除前に PointHistory の treat_id を NULL 化する
    await this.pointHistoryRepository.nullifyTreatId(id);
    await this.treatRepository.delete(id);
  }
}
