export class CostPoints {
  private constructor(readonly value: number) {}

  static create(value: number): CostPoints {
    if (!Number.isInteger(value) || value < 1) {
      throw new Error(`CostPoints must be a positive integer, got: ${value}`);
    }
    return new CostPoints(value);
  }
}
