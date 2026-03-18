export interface Disease {
  name: string;
  species: string[];
  type: 'bacterial' | 'viral' | 'parasitic' | 'fungal' | 'nutritional' | 'metabolic';
  symptoms: string[];
  prevention: string[];
  treatment: string;
  urgency: 'low' | 'medium' | 'high' | 'emergency';
  zoonosis: boolean;
}

export const COMMON_DISEASES: Disease[] = [
  {
    name: 'Fiebre Aftosa',
    species: ['bovine', 'ovine', 'caprine', 'porcine'],
    type: 'viral',
    symptoms: [
      'Fiebre alta',
      'Vesículas en boca y patas',
      'Salivación excesiva',
      'Cojera',
      'Disminución de producción láctea',
    ],
    prevention: ['Vacunación regular', 'Control de movimiento de animales', 'Cuarentena de animales nuevos'],
    treatment: 'No existe tratamiento específico. Cuidados de soporte. Notificación obligatoria.',
    urgency: 'emergency',
    zoonosis: false,
  },
  {
    name: 'Brucelosis',
    species: ['bovine', 'ovine', 'caprine', 'porcine'],
    type: 'bacterial',
    symptoms: ['Abortos en el último tercio de gestación', 'Retención de placenta', 'Infertilidad', 'Artritis'],
    prevention: ['Vacunación (cepa RB51 o cepa 19)', 'Pruebas serológicas periódicas', 'Cuarentena de recién llegados'],
    treatment: 'Antibióticos en casos específicos. Generalmente se elimina el animal positivo.',
    urgency: 'high',
    zoonosis: true,
  },
  {
    name: 'Mastitis',
    species: ['bovine', 'ovine', 'caprine'],
    type: 'bacterial',
    symptoms: [
      'Inflamación de la ubre',
      'Dolor a la palpación',
      'Leche con grumos o sangre',
      'Reducción de producción láctea',
      'Fiebre (casos agudos)',
    ],
    prevention: [
      'Buenas prácticas de ordeño',
      'Sellado de pezones post-ordeño',
      'Secado con antibiótico',
      'Higiene de instalaciones',
    ],
    treatment: 'Antibióticos intramamarios y/o sistémicos. Consultar veterinario.',
    urgency: 'medium',
    zoonosis: false,
  },
  {
    name: 'Neumonía Bovina',
    species: ['bovine'],
    type: 'bacterial',
    symptoms: ['Fiebre alta (>40°C)', 'Descarga nasal', 'Tos', 'Disnea', 'Depresión', 'Anorexia'],
    prevention: ['Vacunación contra IBR, BVD, BRSV', 'Ventilación adecuada', 'Reducir estrés en el transporte'],
    treatment: 'Antibióticos de amplio espectro. Anti-inflamatorios. Iniciar tratamiento rápidamente.',
    urgency: 'high',
    zoonosis: false,
  },
  {
    name: 'Garrapatas (Rhipicephalus microplus)',
    species: ['bovine', 'equine'],
    type: 'parasitic',
    symptoms: ['Pérdida de peso', 'Anemia', 'Disminución productiva', 'Transmisión de babesiosis y anaplasmosis'],
    prevention: [
      'Baños garrapaticidas programados',
      'Pastura limpia',
      'Uso de razas resistentes (Brahman)',
      'Rotación de potreros',
    ],
    treatment: 'Acaricidas (amitraz, organofosforados, ivermectinas). Rotar principios activos.',
    urgency: 'medium',
    zoonosis: false,
  },
  {
    name: 'Diarrea Neonatal (Colicabacilosis)',
    species: ['bovine', 'ovine', 'caprine', 'porcine'],
    type: 'bacterial',
    symptoms: ['Diarrea acuosa', 'Deshidratación', 'Debilidad', 'Pérdida de peso rápida'],
    prevention: ['Calostro abundante en las primeras 6 horas', 'Higiene en el área de parición', 'Vacunación de madres'],
    treatment: 'Rehidratación oral o IV. Antibióticos si hay septicemia. Atención veterinaria urgente en neonatos.',
    urgency: 'high',
    zoonosis: false,
  },
  {
    name: 'Hipocalcemia (Fiebre de Leche)',
    species: ['bovine', 'ovine', 'caprine'],
    type: 'metabolic',
    symptoms: ['Incapacidad para levantarse', 'Pérdida de conciencia', 'Temperatura corporal baja', 'Músculos flácidos'],
    prevention: [
      'Dietas aniónicas pre-parto',
      'Suplementación de calcio en transición',
      'Evitar vacas obesas al parto',
    ],
    treatment: 'Gluconato de calcio IV. Respuesta rápida. Consultar veterinario.',
    urgency: 'emergency',
    zoonosis: false,
  },
];

/**
 * Finds diseases filtered by species and/or type.
 */
export function findDiseases(species?: string, type?: string): Disease[] {
  return COMMON_DISEASES.filter((d) => {
    const matchesSpecies = species ? d.species.includes(species) : true;
    const matchesType = type ? d.type === type : true;
    return matchesSpecies && matchesType;
  });
}

/**
 * Finds diseases filtered by urgency level.
 */
export function findDiseasesByUrgency(urgency: Disease['urgency']): Disease[] {
  return COMMON_DISEASES.filter((d) => d.urgency === urgency);
}
