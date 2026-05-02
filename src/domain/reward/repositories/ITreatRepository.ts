import { Treat } from "../entities/Treat";

export interface ITreatRepository {
  findById(id: string): Promise<Treat | null>;
  findAll(): Promise<Treat[]>;
  save(treat: Treat): Promise<void>;
  delete(id: string): Promise<void>;
}
