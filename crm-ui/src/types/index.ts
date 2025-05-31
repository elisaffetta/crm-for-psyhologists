// Типы для клиентов
export interface EmotionalStatePoint {
  date: string;
  value: number;
}

export interface Client {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  avatar: string;
  status: 'active' | 'completed' | 'paused';
  therapyType: string;
  startDate: string;
  nextSession: string | null;
  totalSessions: number;
  completedSessions: number;
  notes: string;
  emotionalState: EmotionalStatePoint[];
}

// Типы для сеансов
export interface Session {
  id: string;
  clientId: string;
  title: string;
  start: string;
  end: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  notes: string;
  homework: string;
}

// Типы для терапевтических программ
export interface Material {
  id: string;
  title: string;
  type: 'article' | 'video' | 'audio' | 'questionnaire' | 'worksheet';
  url: string;
}

export interface ProgramStage {
  id: string;
  title: string;
  description: string;
  duration: string;
  materials: Material[];
}

export interface Program {
  id: string;
  title: string;
  description: string;
  duration: string;
  therapyType: string;
  effectiveness: number;
  createdAt: string;
  stages: ProgramStage[];
}

// Типы для аналитики
export interface AnalyticsSummary {
  totalClients: number;
  activeClients: number;
  completedClients: number;
  pausedClients: number;
  totalSessions: number;
  completedSessions: number;
  scheduledSessions: number;
  averageSessionsPerClient: number;
  clientRetentionRate: number;
  averageClientProgress: number;
}

export interface ClientProgress {
  clientId: string;
  name: string;
  progress: number;
  emotionalState: EmotionalStatePoint[];
}

export interface SessionsByMonth {
  month: string;
  count: number;
}

export interface TherapyTypeDistribution {
  type: string;
  count: number;
  percentage: number;
}

export interface ProgramEffectiveness {
  programId: string;
  name: string;
  effectiveness: number;
}

export interface AIDetectedAnomaly {
  clientId: string;
  name: string;
  anomalyType: string;
  description: string;
  detectedAt: string;
}

export interface Analytics {
  summary: AnalyticsSummary;
  clientProgress: ClientProgress[];
  sessionsByMonth: SessionsByMonth[];
  therapyTypeDistribution: TherapyTypeDistribution[];
  programEffectiveness: ProgramEffectiveness[];
  aiDetectedAnomalies: AIDetectedAnomaly[];
}
