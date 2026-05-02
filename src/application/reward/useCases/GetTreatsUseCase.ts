import { ITreatRepository } from "../../../domain/reward/repositories/ITreatRepository";
import { TreatDto } from "../dto/TreatDto";
import { toTreatDto } from "../dto/treatMapper";

export class GetTreatsUseCase {
  constructor(private readonly repository: ITreatRepository) {}

  async execute(): Promise<TreatDto[]> {
    const treats = await this.repository.findAll();
    return treats.map(toTreatDto);
  }
}
