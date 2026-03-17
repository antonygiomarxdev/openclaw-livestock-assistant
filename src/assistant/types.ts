export type AnimalSpecies = 'bovine' | 'ovine' | 'caprine' | 'porcine' | 'equine' | 'poultry';
export type AnimalSex = 'male' | 'female';
export type AnimalStatus = 'active' | 'sold' | 'dead' | 'quarantine';
export type HealthStatus = 'healthy' | 'sick' | 'in_treatment' | 'recovered';
export type ReproductionStatus =
  | 'open'
  | 'pregnant'
  | 'lactating'
  | 'in_heat'
  | 'served'
  | 'not_applicable';

export interface Animal {
  id: string;
  name: string;
  species: AnimalSpecies;
  breed: string;
  sex: AnimalSex;
  birthDate: Date;
  weight: number;
  status: AnimalStatus;
  healthStatus: HealthStatus;
  reproductiveStatus: ReproductionStatus;
  mother?: string;
  father?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface HealthRecord {
  id: string;
  animalId: string;
  date: Date;
  type: 'vaccination' | 'treatment' | 'checkup' | 'diagnosis';
  description: string;
  veterinarian?: string;
  medications?: string[];
  nextCheckup?: Date;
  createdAt: Date;
}

export interface ReproductionRecord {
  id: string;
  animalId: string;
  date: Date;
  type: 'service' | 'pregnancy_confirmed' | 'birth' | 'abortion' | 'heat_detected';
  description: string;
  sire?: string;
  offspringCount?: number;
  observations?: string;
  createdAt: Date;
}

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface ChatSession {
  id: string;
  messages: ChatMessage[];
  createdAt: Date;
  updatedAt: Date;
}

export interface AssistantResponse {
  response: string;
  sessionId: string;
  tokens?: number;
}

export interface HerdStats {
  total: number;
  bySpecies: Record<string, number>;
  bySex: { males: number; females: number };
  byStatus: Record<string, number>;
  byHealth: Record<string, number>;
}
