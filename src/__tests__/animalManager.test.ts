import { AnimalManager } from '../modules/AnimalManager';
import { CreateAnimalDto } from '../modules/AnimalManager';

const BASE_DTO: CreateAnimalDto = {
  name: 'Lola',
  species: 'bovine',
  breed: 'Holstein Friesian',
  sex: 'female',
  birthDate: new Date('2022-03-15'),
  weight: 420,
};

describe('AnimalManager', () => {
  let manager: AnimalManager;

  beforeEach(() => {
    manager = new AnimalManager();
  });

  describe('create', () => {
    it('creates an animal with the provided fields', () => {
      const animal = manager.create(BASE_DTO);
      expect(animal.id).toBeDefined();
      expect(animal.name).toBe('Lola');
      expect(animal.species).toBe('bovine');
      expect(animal.breed).toBe('Holstein Friesian');
      expect(animal.sex).toBe('female');
      expect(animal.weight).toBe(420);
      expect(animal.status).toBe('active');
      expect(animal.healthStatus).toBe('healthy');
    });

    it('sets reproductiveStatus to "open" for females', () => {
      const animal = manager.create(BASE_DTO);
      expect(animal.reproductiveStatus).toBe('open');
    });

    it('sets reproductiveStatus to "not_applicable" for males', () => {
      const animal = manager.create({ ...BASE_DTO, name: 'Toro', sex: 'male' });
      expect(animal.reproductiveStatus).toBe('not_applicable');
    });

    it('increments the count', () => {
      expect(manager.count()).toBe(0);
      manager.create(BASE_DTO);
      expect(manager.count()).toBe(1);
    });
  });

  describe('findAll', () => {
    it('returns all animals when no filter is given', () => {
      manager.create(BASE_DTO);
      manager.create({ ...BASE_DTO, name: 'Bety', species: 'ovine', breed: 'Dorper' });
      expect(manager.findAll()).toHaveLength(2);
    });

    it('filters by species', () => {
      manager.create(BASE_DTO);
      manager.create({ ...BASE_DTO, name: 'Bety', species: 'ovine', breed: 'Dorper' });
      const bovines = manager.findAll('bovine');
      expect(bovines).toHaveLength(1);
      expect(bovines[0].species).toBe('bovine');
    });

    it('filters by status', () => {
      const a = manager.create(BASE_DTO);
      manager.create({ ...BASE_DTO, name: 'Bety' });
      manager.update(a.id, { status: 'sold' });
      expect(manager.findAll(undefined, 'active')).toHaveLength(1);
      expect(manager.findAll(undefined, 'sold')).toHaveLength(1);
    });
  });

  describe('findById', () => {
    it('returns the animal when found', () => {
      const animal = manager.create(BASE_DTO);
      expect(manager.findById(animal.id)).toEqual(animal);
    });

    it('returns undefined for unknown ID', () => {
      expect(manager.findById('unknown')).toBeUndefined();
    });
  });

  describe('update', () => {
    it('updates the specified fields', () => {
      const animal = manager.create(BASE_DTO);
      const updated = manager.update(animal.id, { weight: 480, status: 'quarantine' });
      expect(updated).toBeDefined();
      expect(updated!.weight).toBe(480);
      expect(updated!.status).toBe('quarantine');
      expect(updated!.name).toBe('Lola'); // unchanged
    });

    it('returns undefined for unknown ID', () => {
      expect(manager.update('unknown', { weight: 500 })).toBeUndefined();
    });
  });

  describe('delete', () => {
    it('removes the animal and returns true', () => {
      const animal = manager.create(BASE_DTO);
      expect(manager.delete(animal.id)).toBe(true);
      expect(manager.findById(animal.id)).toBeUndefined();
    });

    it('returns false for unknown ID', () => {
      expect(manager.delete('unknown')).toBe(false);
    });
  });

  describe('getStats', () => {
    it('returns zeroed stats for empty herd', () => {
      const stats = manager.getStats();
      expect(stats.total).toBe(0);
      expect(stats.bySex.males).toBe(0);
      expect(stats.bySex.females).toBe(0);
    });

    it('counts animals by species, sex, status, and health', () => {
      manager.create(BASE_DTO); // female bovine
      manager.create({ ...BASE_DTO, name: 'Toro', sex: 'male' }); // male bovine
      manager.create({ ...BASE_DTO, name: 'Oveja', species: 'ovine', breed: 'Dorper' }); // female ovine

      const stats = manager.getStats();
      expect(stats.total).toBe(3);
      expect(stats.bySpecies['bovine']).toBe(2);
      expect(stats.bySpecies['ovine']).toBe(1);
      expect(stats.bySex.males).toBe(1);
      expect(stats.bySex.females).toBe(2);
      expect(stats.byStatus['active']).toBe(3);
      expect(stats.byHealth['healthy']).toBe(3);
    });
  });
});
