import { findBreeds, LIVESTOCK_BREEDS } from '../knowledge/breeds';
import { findDiseases, findDiseasesByUrgency, COMMON_DISEASES } from '../knowledge/diseases';
import { getForageSuggestions, getNutritionalRequirements, NUTRITIONAL_REQUIREMENTS } from '../knowledge/nutrition';

describe('Knowledge: breeds', () => {
  it('LIVESTOCK_BREEDS contains entries for multiple species', () => {
    const species = [...new Set(LIVESTOCK_BREEDS.map((b) => b.species))];
    expect(species).toContain('bovine');
    expect(species).toContain('ovine');
    expect(species).toContain('porcine');
    expect(species).toContain('caprine');
  });

  it('findBreeds returns all breeds when no filter is given', () => {
    expect(findBreeds()).toHaveLength(LIVESTOCK_BREEDS.length);
  });

  it('findBreeds filters by species', () => {
    const bovines = findBreeds('bovine');
    expect(bovines.length).toBeGreaterThan(0);
    expect(bovines.every((b) => b.species === 'bovine')).toBe(true);
  });

  it('findBreeds filters by aptitude', () => {
    const milkBreeds = findBreeds(undefined, 'milk');
    expect(milkBreeds.length).toBeGreaterThan(0);
    expect(milkBreeds.every((b) => b.aptitude.includes('milk'))).toBe(true);
  });

  it('findBreeds filters by both species and aptitude', () => {
    const results = findBreeds('bovine', 'meat');
    expect(results.every((b) => b.species === 'bovine' && b.aptitude.includes('meat'))).toBe(true);
  });
});

describe('Knowledge: diseases', () => {
  it('COMMON_DISEASES is non-empty', () => {
    expect(COMMON_DISEASES.length).toBeGreaterThan(0);
  });

  it('findDiseases returns all diseases when no filter is given', () => {
    expect(findDiseases()).toHaveLength(COMMON_DISEASES.length);
  });

  it('findDiseases filters by species', () => {
    const bovine = findDiseases('bovine');
    expect(bovine.every((d) => d.species.includes('bovine'))).toBe(true);
  });

  it('findDiseases filters by type', () => {
    const viral = findDiseases(undefined, 'viral');
    expect(viral.every((d) => d.type === 'viral')).toBe(true);
  });

  it('findDiseasesByUrgency filters correctly', () => {
    const emergencies = findDiseasesByUrgency('emergency');
    expect(emergencies.length).toBeGreaterThan(0);
    expect(emergencies.every((d) => d.urgency === 'emergency')).toBe(true);
  });

  it('zoonosis flag is set correctly on known diseases', () => {
    const brucellosis = COMMON_DISEASES.find((d) => d.name === 'Brucelosis');
    expect(brucellosis?.zoonosis).toBe(true);
  });
});

describe('Knowledge: nutrition', () => {
  it('NUTRITIONAL_REQUIREMENTS covers bovine, ovine, and porcine', () => {
    const species = [...new Set(NUTRITIONAL_REQUIREMENTS.map((r) => r.species))];
    expect(species).toContain('bovine');
    expect(species).toContain('ovine');
    expect(species).toContain('porcine');
  });

  it('getNutritionalRequirements filters by species', () => {
    const bovine = getNutritionalRequirements('bovine');
    expect(bovine.every((r) => r.species === 'bovine')).toBe(true);
  });

  it('getNutritionalRequirements returns all when no species given', () => {
    expect(getNutritionalRequirements()).toHaveLength(NUTRITIONAL_REQUIREMENTS.length);
  });

  it('getForageSuggestions filters by climate', () => {
    const tropical = getForageSuggestions('tropical');
    expect(tropical.length).toBeGreaterThan(0);
    expect(tropical.every((f) => f.climate.includes('tropical'))).toBe(true);
  });

  it('getForageSuggestions returns empty array for unknown climate', () => {
    expect(getForageSuggestions('arctic')).toHaveLength(0);
  });
});
