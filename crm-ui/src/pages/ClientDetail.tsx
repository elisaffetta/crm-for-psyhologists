import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { FiMail, FiPhone, FiCalendar, FiEdit2, FiArrowLeft, FiActivity } from 'react-icons/fi';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Регистрируем компоненты Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const ClientDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getClientById, getSessionsByClientId } = useData();
  const [client, setClient] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [emotionalChartData, setEmotionalChartData] = useState(null);

  useEffect(() => {
    if (id) {
      const clientData = getClientById(id);
      if (clientData) {
        setClient(clientData);
        
        // Получаем сессии клиента
        const clientSessions = getSessionsByClientId(id);
        setSessions(clientSessions);
        
        // Подготавливаем данные для графика эмоционального состояния
        if (clientData.emotionalState && clientData.emotionalState.length > 0) {
          const chartData = {
            labels: clientData.emotionalState.map(point => 
              new Date(point.date).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })
            ),
            datasets: [
              {
                label: 'Эмоциональное состояние',
                data: clientData.emotionalState.map(point => point.value),
                borderColor: 'rgb(79, 70, 229)',
                backgroundColor: 'rgba(79, 70, 229, 0.5)',
                tension: 0.3,
              },
            ],
          };
          setEmotionalChartData(chartData);
        }
      } else {
        // Если клиент не найден, перенаправляем на страницу со списком клиентов
        navigate('/clients');
      }
    }
  }, [id, getClientById, getSessionsByClientId, navigate]);

  if (!client) {
    return (
      <div className="p-4 flex justify-center items-center h-full">
        <p>Загрузка...</p>
      </div>
    );
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      case 'paused':
        return 'bg-amber-100 text-amber-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'active':
        return 'Активен';
      case 'completed':
        return 'Завершен';
      case 'paused':
        return 'Приостановлен';
      default:
        return status;
    }
  };

  const getSessionStatusColor = (status) => {
    switch (status) {
      case 'scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getSessionStatusText = (status) => {
    switch (status) {
      case 'scheduled':
        return 'Запланирована';
      case 'completed':
        return 'Завершена';
      case 'cancelled':
        return 'Отменена';
      default:
        return status;
    }
  };

  return (
    <div className="p-4">
      {/* Верхняя панель с навигацией */}
      <div className="flex items-center mb-6">
        <Button 
          variant="text" 
          size="sm" 
          icon={<FiArrowLeft />} 
          onClick={() => navigate('/clients')}
        >
          Назад к списку
        </Button>
      </div>
      
      {/* Профиль клиента */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-1">
          <Card>
            <div className="p-5">
              <div className="flex flex-col items-center">
                <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-200 mb-4">
                  {client.avatar ? (
                    <img 
                      src={client.avatar} 
                      alt={`${client.firstName} ${client.lastName}`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-blue-100 text-blue-600 text-xl font-semibold">
                      {client.firstName[0]}{client.lastName[0]}
                    </div>
                  )}
                </div>
                
                <h1 className="text-xl font-semibold text-center">
                  {client.firstName} {client.lastName}
                </h1>
                
                <span className={`mt-2 text-xs px-2 py-1 rounded-full ${getStatusColor(client.status)}`}>
                  {getStatusText(client.status)}
                </span>
                
                <div className="w-full mt-6 space-y-3">
                  <div className="flex items-center">
                    <FiMail className="text-gray-400 mr-3" />
                    <span className="text-sm">{client.email}</span>
                  </div>
                  
                  <div className="flex items-center">
                    <FiPhone className="text-gray-400 mr-3" />
                    <span className="text-sm">{client.phone}</span>
                  </div>
                  
                  <div className="flex items-center">
                    <FiCalendar className="text-gray-400 mr-3" />
                    <span className="text-sm">
                      С {new Date(client.startDate).toLocaleDateString('ru-RU')}
                    </span>
                  </div>
                </div>
                
                <div className="mt-6 w-full">
                  <Button 
                    variant="primary" 
                    size="md" 
                    icon={<FiEdit2 />}
                    className="w-full"
                  >
                    Редактировать профиль
                  </Button>
                </div>
              </div>
            </div>
          </Card>
          
          <Card className="mt-4">
            <div className="p-5">
              <h2 className="text-lg font-semibold mb-3">Информация о терапии</h2>
              
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500">Тип терапии</p>
                  <p className="font-medium">{client.therapyType}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">Прогресс сессий</p>
                  <div className="flex items-center">
                    <div className="flex-1 bg-gray-200 rounded-full h-2 mr-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full" 
                        style={{ width: `${(client.completedSessions / client.totalSessions) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium">
                      {client.completedSessions}/{client.totalSessions}
                    </span>
                  </div>
                </div>
                
                {client.nextSession && (
                  <div>
                    <p className="text-sm text-gray-500">Следующая сессия</p>
                    <p className="font-medium">
                      {new Date(client.nextSession).toLocaleDateString('ru-RU', {
                        day: 'numeric',
                        month: 'long',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </Card>
        </div>
        
        <div className="lg:col-span-2">
          {/* Эмоциональное состояние */}
          <Card className="mb-6">
            <div className="p-5">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Эмоциональное состояние</h2>
                <div className="flex items-center">
                  <FiActivity className="text-gray-400 mr-1" />
                  <span className="text-sm text-gray-500">Динамика</span>
                </div>
              </div>
              
              {emotionalChartData ? (
                <div className="h-64">
                  <Line 
                    data={emotionalChartData} 
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      scales: {
                        y: {
                          min: 0,
                          max: 10,
                          ticks: {
                            stepSize: 1
                          }
                        }
                      },
                      plugins: {
                        legend: {
                          display: false
                        },
                        tooltip: {
                          callbacks: {
                            title: (items) => {
                              if (!items.length) return '';
                              const index = items[0].dataIndex;
                              return client.emotionalState[index].date;
                            }
                          }
                        }
                      }
                    }}
                  />
                </div>
              ) : (
                <p className="text-center text-gray-500 py-8">Нет данных об эмоциональном состоянии</p>
              )}
            </div>
          </Card>
          
          {/* Заметки */}
          <Card className="mb-6">
            <div className="p-5">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Заметки</h2>
                <Button variant="text" size="sm" icon={<FiEdit2 />}>
                  Редактировать
                </Button>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm whitespace-pre-line">{client.notes || 'Нет заметок'}</p>
              </div>
            </div>
          </Card>
          
          {/* История сессий */}
          <Card>
            <div className="p-5">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">История сессий</h2>
                <Button variant="primary" size="sm" icon={<FiCalendar />}>
                  Запланировать сессию
                </Button>
              </div>
              
              {sessions.length > 0 ? (
                <div className="space-y-3">
                  {sessions.map((session) => (
                    <div key={session.id} className="border-b border-gray-100 pb-3 last:border-0 last:pb-0">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium">{session.title}</p>
                          <p className="text-sm text-gray-500">
                            {new Date(session.start).toLocaleDateString('ru-RU', {
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                        <span className={`text-xs px-2 py-1 rounded-full ${getSessionStatusColor(session.status)}`}>
                          {getSessionStatusText(session.status)}
                        </span>
                      </div>
                      
                      {session.notes && (
                        <div className="mt-2">
                          <p className="text-sm text-gray-600">{session.notes}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-gray-500 py-4">Нет истории сессий</p>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ClientDetail;
