export class Importance {
  private constructor(readonly value: number) {}

  static create(value: number): Importance {
    if (!Number.isInteger(value) || value < 1 || value > 5) {
      throw new Error(
        `Importance must be an integer between 1 and 5, got: ${value}`,
      );
    }
    return new Importance(value);
  }
}
