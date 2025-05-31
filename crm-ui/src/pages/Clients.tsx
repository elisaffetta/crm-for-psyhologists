import { useState, useEffect } from 'react';
import type { ChangeEvent } from 'react';
import { useData } from '../context/DataContext';
import { Link } from 'react-router-dom';
import { FiSearch, FiPlus } from 'react-icons/fi';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import type { Client } from '../types/runtime-types';

const Clients = () => {
  const { clients } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredClients, setFilteredClients] = useState<Client[]>([]);
  const [activeFilter, setActiveFilter] = useState<string>('all');

  useEffect(() => {
    let result = [...clients];
    
    // Применяем поиск
    if (searchTerm) {
      result = result.filter(client => 
        `${client.firstName} ${client.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Применяем фильтр по статусу
    if (activeFilter !== 'all') {
      result = result.filter(client => client.status === activeFilter);
    }
    
    setFilteredClients(result);
  }, [clients, searchTerm, activeFilter]);

  const getStatusColor = (status: string) => {
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

  const getStatusText = (status: string) => {
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

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Клиенты</h1>
        <Button 
          variant="primary" 
          size="md"
          icon={<FiPlus />}
        >
          Добавить клиента
        </Button>
      </div>
      
      {/* Поиск и фильтры */}
      <div className="mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Input
                placeholder="Поиск клиентов..."
                value={searchTerm}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
              />
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                <FiSearch className="text-gray-400" />
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Button 
              variant={activeFilter === 'all' ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => setActiveFilter('all')}
            >
              Все
            </Button>
            <Button 
              variant={activeFilter === 'active' ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => setActiveFilter('active')}
            >
              Активные
            </Button>
            <Button 
              variant={activeFilter === 'paused' ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => setActiveFilter('paused')}
            >
              Приостановлены
            </Button>
            <Button 
              variant={activeFilter === 'completed' ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => setActiveFilter('completed')}
            >
              Завершены
            </Button>
          </div>
        </div>
      </div>
      
      {/* Список клиентов */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredClients.length > 0 ? (
          filteredClients.map((client) => (
            <Link to={`/clients/${client.id}`} key={client.id}>
              <Card className="transition-all duration-200 hover:shadow-md">
                <div className="p-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200">
                      {client.avatar ? (
                        <img 
                          src={client.avatar} 
                          alt={`${client.firstName} ${client.lastName}`}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-blue-100 text-blue-600 font-semibold">
                          {client.firstName[0]}{client.lastName[0]}
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold">{client.firstName} {client.lastName}</h3>
                          <p className="text-sm text-gray-500">{client.therapyType}</p>
                        </div>
                        <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(client.status)}`}>
                          {getStatusText(client.status)}
                        </span>
                      </div>
                      <div className="mt-2 flex justify-between items-center">
                        <p className="text-xs text-gray-500">
                          Сессий: {client.completedSessions}/{client.totalSessions}
                        </p>
                        {client.nextSession && (
                          <p className="text-xs text-gray-500">
                            Следующая: {new Date(client.nextSession).toLocaleDateString('ru-RU')}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </Link>
          ))
        ) : (
          <div className="col-span-full text-center py-8">
            <p className="text-gray-500">Клиенты не найдены</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Clients;
