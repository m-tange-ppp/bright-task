export class DislikeLevel {
  private constructor(readonly value: number) {}

  static create(value: number): DislikeLevel {
    if (!Number.isInteger(value) || value < 1 || value > 5) {
      throw new Error(
        `DislikeLevel must be an integer between 1 and 5, got: ${value}`,
      );
    }
    return new DislikeLevel(value);
  }
}
