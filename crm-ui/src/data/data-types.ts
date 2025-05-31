// Импортируем типы для типизации
import type { Client, Session, Program, Analytics } from '../types/runtime-types';

// Импортируем JSON данные напрямую
import clientsData from './clients.json';
import sessionsData from './sessions.json';
import programsData from './programs.json';
import analyticsData from './analytics.json';

// Экспортируем типизированные данные
export const typedClientsData = clientsData as unknown as Client[];
export const typedSessionsData = sessionsData as unknown as Session[];
export const typedProgramsData = programsData as unknown as Program[];
export const typedAnalyticsData = analyticsData as unknown as Analytics;
