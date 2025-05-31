import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { FiArrowLeft, FiEdit2, FiClock, FiCalendar, FiUsers, FiFileText, FiDownload, FiPlay, FiMic, FiList } from 'react-icons/fi';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import type { Program, ProgramStage, Material } from '../types';

const ProgramDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { programs, clients } = useData();
  const [program, setProgram] = useState<Program | null>(null);
  const [activeStage, setActiveStage] = useState<ProgramStage | null>(null);
  
  useEffect(() => {
    if (id) {
      const programData = programs.find(p => p.id === id);
      if (programData) {
        setProgram(programData);
        // По умолчанию выбираем первый этап
        if (programData.stages.length > 0) {
          setActiveStage(programData.stages[0]);
        }
      } else {
        // Если программа не найдена, перенаправляем на страницу со списком программ
        navigate('/programs');
      }
    }
  }, [id, programs, navigate]);

  if (!program) {
    return (
      <div className="p-4 flex justify-center items-center h-full">
        <p>Загрузка...</p>
      </div>
    );
  }

  // Находим клиентов, которые могут использовать эту программу (по типу терапии)
  const compatibleClients = clients.filter(client => 
    client.therapyType === program.therapyType && client.status === 'active'
  );

  const getMaterialIcon = (type: Material['type']) => {
    switch (type) {
      case 'article':
        return <FiFileText className="text-blue-500" />;
      case 'video':
        return <FiPlay className="text-red-500" />;
      case 'audio':
        return <FiMic className="text-purple-500" />;
      case 'questionnaire':
        return <FiList className="text-green-500" />;
      case 'worksheet':
        return <FiDownload className="text-amber-500" />;
      default:
        return <FiFileText className="text-gray-500" />;
    }
  };

  const getMaterialTypeText = (type: Material['type']) => {
    switch (type) {
      case 'article':
        return 'Статья';
      case 'video':
        return 'Видео';
      case 'audio':
        return 'Аудио';
      case 'questionnaire':
        return 'Опросник';
      case 'worksheet':
        return 'Рабочий лист';
      default:
        return type;
    }
  };

  return (
    <div className="p-4">
      {/* Верхняя панель с навигацией */}
      <div className="flex items-center mb-6">
        <Button 
          variant="primary" 
          size="sm" 
          icon={<FiArrowLeft />} 
          onClick={() => navigate('/programs')}
        >
          Назад к списку
        </Button>
      </div>
      
      {/* Заголовок программы */}
      <div className="mb-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-semibold">{program.title}</h1>
            <div className="flex items-center gap-4 mt-2">
              <div className="flex items-center text-sm text-gray-500">
                <FiClock className="mr-1" />
                <span>{program.duration}</span>
              </div>
              <div className="flex items-center text-sm text-gray-500">
                <FiCalendar className="mr-1" />
                <span>Создано: {new Date(program.createdAt).toLocaleDateString('ru-RU')}</span>
              </div>
              <div className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                {program.therapyType}
              </div>
            </div>
          </div>
          <Button 
            variant="primary" 
            size="md" 
            icon={<FiEdit2 />}
          >
            Редактировать
          </Button>
        </div>
      </div>
      
      {/* Описание программы */}
      <Card className="mb-6">
        <div className="p-5">
          <h2 className="text-lg font-semibold mb-3">Описание программы</h2>
          <p className="text-gray-700">{program.description}</p>
          
          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center gap-1">
              <FiUsers className="text-gray-400" />
              <span className="text-sm text-gray-500">
                {compatibleClients.length} совместимых клиентов
              </span>
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs text-gray-500 mr-2">Эффективность:</span>
                <span className="text-xs font-medium">{program.effectiveness}%</span>
              </div>
              <div className="w-32 bg-gray-200 rounded-full h-1.5">
                <div 
                  className="bg-green-500 h-1.5 rounded-full" 
                  style={{ width: `${program.effectiveness}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </Card>
      
      {/* Этапы программы */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Список этапов */}
        <div className="lg:col-span-1">
          <Card>
            <div className="p-5">
              <h2 className="text-lg font-semibold mb-4">Этапы программы</h2>
              
              <div className="space-y-3">
                {program.stages.map((stage: ProgramStage, index: number) => (
                  <div 
                    key={stage.id}
                    className={`p-3 rounded-lg cursor-pointer transition-colors ${
                      activeStage?.id === stage.id 
                        ? 'bg-blue-50 border border-blue-200' 
                        : 'hover:bg-gray-50 border border-transparent'
                    }`}
                    onClick={() => setActiveStage(stage)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center">
                          <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-medium mr-2">
                            {index + 1}
                          </div>
                          <h3 className="font-medium">{stage.title}</h3>
                        </div>
                        <p className="text-xs text-gray-500 mt-1 ml-8">
                          Длительность: {stage.duration}
                        </p>
                      </div>
                      <div className="text-xs bg-gray-100 px-2 py-1 rounded-full">
                        {stage.materials.length} материалов
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>
        
        {/* Детали выбранного этапа */}
        <div className="lg:col-span-2">
          {activeStage ? (
            <Card>
              <div className="p-5">
                <h2 className="text-lg font-semibold mb-1">{activeStage.title}</h2>
                <p className="text-sm text-gray-500 mb-4">Длительность: {activeStage.duration}</p>
                
                <div className="mb-6">
                  <h3 className="text-md font-medium mb-2">Описание этапа</h3>
                  <p className="text-gray-700">{activeStage.description}</p>
                </div>
                
                <div>
                  <h3 className="text-md font-medium mb-3">Материалы</h3>
                  
                  <div className="space-y-3">
                    {activeStage.materials.map((material: Material) => (
                      <div key={material.id} className="border border-gray-200 rounded-lg p-3 hover:bg-gray-50 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-gray-100 rounded-full">
                            {getMaterialIcon(material.type)}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium">{material.title}</h4>
                            <div className="flex items-center justify-between mt-1">
                              <span className="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full">
                                {getMaterialTypeText(material.type)}
                              </span>
                              <Button 
                                variant="primary" 
                                size="sm"
                                icon={<FiDownload />}
                              >
                                Скачать
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-500">Выберите этап программы для просмотра деталей</p>
            </div>
          )}
        </div>
      </div>
      
      {/* AI Рекомендации */}
      <Card className="mt-6">
        <div className="p-5">
          <h2 className="text-lg font-semibold mb-4">AI Рекомендации</h2>
          
          <div className="space-y-4">
            <div className="bg-purple-50 p-4 rounded-lg">
              <p className="text-sm font-medium text-purple-800 mb-2">
                Оптимизация программы
              </p>
              <p className="text-sm text-gray-700">
                Анализ показывает, что второй этап программы может быть оптимизирован. Рекомендуется добавить 
                дополнительные материалы по релаксации и управлению стрессом, что может повысить эффективность 
                программы на 5-7%.
              </p>
            </div>
            
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm font-medium text-blue-800 mb-2">
                Рекомендуемые клиенты
              </p>
              <p className="text-sm text-gray-700">
                Эта программа особенно хорошо подойдет для следующих клиентов: Анна Петрова, Михаил Козлов. 
                Их профили и текущие терапевтические цели наиболее соответствуют содержанию программы.
              </p>
            </div>
            
            <div className="bg-amber-50 p-4 rounded-lg">
              <p className="text-sm font-medium text-amber-800 mb-2">
                Предложение по адаптации
              </p>
              <p className="text-sm text-gray-700">
                Для повышения эффективности программы для клиентов с высоким уровнем тревожности, 
                рекомендуется добавить дополнительные аудио-материалы с техниками дыхания и медитации 
                в первый и третий этапы программы.
              </p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ProgramDetail;
