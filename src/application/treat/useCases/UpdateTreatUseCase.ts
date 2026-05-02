import { ITreatRepository } from "../../../domain/treat/repositories/ITreatRepository";
import { CostPoints } from "../../../domain/treat/valueObjects/CostPoints";
import { TreatDto } from "../dto/TreatDto";
import { UpdateTreatDto } from "../dto/UpdateTreatDto";
import { toTreatDto } from "../dto/treatMapper";

export class UpdateTreatUseCase {
  constructor(private readonly repository: ITreatRepository) {}

  async execute(dto: UpdateTreatDto): Promise<TreatDto> {
    const treat = await this.repository.findById(dto.id);
    if (!treat) throw new Error(`Treat not found: ${dto.id}`);

    const updated = treat.update({
      title: dto.title,
      description: dto.description,
      costPoints: CostPoints.create(dto.costPoints),
    });
    await this.repository.save(updated);
    return { ...toTreatDto(updated), consumptionCount: 0 };
  }
}
