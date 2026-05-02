export class PointHistoryId {
  private constructor(readonly value: string) {}

  static create(value: string): PointHistoryId {
    if (!value || value.trim().length === 0) {
      throw new Error("PointHistoryId cannot be empty");
    }
    return new PointHistoryId(value);
  }
}
