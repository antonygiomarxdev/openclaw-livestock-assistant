export interface NutritionalRequirement {
  category: string;
  species: string;
  liveWeight: string;
  energyMcal: string;
  crudeProtein: string;
  calcium: string;
  phosphorus: string;
  notes: string;
}

export const NUTRITIONAL_REQUIREMENTS: NutritionalRequirement[] = [
  {
    category: 'Vaca lechera en producción',
    species: 'bovine',
    liveWeight: '500-600 kg',
    energyMcal: '14-18 Mcal ED/día',
    crudeProtein: '16-18% en MS',
    calcium: '0.6-0.8% en MS',
    phosphorus: '0.35-0.45% en MS',
    notes: 'Aumentar ración según litros de leche producidos. Suplementar selenio y vitamina E.',
  },
  {
    category: 'Vaca seca pre-parto',
    species: 'bovine',
    liveWeight: '550-700 kg',
    energyMcal: '12-14 Mcal ED/día',
    crudeProtein: '10-12% en MS',
    calcium: '0.4-0.5% en MS',
    phosphorus: '0.25-0.30% en MS',
    notes:
      'Evitar sobrealimentación energética. En las últimas 3 semanas aplicar dieta aniónica para prevenir hipocalcemia.',
  },
  {
    category: 'Ternero en crecimiento',
    species: 'bovine',
    liveWeight: '100-200 kg',
    energyMcal: '8-12 Mcal ED/día',
    crudeProtein: '14-16% en MS',
    calcium: '0.55-0.65% en MS',
    phosphorus: '0.30-0.40% en MS',
    notes: 'Acceso libre a agua limpia. Suplementar vitaminas A, D y E. Calostro en primeras 6 horas de vida.',
  },
  {
    category: 'Novillo en engorde',
    species: 'bovine',
    liveWeight: '250-450 kg',
    energyMcal: '12-16 Mcal ED/día',
    crudeProtein: '12-14% en MS',
    calcium: '0.45-0.55% en MS',
    phosphorus: '0.25-0.35% en MS',
    notes: 'Ganancia de peso esperada: 0.8-1.2 kg/día. Incrementar energía en la fase final.',
  },
  {
    category: 'Oveja gestante',
    species: 'ovine',
    liveWeight: '50-70 kg',
    energyMcal: '5-7 Mcal ED/día',
    crudeProtein: '12-14% en MS',
    calcium: '0.45-0.55% en MS',
    phosphorus: '0.25-0.35% en MS',
    notes:
      'En el último tercio de gestación aumentar 20-30% el aporte energético. Prevenir toxemia de la preñez.',
  },
  {
    category: 'Cerda lactante',
    species: 'porcine',
    liveWeight: '180-240 kg',
    energyMcal: '16-20 Mcal ED/día',
    crudeProtein: '17-18% en MS',
    calcium: '0.85-0.95% en MS',
    phosphorus: '0.55-0.65% en MS',
    notes: 'Alimentación ad libitum durante lactancia. Asegurar abundante agua fresca.',
  },
];

export interface ForageSuggestion {
  name: string;
  type: 'grass' | 'legume' | 'forage_crop' | 'forage_tree';
  climate: string[];
  yieldTon: string;
  nutritiveValue: string;
  notes: string;
}

export const TROPICAL_FORAGES: ForageSuggestion[] = [
  {
    name: 'Maralfalfa (Pennisetum sp.)',
    type: 'grass',
    climate: ['tropical', 'subtropical'],
    yieldTon: '150-300 ton MS/ha/año',
    nutritiveValue: 'PC 10-14%, FDN 55-65%',
    notes: 'Cortar cada 45-60 días. No pastorear directamente sin manejo. Ideal para corte y acarreo.',
  },
  {
    name: 'Brachiaria brizantha',
    type: 'grass',
    climate: ['tropical', 'savanna'],
    yieldTon: '10-15 ton MS/ha/año',
    nutritiveValue: 'PC 8-12%, FDN 65-75%',
    notes: 'Muy resistente a la sequía. Buena persistencia. Bajo costo de establecimiento.',
  },
  {
    name: 'Leucaena leucocephala',
    type: 'legume',
    climate: ['tropical', 'semiarid'],
    yieldTon: '8-15 ton MS/ha/año',
    nutritiveValue: 'PC 18-25%, alta degradabilidad',
    notes:
      'No superar el 30% de la dieta para evitar intoxicación por mimosina. Excelente complemento proteico.',
  },
  {
    name: 'Sorgo forrajero',
    type: 'forage_crop',
    climate: ['tropical', 'subtropical', 'semiarid'],
    yieldTon: '40-60 ton/ha de forraje verde',
    nutritiveValue: 'PC 8-12%, alta energía',
    notes: 'Ideal para ensilaje. Cuidado con ácido cianhídrico en rebrotes jóvenes después de heladas o estrés.',
  },
  {
    name: 'Morera (Morus alba)',
    type: 'forage_tree',
    climate: ['tropical', 'subtropical'],
    yieldTon: '15-30 ton MS/ha/año',
    nutritiveValue: 'PC 15-25%, alta digestibilidad',
    notes: 'Excelente banco de proteína. Se puede usar fresca o henificada. Alta palatabilidad.',
  },
];

/**
 * Returns forage suggestions filtered by climate.
 */
export function getForageSuggestions(climate: string): ForageSuggestion[] {
  return TROPICAL_FORAGES.filter((f) => f.climate.includes(climate.toLowerCase()));
}

/**
 * Returns nutritional requirements filtered by species.
 */
export function getNutritionalRequirements(species?: string): NutritionalRequirement[] {
  return NUTRITIONAL_REQUIREMENTS.filter((r) => (species ? r.species === species : true));
}
