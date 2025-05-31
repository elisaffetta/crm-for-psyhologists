import { useState, useEffect } from 'react';
import { useData } from '../context/DataContext';
import { FiUsers, FiCalendar, FiActivity, FiPieChart, FiBarChart2, FiAlertTriangle } from 'react-icons/fi';
import type { Analytics as AnalyticsType } from '../types/runtime-types';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';
import type { ChartData } from 'chart.js';

// Регистрируем компоненты Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const Analytics = () => {
  const { analytics } = useData();
  // Типизируем данные аналитики
  const typedAnalytics = analytics as AnalyticsType | undefined;
  const [sessionChartData, setSessionChartData] = useState<ChartData<'bar', number[], string> | null>(null);
  const [therapyTypeChartData, setTherapyTypeChartData] = useState<ChartData<'pie', number[], string> | null>(null);
  const [programEffectivenessData, setProgramEffectivenessData] = useState<ChartData<'bar', number[], string> | null>(null);
  const [clientProgressData, setClientProgressData] = useState<ChartData<'bar', number[], string> | null>(null);
  
  useEffect(() => {
    if (typedAnalytics && typedAnalytics.sessionsByMonth && typedAnalytics.therapyTypeDistribution && 
        typedAnalytics.programEffectiveness && typedAnalytics.clientProgress) {
      // Данные для графика сессий по месяцам
      const sessionData = {
        labels: typedAnalytics.sessionsByMonth.map(item => item.month),
        datasets: [
          {
            label: 'Количество сессий',
            data: typedAnalytics.sessionsByMonth.map(item => item.count),
            backgroundColor: 'rgba(79, 70, 229, 0.5)',
            borderColor: 'rgb(79, 70, 229)',
            borderWidth: 1,
          },
        ],
      };
      setSessionChartData(sessionData);
      
      // Данные для графика распределения типов терапии
      const therapyData = {
        labels: typedAnalytics.therapyTypeDistribution.map(item => item.type),
        datasets: [
          {
            label: 'Распределение типов терапии',
            data: typedAnalytics.therapyTypeDistribution.map(item => item.count),
            backgroundColor: [
              'rgba(79, 70, 229, 0.7)',
              'rgba(59, 130, 246, 0.7)',
              'rgba(16, 185, 129, 0.7)',
              'rgba(245, 158, 11, 0.7)',
              'rgba(239, 68, 68, 0.7)',
            ],
            borderColor: [
              'rgb(79, 70, 229)',
              'rgb(59, 130, 246)',
              'rgb(16, 185, 129)',
              'rgb(245, 158, 11)',
              'rgb(239, 68, 68)',
            ],
            borderWidth: 1,
          },
        ],
      };
      setTherapyTypeChartData(therapyData);
      
      // Данные для графика эффективности программ
      const programData = {
        labels: typedAnalytics.programEffectiveness.map(item => item.name),
        datasets: [
          {
            label: 'Эффективность программ (%)',
            data: typedAnalytics.programEffectiveness.map(item => item.effectiveness),
            backgroundColor: 'rgba(16, 185, 129, 0.5)',
            borderColor: 'rgb(16, 185, 129)',
            borderWidth: 1,
          },
        ],
      };
      setProgramEffectivenessData(programData);
      
      // Данные для графика прогресса клиентов
      const progressLabels = typedAnalytics.clientProgress.map(client => 
        `${client.name.split(' ')[0]} ${client.name.split(' ')[1][0]}.`
      );
      
      const progressData = {
        labels: progressLabels,
        datasets: [
          {
            label: 'Прогресс клиентов (%)',
            data: typedAnalytics.clientProgress.map(client => client.progress),
            backgroundColor: 'rgba(59, 130, 246, 0.5)',
            borderColor: 'rgb(59, 130, 246)',
            borderWidth: 1,
          },
        ],
      };
      setClientProgressData(progressData);
    }
  }, [analytics]);

  if (!analytics) {
    return (
      <div className="p-4 flex justify-center items-center h-full">
        <p>Загрузка...</p>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-semibold mb-6">Аналитика</h1>
      
      {/* Карточки с основными показателями */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <div className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Клиенты</p>
                <p className="text-2xl font-semibold">{analytics.summary.totalClients}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <FiUsers className="text-blue-500" size={20} />
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              {analytics.summary.activeClients} активных, {analytics.summary.completedClients} завершенных
            </p>
          </div>
        </Card>
        
        <Card>
          <div className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Сессии</p>
                <p className="text-2xl font-semibold">{analytics.summary.totalSessions}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <FiCalendar className="text-green-500" size={20} />
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              {analytics.summary.completedSessions} завершенных, {analytics.summary.scheduledSessions} запланированных
            </p>
          </div>
        </Card>
        
        <Card>
          <div className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Средний прогресс</p>
                <p className="text-2xl font-semibold">{analytics.summary.averageClientProgress}%</p>
              </div>
              <div className="bg-amber-100 p-3 rounded-full">
                <FiActivity className="text-amber-500" size={20} />
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              {analytics.summary.averageSessionsPerClient} сессий на клиента
            </p>
          </div>
        </Card>
        
        <Card>
          <div className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Удержание</p>
                <p className="text-2xl font-semibold">{analytics.summary.clientRetentionRate}%</p>
              </div>
              <div className="bg-purple-100 p-3 rounded-full">
                <FiPieChart className="text-purple-500" size={20} />
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Клиентов, продолживших терапию
            </p>
          </div>
        </Card>
      </div>
      
      {/* Графики */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* График сессий по месяцам */}
        <Card>
          <div className="p-5">
            <h2 className="text-lg font-semibold mb-4">Сессии по месяцам</h2>
            {sessionChartData && (
              <div className="h-64">
                <Bar 
                  data={sessionChartData} 
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        display: false,
                      },
                    },
                  }}
                />
              </div>
            )}
          </div>
        </Card>
        
        {/* График распределения типов терапии */}
        <Card>
          <div className="p-5">
            <h2 className="text-lg font-semibold mb-4">Распределение типов терапии</h2>
            {therapyTypeChartData && (
              <div className="h-64 flex justify-center">
                <div style={{ maxWidth: '250px' }}>
                  <Pie 
                    data={therapyTypeChartData} 
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        </Card>
        
        {/* График эффективности программ */}
        <Card>
          <div className="p-5">
            <h2 className="text-lg font-semibold mb-4">Эффективность программ</h2>
            {programEffectivenessData && (
              <div className="h-64">
                <Bar 
                  data={programEffectivenessData} 
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    indexAxis: 'y',
                    plugins: {
                      legend: {
                        display: false,
                      },
                    },
                    scales: {
                      x: {
                        max: 100,
                      },
                    },
                  }}
                />
              </div>
            )}
          </div>
        </Card>
        
        {/* График прогресса клиентов */}
        <Card>
          <div className="p-5">
            <h2 className="text-lg font-semibold mb-4">Прогресс клиентов</h2>
            {clientProgressData && (
              <div className="h-64">
                <Bar 
                  data={clientProgressData} 
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        display: false,
                      },
                    },
                    scales: {
                      y: {
                        max: 100,
                      },
                    },
                  }}
                />
              </div>
            )}
          </div>
        </Card>
      </div>
      
      {/* AI Аномалии */}
      <Card>
        <div className="p-5">
          <div className="flex items-center gap-2 mb-4">
            <div className="bg-red-100 p-2 rounded-full">
              <FiAlertTriangle className="text-red-600" />
            </div>
            <h2 className="text-lg font-semibold">AI Обнаруженные аномалии</h2>
          </div>
          
          <div className="space-y-4">
            {analytics.aiDetectedAnomalies.map((anomaly) => (
              <div key={anomaly.clientId} className="bg-red-50 p-4 rounded-lg">
                <div className="flex items-start gap-3">
                  <div className="bg-red-100 p-2 rounded-full mt-1">
                    <FiUsers className="text-red-500" size={16} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-semibold">{anomaly.name}</p>
                      <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full">
                        {anomaly.anomalyType}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 mt-1">{anomaly.description}</p>
                    <p className="text-xs text-gray-500 mt-2">
                      Обнаружено: {new Date(anomaly.detectedAt).toLocaleDateString('ru-RU')}
                    </p>
                    <div className="mt-3">
                      <Button 
                        variant="secondary" 
                        size="sm"
                      >
                        Просмотреть клиента
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>
      
      {/* AI Рекомендации */}
      <Card className="mt-6">
        <div className="p-5">
          <div className="flex items-center gap-2 mb-4">
            <div className="bg-purple-100 p-2 rounded-full">
              <FiBarChart2 className="text-purple-600" />
            </div>
            <h2 className="text-lg font-semibold">AI Рекомендации по улучшению показателей</h2>
          </div>
          
          <div className="space-y-4">
            <div className="bg-purple-50 p-4 rounded-lg">
              <p className="text-sm font-medium text-purple-800 mb-2">
                Оптимизация удержания клиентов
              </p>
              <p className="text-sm text-gray-700">
                Анализ показывает, что клиенты, которые проходят более 5 сессий, имеют на 40% более высокий 
                показатель удержания. Рекомендуется сфокусироваться на удержании клиентов в течение первых 
                5 сессий, предлагая более персонализированные программы и регулярную обратную связь.
              </p>
            </div>
            
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm font-medium text-blue-800 mb-2">
                Повышение эффективности программ
              </p>
              <p className="text-sm text-gray-700">
                Программы с интерактивными материалами (видео, опросники) показывают на 25% более высокую 
                эффективность. Рекомендуется добавить больше интерактивных элементов в программы с низкой 
                эффективностью, особенно в "Программу семейной терапии".
              </p>
            </div>
            
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-sm font-medium text-green-800 mb-2">
                Оптимизация расписания
              </p>
              <p className="text-sm text-gray-700">
                Клиенты, посещающие сессии в одно и то же время каждую неделю, показывают на 30% более высокий 
                прогресс. Рекомендуется предлагать клиентам фиксированное время для регулярных сессий и 
                минимизировать изменения в расписании.
              </p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Analytics;
