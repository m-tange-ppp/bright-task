import * as Crypto from "expo-crypto";
import { Treat } from "../../../domain/treat/entities/Treat";
import { ITreatRepository } from "../../../domain/treat/repositories/ITreatRepository";
import { CostPoints } from "../../../domain/treat/valueObjects/CostPoints";
import { TreatId } from "../../../domain/treat/valueObjects/TreatId";
import { CreateTreatDto } from "../dto/CreateTreatDto";
import { TreatDto } from "../dto/TreatDto";
import { toTreatDto } from "../dto/treatMapper";

export class CreateTreatUseCase {
  constructor(private readonly repository: ITreatRepository) {}

  async execute(dto: CreateTreatDto): Promise<TreatDto> {
    const now = new Date().toISOString();
    const treat = Treat.create({
      id: TreatId.create(Crypto.randomUUID()),
      title: dto.title,
      description: dto.description,
      costPoints: CostPoints.create(dto.costPoints),
      createdAt: now,
      updatedAt: now,
    });
    await this.repository.save(treat);
    return { ...toTreatDto(treat), consumptionCount: 0 };
  }
}
