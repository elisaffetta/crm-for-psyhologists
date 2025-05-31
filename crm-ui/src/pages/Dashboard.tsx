import { useEffect, useState } from 'react';
import { useData } from '../context/DataContext';
import { Link } from 'react-router-dom';
import { FiUser, FiCalendar, FiFileText, FiTrendingUp } from 'react-icons/fi';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

const Dashboard = () => {
  const { clients, getUpcomingSessions, analytics } = useData();
  const [upcomingSessions, setUpcomingSessions] = useState([]);
  
  useEffect(() => {
    // Получаем ближайшие сессии
    const sessions = getUpcomingSessions().slice(0, 3);
    setUpcomingSessions(sessions);
  }, [getUpcomingSessions]);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-semibold mb-6">Панель управления</h1>
      
      {/* Статистика */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <div className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Клиенты</p>
                <p className="text-2xl font-semibold">{analytics?.summary?.totalClients || 0}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <FiUser className="text-blue-500" size={20} />
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              {analytics?.summary?.activeClients || 0} активных клиентов
            </p>
          </div>
        </Card>
        
        <Card>
          <div className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Сессии</p>
                <p className="text-2xl font-semibold">{analytics?.summary?.totalSessions || 0}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <FiCalendar className="text-green-500" size={20} />
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              {analytics?.summary?.scheduledSessions || 0} запланированных сессий
            </p>
          </div>
        </Card>
        
        <Card>
          <div className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Программы</p>
                <p className="text-2xl font-semibold">{analytics?.programEffectiveness?.length || 0}</p>
              </div>
              <div className="bg-purple-100 p-3 rounded-full">
                <FiFileText className="text-purple-500" size={20} />
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Средняя эффективность: {Math.round(analytics?.summary?.averageClientProgress || 0)}%
            </p>
          </div>
        </Card>
        
        <Card>
          <div className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Удержание</p>
                <p className="text-2xl font-semibold">{analytics?.summary?.clientRetentionRate || 0}%</p>
              </div>
              <div className="bg-amber-100 p-3 rounded-full">
                <FiTrendingUp className="text-amber-500" size={20} />
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              {analytics?.summary?.averageSessionsPerClient || 0} сессий на клиента
            </p>
          </div>
        </Card>
      </div>
      
      {/* Ближайшие сессии */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Ближайшие сессии</h2>
          <Link to="/calendar">
            <Button variant="text" size="sm">Все сессии</Button>
          </Link>
        </div>
        
        <div className="space-y-3">
          {upcomingSessions.length > 0 ? (
            upcomingSessions.map((session) => {
              const client = clients.find(c => c.id === session.clientId);
              return (
                <Card key={session.id}>
                  <div className="p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-semibold">{session.title}</p>
                        <p className="text-sm text-gray-500">
                          {client ? `${client.firstName} ${client.lastName}` : 'Клиент не найден'}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm">
                          {new Date(session.start).toLocaleDateString('ru-RU', { 
                            day: 'numeric', 
                            month: 'short' 
                          })}
                        </p>
                        <p className="text-sm text-gray-500">
                          {new Date(session.start).toLocaleTimeString('ru-RU', { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })
          ) : (
            <p className="text-gray-500 text-center py-4">Нет запланированных сессий</p>
          )}
        </div>
      </div>
      
      {/* AI Аномалии */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">AI Рекомендации</h2>
          <Link to="/analytics">
            <Button variant="text" size="sm">Аналитика</Button>
          </Link>
        </div>
        
        <div className="space-y-3">
          {analytics?.aiDetectedAnomalies?.length > 0 ? (
            analytics.aiDetectedAnomalies.map((anomaly) => (
              <Card key={anomaly.clientId}>
                <div className="p-4">
                  <div className="flex items-start gap-4">
                    <div className="bg-red-100 p-2 rounded-full mt-1">
                      <FiUser className="text-red-500" size={16} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-semibold">{anomaly.name}</p>
                        <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full">
                          {anomaly.anomalyType}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{anomaly.description}</p>
                      <p className="text-xs text-gray-500 mt-2">
                        Обнаружено: {new Date(anomaly.detectedAt).toLocaleDateString('ru-RU')}
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            ))
          ) : (
            <p className="text-gray-500 text-center py-4">Нет обнаруженных аномалий</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
