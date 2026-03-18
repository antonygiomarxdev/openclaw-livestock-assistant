export interface Breed {
  name: string;
  species: string;
  origin: string;
  aptitude: string[];
  characteristics: string;
  averageOffspringWeight: string;
  averageAdultWeight: string;
}

export const LIVESTOCK_BREEDS: Breed[] = [
  {
    name: 'Holstein Friesian',
    species: 'bovine',
    origin: 'Países Bajos',
    aptitude: ['milk'],
    characteristics: 'Mayor productora lechera mundial. Blanca y negra, cuerpo anguloso.',
    averageOffspringWeight: '40-50 kg',
    averageAdultWeight: '680-770 kg (vacas)',
  },
  {
    name: 'Angus',
    species: 'bovine',
    origin: 'Escocia',
    aptitude: ['meat'],
    characteristics: 'Completamente negra, sin cuernos. Excelente calidad de carne con marmoleo.',
    averageOffspringWeight: '30-40 kg',
    averageAdultWeight: '550-700 kg',
  },
  {
    name: 'Hereford',
    species: 'bovine',
    origin: 'Inglaterra',
    aptitude: ['meat'],
    characteristics: 'Cuerpo rojo con cara blanca. Rústico, adaptable a diferentes climas.',
    averageOffspringWeight: '35-45 kg',
    averageAdultWeight: '550-700 kg',
  },
  {
    name: 'Simmental',
    species: 'bovine',
    origin: 'Suiza',
    aptitude: ['meat', 'milk'],
    characteristics: 'Doble propósito. Color rojo y blanco. Muy productiva.',
    averageOffspringWeight: '40-50 kg',
    averageAdultWeight: '600-800 kg',
  },
  {
    name: 'Brahman',
    species: 'bovine',
    origin: 'India / EE.UU.',
    aptitude: ['meat'],
    characteristics: 'Joroba dorsal, orejas caídas. Alta resistencia al calor y garrapatas.',
    averageOffspringWeight: '30-40 kg',
    averageAdultWeight: '600-900 kg',
  },
  {
    name: 'Criollo Lechero Tropical',
    species: 'bovine',
    origin: 'América Latina',
    aptitude: ['milk'],
    characteristics: 'Adaptado al trópico. Resistente a parásitos y enfermedades locales.',
    averageOffspringWeight: '25-35 kg',
    averageAdultWeight: '350-500 kg (vacas)',
  },
  {
    name: 'Dorper',
    species: 'ovine',
    origin: 'Sudáfrica',
    aptitude: ['meat'],
    characteristics: 'Alta ganancia de peso. Cabeza negra, cuerpo blanco. Muy prolífico.',
    averageOffspringWeight: '3-5 kg',
    averageAdultWeight: '70-120 kg',
  },
  {
    name: 'Merino',
    species: 'ovine',
    origin: 'España',
    aptitude: ['wool', 'meat'],
    characteristics: 'Famoso por su lana fina. Adaptable a zonas áridas.',
    averageOffspringWeight: '3-4 kg',
    averageAdultWeight: '55-90 kg',
  },
  {
    name: 'Landrace',
    species: 'porcine',
    origin: 'Dinamarca',
    aptitude: ['meat'],
    characteristics: 'Cuerpo largo, orejas caídas. Excelente producción de carne magra.',
    averageOffspringWeight: '1.4-1.8 kg',
    averageAdultWeight: '250-350 kg',
  },
  {
    name: 'Nubian',
    species: 'caprine',
    origin: 'África / Gran Bretaña',
    aptitude: ['milk', 'meat'],
    characteristics: 'Nariz romana, orejas largas colgantes. Alta producción lechera con grasa elevada.',
    averageOffspringWeight: '3-4 kg',
    averageAdultWeight: '60-80 kg (cabras)',
  },
];

/**
 * Finds breeds filtered by species and/or aptitude.
 */
export function findBreeds(species?: string, aptitude?: string): Breed[] {
  return LIVESTOCK_BREEDS.filter((b) => {
    const matchesSpecies = species ? b.species === species : true;
    const matchesAptitude = aptitude ? b.aptitude.includes(aptitude) : true;
    return matchesSpecies && matchesAptitude;
  });
}
