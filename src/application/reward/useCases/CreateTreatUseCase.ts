import * as Crypto from "expo-crypto";
import { Treat } from "../../../domain/reward/entities/Treat";
import { ITreatRepository } from "../../../domain/reward/repositories/ITreatRepository";
import { CostPoints } from "../../../domain/reward/valueObjects/CostPoints";
import { TreatId } from "../../../domain/reward/valueObjects/TreatId";
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
    return toTreatDto(treat);
  }
}
