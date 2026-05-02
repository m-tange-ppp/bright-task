export class TreatId {
  private constructor(readonly value: string) {}

  static create(value: string): TreatId {
    if (!value || value.trim().length === 0) {
      throw new Error("TreatId cannot be empty");
    }
    return new TreatId(value);
  }
}
