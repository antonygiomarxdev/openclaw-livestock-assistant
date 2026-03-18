import { ReproductionTracker } from '../modules/ReproductionTracker';
import { CreateReproductionRecordDto } from '../modules/ReproductionTracker';

const BASE_DTO: CreateReproductionRecordDto = {
  animalId: 'animal-1',
  date: new Date('2024-04-10'),
  type: 'service',
  description: 'Inseminación artificial',
  sire: 'bull-42',
};

describe('ReproductionTracker', () => {
  let tracker: ReproductionTracker;

  beforeEach(() => {
    tracker = new ReproductionTracker();
  });

  describe('addRecord', () => {
    it('creates a reproduction record with generated ID', () => {
      const record = tracker.addRecord(BASE_DTO);
      expect(record.id).toBeDefined();
      expect(record.animalId).toBe('animal-1');
      expect(record.type).toBe('service');
      expect(record.sire).toBe('bull-42');
    });

    it('increments the count', () => {
      expect(tracker.count()).toBe(0);
      tracker.addRecord(BASE_DTO);
      expect(tracker.count()).toBe(1);
    });
  });

  describe('findByAnimal', () => {
    it('returns records for the specified animal sorted by date descending', () => {
      tracker.addRecord({ ...BASE_DTO, date: new Date('2024-01-01') });
      tracker.addRecord({ ...BASE_DTO, date: new Date('2024-06-01') });
      tracker.addRecord({ ...BASE_DTO, animalId: 'animal-2', date: new Date('2024-03-01') });

      const records = tracker.findByAnimal('animal-1');
      expect(records).toHaveLength(2);
      expect(records[0].date.getTime()).toBeGreaterThan(records[1].date.getTime());
    });

    it('returns empty array when animal has no records', () => {
      expect(tracker.findByAnimal('unknown')).toEqual([]);
    });
  });

  describe('findByType', () => {
    it('filters by type correctly', () => {
      tracker.addRecord(BASE_DTO); // service
      tracker.addRecord({ ...BASE_DTO, type: 'birth', offspringCount: 1, description: 'Parto normal' });
      const births = tracker.findByType('birth');
      expect(births).toHaveLength(1);
      expect(births[0].type).toBe('birth');
    });
  });

  describe('getTotalOffspring', () => {
    it('returns 0 when there are no birth events', () => {
      tracker.addRecord(BASE_DTO); // service, no birth
      expect(tracker.getTotalOffspring()).toBe(0);
    });

    it('sums offspring across all birth events', () => {
      tracker.addRecord({ ...BASE_DTO, type: 'birth', offspringCount: 2, description: 'Parto gemelar' });
      tracker.addRecord({ ...BASE_DTO, type: 'birth', offspringCount: 1, description: 'Parto simple' });
      tracker.addRecord(BASE_DTO); // service — should not count
      expect(tracker.getTotalOffspring()).toBe(3);
    });
  });

  describe('findById', () => {
    it('returns the record when found', () => {
      const record = tracker.addRecord(BASE_DTO);
      expect(tracker.findById(record.id)).toEqual(record);
    });

    it('returns undefined for unknown ID', () => {
      expect(tracker.findById('unknown')).toBeUndefined();
    });
  });

  describe('delete', () => {
    it('removes the record and returns true', () => {
      const record = tracker.addRecord(BASE_DTO);
      expect(tracker.delete(record.id)).toBe(true);
      expect(tracker.findById(record.id)).toBeUndefined();
    });

    it('returns false for unknown ID', () => {
      expect(tracker.delete('unknown')).toBe(false);
    });
  });
});
