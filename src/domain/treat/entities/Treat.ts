import { CostPoints } from "../valueObjects/CostPoints";
import { TreatId } from "../valueObjects/TreatId";

export interface TreatProps {
  id: TreatId;
  title: string;
  description: string | null;
  costPoints: CostPoints;
  createdAt: string;
  updatedAt: string;
}

export class Treat {
  private _props: TreatProps;

  private constructor(props: TreatProps) {
    this._props = props;
  }

  static create(props: TreatProps): Treat {
    if (!props.title || props.title.trim().length === 0) {
      throw new Error("Treat title cannot be empty");
    }
    return new Treat(props);
  }

  get id(): TreatId {
    return this._props.id;
  }
  get title(): string {
    return this._props.title;
  }
  get description(): string | null {
    return this._props.description;
  }
  get costPoints(): CostPoints {
    return this._props.costPoints;
  }
  get createdAt(): string {
    return this._props.createdAt;
  }
  get updatedAt(): string {
    return this._props.updatedAt;
  }

  update(fields: {
    title: string;
    description: string | null;
    costPoints: CostPoints;
  }): Treat {
    if (!fields.title || fields.title.trim().length === 0) {
      throw new Error("Treat title cannot be empty");
    }
    return new Treat({
      ...this._props,
      ...fields,
      updatedAt: new Date().toISOString(),
    });
  }
}
