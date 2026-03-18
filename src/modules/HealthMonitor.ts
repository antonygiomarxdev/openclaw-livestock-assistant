import { v4 as uuidv4 } from 'uuid';
import { HealthRecord } from '../assistant/types';

export interface CreateHealthRecordDto {
  animalId: string;
  date: Date;
  type: HealthRecord['type'];
  description: string;
  veterinarian?: string;
  medications?: string[];
  nextCheckup?: Date;
}

export class HealthMonitor {
  private records: Map<string, HealthRecord>;

  constructor() {
    this.records = new Map();
  }

  /**
   * Adds a new health record for an animal.
   */
  addRecord(dto: CreateHealthRecordDto): HealthRecord {
    const id = uuidv4();
    const record: HealthRecord = {
      id,
      animalId: dto.animalId,
      date: dto.date,
      type: dto.type,
      description: dto.description,
      veterinarian: dto.veterinarian,
      medications: dto.medications,
      nextCheckup: dto.nextCheckup,
      createdAt: new Date(),
    };
    this.records.set(id, record);
    return record;
  }

  /**
   * Returns all health records for a specific animal.
   */
  findByAnimal(animalId: string): HealthRecord[] {
    return Array.from(this.records.values())
      .filter((r) => r.animalId === animalId)
      .sort((a, b) => b.date.getTime() - a.date.getTime());
  }

  /**
   * Returns all records of a specific type across all animals.
   */
  findByType(type: HealthRecord['type']): HealthRecord[] {
    return Array.from(this.records.values()).filter((r) => r.type === type);
  }

  /**
   * Returns upcoming checkups due on or before the given date.
   */
  getUpcomingCheckups(before: Date): HealthRecord[] {
    return Array.from(this.records.values())
      .filter((r) => r.nextCheckup && r.nextCheckup <= before)
      .sort((a, b) => (a.nextCheckup!.getTime() - b.nextCheckup!.getTime()));
  }

  /**
   * Returns a single health record by ID.
   */
  findById(id: string): HealthRecord | undefined {
    return this.records.get(id);
  }

  /**
   * Deletes a health record by ID.
   */
  delete(id: string): boolean {
    return this.records.delete(id);
  }

  /**
   * Returns the total number of health records stored.
   */
  count(): number {
    return this.records.size;
  }
}
