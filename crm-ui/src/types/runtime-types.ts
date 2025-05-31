// Этот файл экспортирует типы для использования в runtime
// Импортируем типы из основного файла типов
import type {
  Client,
  Session,
  Program,
  ProgramStage,
  Material,
  Analytics,
  EmotionalStatePoint,
  AnalyticsSummary,
  ClientProgress,
  SessionsByMonth,
  TherapyTypeDistribution,
  ProgramEffectiveness,
  AIDetectedAnomaly
} from './index';

// Реэкспортируем типы для использования в runtime
export {
  type Client,
  type Session,
  type Program,
  type ProgramStage,
  type Material,
  type Analytics,
  type EmotionalStatePoint,
  type AnalyticsSummary,
  type ClientProgress,
  type SessionsByMonth,
  type TherapyTypeDistribution,
  type ProgramEffectiveness,
  type AIDetectedAnomaly
};
