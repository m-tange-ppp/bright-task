import { Treat } from "../../../domain/reward/entities/Treat";
import { TreatDto } from "../dto/TreatDto";

export function toTreatDto(treat: Treat): TreatDto {
  return {
    id: treat.id.value,
    title: treat.title,
    description: treat.description,
    costPoints: treat.costPoints.value,
    createdAt: treat.createdAt,
    updatedAt: treat.updatedAt,
  };
}
