import { HealthMonitor } from '../modules/HealthMonitor';
import { CreateHealthRecordDto } from '../modules/HealthMonitor';

const BASE_DTO: CreateHealthRecordDto = {
  animalId: 'animal-1',
  date: new Date('2024-06-01'),
  type: 'vaccination',
  description: 'Vacuna antiaftosa',
  veterinarian: 'Dr. García',
  medications: ['Aftovax'],
  nextCheckup: new Date('2024-12-01'),
};

describe('HealthMonitor', () => {
  let monitor: HealthMonitor;

  beforeEach(() => {
    monitor = new HealthMonitor();
  });

  describe('addRecord', () => {
    it('creates a health record with generated ID', () => {
      const record = monitor.addRecord(BASE_DTO);
      expect(record.id).toBeDefined();
      expect(record.animalId).toBe('animal-1');
      expect(record.type).toBe('vaccination');
      expect(record.description).toBe('Vacuna antiaftosa');
      expect(record.veterinarian).toBe('Dr. García');
      expect(record.medications).toEqual(['Aftovax']);
    });

    it('increments the count', () => {
      expect(monitor.count()).toBe(0);
      monitor.addRecord(BASE_DTO);
      expect(monitor.count()).toBe(1);
    });
  });

  describe('findByAnimal', () => {
    it('returns records for the specified animal', () => {
      monitor.addRecord(BASE_DTO);
      monitor.addRecord({ ...BASE_DTO, animalId: 'animal-2', description: 'Otra vacuna' });
      const records = monitor.findByAnimal('animal-1');
      expect(records).toHaveLength(1);
      expect(records[0].animalId).toBe('animal-1');
    });

    it('returns empty array when animal has no records', () => {
      expect(monitor.findByAnimal('unknown-animal')).toEqual([]);
    });

    it('sorts records by date descending', () => {
      monitor.addRecord({ ...BASE_DTO, date: new Date('2024-01-01') });
      monitor.addRecord({ ...BASE_DTO, date: new Date('2024-06-01') });
      const records = monitor.findByAnimal('animal-1');
      expect(records[0].date.getTime()).toBeGreaterThan(records[1].date.getTime());
    });
  });

  describe('findByType', () => {
    it('filters records by type', () => {
      monitor.addRecord(BASE_DTO); // vaccination
      monitor.addRecord({ ...BASE_DTO, type: 'treatment', description: 'Tratamiento mastitis' });
      const vaccinations = monitor.findByType('vaccination');
      expect(vaccinations).toHaveLength(1);
      expect(vaccinations[0].type).toBe('vaccination');
    });
  });

  describe('getUpcomingCheckups', () => {
    it('returns records with nextCheckup on or before the given date', () => {
      monitor.addRecord(BASE_DTO); // nextCheckup: 2024-12-01
      monitor.addRecord({ ...BASE_DTO, nextCheckup: new Date('2025-06-01') });
      const upcoming = monitor.getUpcomingCheckups(new Date('2024-12-31'));
      expect(upcoming).toHaveLength(1);
      expect(upcoming[0].nextCheckup).toEqual(new Date('2024-12-01'));
    });

    it('returns empty array when no checkups are due', () => {
      monitor.addRecord(BASE_DTO); // nextCheckup: 2024-12-01
      const upcoming = monitor.getUpcomingCheckups(new Date('2024-01-01'));
      expect(upcoming).toHaveLength(0);
    });
  });

  describe('findById', () => {
    it('returns the record when found', () => {
      const record = monitor.addRecord(BASE_DTO);
      expect(monitor.findById(record.id)).toEqual(record);
    });

    it('returns undefined for unknown ID', () => {
      expect(monitor.findById('unknown')).toBeUndefined();
    });
  });

  describe('delete', () => {
    it('removes the record and returns true', () => {
      const record = monitor.addRecord(BASE_DTO);
      expect(monitor.delete(record.id)).toBe(true);
      expect(monitor.findById(record.id)).toBeUndefined();
    });

    it('returns false for unknown ID', () => {
      expect(monitor.delete('unknown')).toBe(false);
    });
  });
});
