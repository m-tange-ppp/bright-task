import { IPointHistoryRepository } from "../../../domain/treat/repositories/IPointHistoryRepository";
import { ITreatRepository } from "../../../domain/treat/repositories/ITreatRepository";
import { TreatDto } from "../dto/TreatDto";
import { toTreatDto } from "../dto/treatMapper";

export class GetTreatsUseCase {
  constructor(
    private readonly repository: ITreatRepository,
    private readonly pointHistoryRepository: IPointHistoryRepository,
  ) {}

  async execute(): Promise<TreatDto[]> {
    const [treats, histories] = await Promise.all([
      this.repository.findAll(),
      this.pointHistoryRepository.findByType("dislike"),
    ]);

    // treat_id ごとに交換回数を集計
    const countMap = new Map<string, number>();
    for (const h of histories) {
      if (h.reason === "treat_consumption" && h.treatId) {
        countMap.set(h.treatId, (countMap.get(h.treatId) ?? 0) + 1);
      }
    }

    return treats.map((treat) => ({
      ...toTreatDto(treat),
      consumptionCount: countMap.get(treat.id.value) ?? 0,
    }));
  }
}
