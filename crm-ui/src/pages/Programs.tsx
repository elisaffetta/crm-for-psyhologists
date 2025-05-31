import { useState, useEffect } from 'react';
import type { ChangeEvent } from 'react';
import { useData } from '../context/DataContext';
import { Link } from 'react-router-dom';
import { FiSearch, FiPlus, FiFileText, FiClock, FiBarChart2 } from 'react-icons/fi';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import type { Program } from '../types/runtime-types';

const Programs = () => {
  const { programs } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredPrograms, setFilteredPrograms] = useState<Program[]>([]);
  const [therapyTypeFilter, setTherapyTypeFilter] = useState('all');
  
  // Получаем уникальные типы терапии из программ
  const therapyTypes = ['all', ...new Set(programs.map(program => program.therapyType))];

  useEffect(() => {
    let result = [...programs];
    
    // Применяем поиск
    if (searchTerm) {
      result = result.filter(program => 
        program.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        program.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Применяем фильтр по типу терапии
    if (therapyTypeFilter !== 'all') {
      result = result.filter(program => program.therapyType === therapyTypeFilter);
    }
    
    // Сортируем по эффективности (от высокой к низкой)
    result = result.sort((a, b) => b.effectiveness - a.effectiveness);
    
    setFilteredPrograms(result);
  }, [programs, searchTerm, therapyTypeFilter]);

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Терапевтические программы</h1>
        <Button 
          variant="primary" 
          size="md"
          icon={<FiPlus />}
        >
          Создать программу
        </Button>
      </div>
      
      {/* Поиск и фильтры */}
      <div className="mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Input
                placeholder="Поиск программ..."
                value={searchTerm}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
              />
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                <FiSearch className="text-gray-400" />
              </div>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {therapyTypes.map((type) => (
              <Button 
                key={type}
                variant={therapyTypeFilter === type ? 'primary' : 'secondary'}
                size="sm"
                onClick={() => setTherapyTypeFilter(type)}
              >
                {type === 'all' ? 'Все типы' : type}
              </Button>
            ))}
          </div>
        </div>
      </div>
      
      {/* Список программ */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredPrograms.length > 0 ? (
          filteredPrograms.map((program) => (
            <Link to={`/programs/${program.id}`} key={program.id}>
              <Card className="transition-all duration-200 hover:shadow-md">
                <div className="p-4">
                  <div className="mb-3">
                    <div className="flex justify-between items-start">
                      <h3 className="font-semibold">{program.title}</h3>
                      <div className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                        {program.therapyType}
                      </div>
                    </div>
                    <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                      {program.description}
                    </p>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                    <div className="flex items-center">
                      <FiClock className="mr-1" size={14} />
                      <span>{program.duration}</span>
                    </div>
                    <div className="flex items-center">
                      <FiFileText className="mr-1" size={14} />
                      <span>{program.stages.length} этапов</span>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs text-gray-500">Эффективность</span>
                      <span className="text-xs font-medium">{program.effectiveness}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                      <div 
                        className="bg-green-500 h-1.5 rounded-full" 
                        style={{ width: `${program.effectiveness}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="mt-3 pt-3 border-t border-gray-100 text-xs text-gray-500">
                    Создано: {new Date(program.createdAt).toLocaleDateString('ru-RU')}
                  </div>
                </div>
              </Card>
            </Link>
          ))
        ) : (
          <div className="col-span-full text-center py-8">
            <p className="text-gray-500">Программы не найдены</p>
          </div>
        )}
      </div>
      
      {/* AI Рекомендации */}
      <div className="mt-8">
        <Card>
          <div className="p-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-purple-100 p-2 rounded-full">
                <FiBarChart2 className="text-purple-600" />
              </div>
              <h2 className="text-lg font-semibold">AI Рекомендации по программам</h2>
            </div>
            
            <div className="space-y-4">
              <div className="bg-purple-50 p-4 rounded-lg">
                <p className="text-sm font-medium text-purple-800 mb-2">
                  Рекомендация по оптимизации
                </p>
                <p className="text-sm text-gray-700">
                  Анализ показывает, что программа "Программа управления тревожностью" имеет наивысшую эффективность (85%). 
                  Рекомендуется адаптировать элементы этой программы для других программ с более низкой эффективностью.
                </p>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm font-medium text-blue-800 mb-2">
                  Предложение новой программы
                </p>
                <p className="text-sm text-gray-700">
                  На основе анализа профилей ваших клиентов, рекомендуется создать новую программу 
                  "Управление эмоциональным выгоранием для творческих профессий", так как 30% ваших клиентов 
                  относятся к этой категории.
                </p>
              </div>
              
              <div className="bg-green-50 p-4 rounded-lg">
                <p className="text-sm font-medium text-green-800 mb-2">
                  Оптимизация длительности
                </p>
                <p className="text-sm text-gray-700">
                  Статистика показывает, что программы длительностью 8-10 недель имеют наивысшую эффективность и 
                  завершаемость. Рекомендуется пересмотреть более длительные программы и разделить их на 
                  более короткие модули.
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Programs;
