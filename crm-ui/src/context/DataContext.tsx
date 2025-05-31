import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { Client, Session, Program, Analytics } from '../types/runtime-types';

// Импорт типизированных моковых данных
import { typedClientsData, typedSessionsData, typedProgramsData, typedAnalyticsData } from '../data/data-types';

interface DataContextType {
  clients: Client[];
  sessions: Session[];
  programs: Program[];
  analytics: Analytics;
  getClientById: (id: string) => Client | undefined;
  getSessionsByClientId: (clientId: string) => Session[];
  getUpcomingSessions: () => Session[];
  getCompletedSessions: () => Session[];
  updateClient: (client: Client) => void;
  updateSession: (session: Session) => void;
  addClient: (client: Client) => void;
  addSession: (session: Session) => void;
  deleteClient: (id: string) => void;
  deleteSession: (id: string) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider = ({ children }: { children: ReactNode }) => {
  const [clients, setClients] = useState<Client[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [analytics, setAnalytics] = useState<Analytics>({} as Analytics);

  // Загрузка моковых данных при инициализации
  useEffect(() => {
    setClients(typedClientsData);
    setSessions(typedSessionsData);
    setPrograms(typedProgramsData);
    setAnalytics(typedAnalyticsData);
  }, []);

  // Функции для работы с данными
  const getClientById = (id: string) => {
    return clients.find(client => client.id === id);
  };

  const getSessionsByClientId = (clientId: string) => {
    return sessions.filter(session => session.clientId === clientId);
  };

  const getUpcomingSessions = () => {
    const now = new Date();
    return sessions
      .filter(session => new Date(session.start) > now && session.status === 'scheduled')
      .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime());
  };

  const getCompletedSessions = () => {
    return sessions
      .filter(session => session.status === 'completed')
      .sort((a, b) => new Date(b.start).getTime() - new Date(a.start).getTime());
  };

  const updateClient = (updatedClient: Client) => {
    setClients(prevClients => 
      prevClients.map(client => 
        client.id === updatedClient.id ? updatedClient : client
      )
    );
  };

  const updateSession = (updatedSession: Session) => {
    setSessions(prevSessions => 
      prevSessions.map(session => 
        session.id === updatedSession.id ? updatedSession : session
      )
    );
  };

  const addClient = (newClient: Client) => {
    setClients(prevClients => [...prevClients, newClient]);
  };

  const addSession = (newSession: Session) => {
    setSessions(prevSessions => [...prevSessions, newSession]);
  };

  const deleteClient = (id: string) => {
    setClients(prevClients => prevClients.filter(client => client.id !== id));
    // Также удаляем все сеансы этого клиента
    setSessions(prevSessions => prevSessions.filter(session => session.clientId !== id));
  };

  const deleteSession = (id: string) => {
    setSessions(prevSessions => prevSessions.filter(session => session.id !== id));
  };

  return (
    <DataContext.Provider
      value={{
        clients,
        sessions,
        programs,
        analytics,
        getClientById,
        getSessionsByClientId,
        getUpcomingSessions,
        getCompletedSessions,
        updateClient,
        updateSession,
        addClient,
        addSession,
        deleteClient,
        deleteSession,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
