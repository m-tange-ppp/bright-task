export interface TreatDto {
  id: string;
  title: string;
  description: string | null;
  costPoints: number;
  /** ごほうびを交換した累計回数 */
  consumptionCount: number;
  createdAt: string;
  updatedAt: string;
}
