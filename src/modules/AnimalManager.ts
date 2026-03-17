import { v4 as uuidv4 } from 'uuid';
import { Animal, AnimalSpecies, AnimalSex, AnimalStatus, HealthStatus, ReproductionStatus, HerdStats } from '../assistant/types';

export interface CreateAnimalDto {
  name: string;
  species: AnimalSpecies;
  breed: string;
  sex: AnimalSex;
  birthDate: Date;
  weight: number;
  mother?: string;
  father?: string;
  notes?: string;
}

export interface UpdateAnimalDto {
  name?: string;
  breed?: string;
  weight?: number;
  status?: AnimalStatus;
  healthStatus?: HealthStatus;
  reproductiveStatus?: ReproductionStatus;
  notes?: string;
}

export class AnimalManager {
  private animals: Map<string, Animal>;

  constructor() {
    this.animals = new Map();
  }

  /**
   * Registers a new animal in the herd.
   */
  create(dto: CreateAnimalDto): Animal {
    const id = uuidv4();
    const now = new Date();
    const animal: Animal = {
      id,
      name: dto.name,
      species: dto.species,
      breed: dto.breed,
      sex: dto.sex,
      birthDate: dto.birthDate,
      weight: dto.weight,
      status: 'active',
      healthStatus: 'healthy',
      reproductiveStatus: dto.sex === 'male' ? 'not_applicable' : 'open',
      mother: dto.mother,
      father: dto.father,
      notes: dto.notes,
      createdAt: now,
      updatedAt: now,
    };
    this.animals.set(id, animal);
    return animal;
  }

  /**
   * Returns all animals (optionally filtered by species or status).
   */
  findAll(species?: AnimalSpecies, status?: AnimalStatus): Animal[] {
    const all = Array.from(this.animals.values());
    return all.filter((a) => {
      const matchesSpecies = species ? a.species === species : true;
      const matchesStatus = status ? a.status === status : true;
      return matchesSpecies && matchesStatus;
    });
  }

  /**
   * Returns a single animal by ID, or undefined if not found.
   */
  findById(id: string): Animal | undefined {
    return this.animals.get(id);
  }

  /**
   * Updates an existing animal's data.
   */
  update(id: string, dto: UpdateAnimalDto): Animal | undefined {
    const animal = this.animals.get(id);
    if (!animal) return undefined;

    const updated: Animal = {
      ...animal,
      ...dto,
      updatedAt: new Date(),
    };
    this.animals.set(id, updated);
    return updated;
  }

  /**
   * Removes an animal from the herd registry.
   */
  delete(id: string): boolean {
    return this.animals.delete(id);
  }

  /**
   * Computes summary statistics for the herd.
   */
  getStats(): HerdStats {
    const all = Array.from(this.animals.values());
    const bySpecies: Record<string, number> = {};
    const byStatus: Record<string, number> = {};
    const byHealth: Record<string, number> = {};
    let males = 0;
    let females = 0;

    for (const animal of all) {
      bySpecies[animal.species] = (bySpecies[animal.species] ?? 0) + 1;
      byStatus[animal.status] = (byStatus[animal.status] ?? 0) + 1;
      byHealth[animal.healthStatus] = (byHealth[animal.healthStatus] ?? 0) + 1;
      if (animal.sex === 'male') males++;
      else females++;
    }

    return {
      total: all.length,
      bySpecies,
      bySex: { males, females },
      byStatus,
      byHealth,
    };
  }

  /**
   * Returns the total number of animals in the registry.
   */
  count(): number {
    return this.animals.size;
  }
}
