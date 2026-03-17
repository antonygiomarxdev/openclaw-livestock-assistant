import { v4 as uuidv4 } from 'uuid';
import { ReproductionRecord } from '../assistant/types';

export interface CreateReproductionRecordDto {
  animalId: string;
  date: Date;
  type: ReproductionRecord['type'];
  description: string;
  sire?: string;
  offspringCount?: number;
  observations?: string;
}

export class ReproductionTracker {
  private records: Map<string, ReproductionRecord>;

  constructor() {
    this.records = new Map();
  }

  /**
   * Adds a new reproduction event for an animal.
   */
  addRecord(dto: CreateReproductionRecordDto): ReproductionRecord {
    const id = uuidv4();
    const record: ReproductionRecord = {
      id,
      animalId: dto.animalId,
      date: dto.date,
      type: dto.type,
      description: dto.description,
      sire: dto.sire,
      offspringCount: dto.offspringCount,
      observations: dto.observations,
      createdAt: new Date(),
    };
    this.records.set(id, record);
    return record;
  }

  /**
   * Returns all reproduction records for a specific animal.
   */
  findByAnimal(animalId: string): ReproductionRecord[] {
    return Array.from(this.records.values())
      .filter((r) => r.animalId === animalId)
      .sort((a, b) => b.date.getTime() - a.date.getTime());
  }

  /**
   * Returns all records of a specific type (e.g., all births).
   */
  findByType(type: ReproductionRecord['type']): ReproductionRecord[] {
    return Array.from(this.records.values()).filter((r) => r.type === type);
  }

  /**
   * Returns total offspring count across all birth events.
   */
  getTotalOffspring(): number {
    return this.findByType('birth').reduce((sum, r) => sum + (r.offspringCount ?? 0), 0);
  }

  /**
   * Returns a single record by ID.
   */
  findById(id: string): ReproductionRecord | undefined {
    return this.records.get(id);
  }

  /**
   * Deletes a reproduction record by ID.
   */
  delete(id: string): boolean {
    return this.records.delete(id);
  }

  /**
   * Returns the total number of reproduction records stored.
   */
  count(): number {
    return this.records.size;
  }
}
