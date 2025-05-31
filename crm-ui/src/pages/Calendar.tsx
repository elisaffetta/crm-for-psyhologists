import { useState, useEffect } from 'react';
import { useData } from '../context/DataContext';
import { Calendar as ReactCalendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'moment/locale/ru';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { FiPlus, FiCalendar, FiClock, FiUser } from 'react-icons/fi';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Modal from '../components/ui/Modal';

// Типы для модулей определены в custom.d.ts

// Настраиваем локализацию для календаря
moment.locale('ru');
const localizer = momentLocalizer(moment);

// Определяем тип для событий календаря
type CalendarEvent = {
  id: string;
  title: string;
  start: Date;
  end: Date;
  clientId: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  notes: string;
  homework: string;
};

// Компонент для отображения события в календаре
const EventComponent = ({ event }: { event: CalendarEvent }) => {
  const { clients } = useData();
  const client = clients.find(c => c.id === event.clientId);
  
  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'scheduled':
        return 'border-l-4 border-blue-500 bg-blue-50';
      case 'completed':
        return 'border-l-4 border-green-500 bg-green-50';
      case 'cancelled':
        return 'border-l-4 border-red-500 bg-red-50';
      default:
        return 'border-l-4 border-gray-500 bg-gray-50';
    }
  };
  
  return (
    <div className={`p-1 h-full overflow-hidden ${getStatusColor(event.status)}`}>
      <div className="text-xs font-medium truncate">{event.title}</div>
      {client && (
        <div className="text-xs truncate text-gray-600">
          {client.firstName} {client.lastName}
        </div>
      )}
    </div>
  );
};

const Calendar = () => {
  const { sessions, clients } = useData();
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [view, setView] = useState('month');
  const [date, setDate] = useState(new Date());
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    // Преобразуем сессии в формат событий для календаря
    const calendarEvents = sessions
      .filter(session => filter === 'all' || session.status === filter)
      .map(session => ({
        id: session.id,
        title: session.title,
        start: new Date(session.start),
        end: new Date(session.end),
        clientId: session.clientId,
        status: session.status,
        notes: session.notes,
        homework: session.homework
      }));
    
    setEvents(calendarEvents);
  }, [sessions, filter]);

  const handleEventSelect = (event: CalendarEvent) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedEvent(null);
  };

  const getStatusText = (status: string): string => {
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

  const getStatusColor = (status: string): string => {
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

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Календарь</h1>
        <Button 
          variant="primary" 
          size="md"
          icon={<FiPlus />}
        >
          Новая сессия
        </Button>
      </div>
      
      {/* Фильтры и переключение вида */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <div className="flex gap-2">
          <Button 
            variant={filter === 'all' ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => setFilter('all')}
          >
            Все
          </Button>
          <Button 
            variant={filter === 'scheduled' ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => setFilter('scheduled')}
          >
            Запланированные
          </Button>
          <Button 
            variant={filter === 'completed' ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => setFilter('completed')}
          >
            Завершенные
          </Button>
          <Button 
            variant={filter === 'cancelled' ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => setFilter('cancelled')}
          >
            Отмененные
          </Button>
        </div>
        
        <div className="flex gap-2">
          <Button 
            variant={view === 'month' ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => setView('month')}
          >
            Месяц
          </Button>
          <Button 
            variant={view === 'week' ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => setView('week')}
          >
            Неделя
          </Button>
          <Button 
            variant={view === 'day' ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => setView('day')}
          >
            День
          </Button>
          <Button 
            variant={view === 'agenda' ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => setView('agenda')}
          >
            Список
          </Button>
        </div>
      </div>
      
      {/* Календарь */}
      <Card className="mb-6 overflow-hidden">
        <div className="h-[700px] p-4">
          <ReactCalendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            style={{ height: '100%' }}
            views={['month', 'week', 'day', 'agenda']}
            view={view}
            date={date}
            onNavigate={setDate}
            onView={setView}
            onSelectEvent={handleEventSelect}
            components={{
              event: EventComponent
            }}
            messages={{
              today: 'Сегодня',
              previous: 'Назад',
              next: 'Вперед',
              month: 'Месяц',
              week: 'Неделя',
              day: 'День',
              agenda: 'Список',
              date: 'Дата',
              time: 'Время',
              event: 'Событие',
              noEventsInRange: 'Нет событий в этом диапазоне'
            }}
          />
        </div>
      </Card>
      
      {/* AI Рекомендации по оптимизации расписания */}
      <Card>
        <div className="p-5">
          <div className="flex items-center gap-2 mb-4">
            <div className="bg-purple-100 p-2 rounded-full">
              <FiCalendar className="text-purple-600" />
            </div>
            <h2 className="text-lg font-semibold">AI Рекомендации по оптимизации расписания</h2>
          </div>
          
          <div className="space-y-4">
            <div className="bg-purple-50 p-4 rounded-lg">
              <p className="text-sm font-medium text-purple-800 mb-2">
                Оптимизация рабочего времени
              </p>
              <p className="text-sm text-gray-700">
                Анализ вашего расписания показывает, что вы можете оптимизировать рабочее время, 
                группируя сессии в блоки по 2-3 часа с перерывами между ними. Это позволит снизить 
                утомляемость и повысить эффективность работы.
              </p>
            </div>
            
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm font-medium text-blue-800 mb-2">
                Рекомендуемые изменения в расписании
              </p>
              <p className="text-sm text-gray-700">
                Предлагаем перенести сессию с Иваном Сидоровым с понедельника на среду, 
                чтобы создать более сбалансированное распределение нагрузки в течение недели. 
                Это также даст вам дополнительное время для подготовки к другим сессиям.
              </p>
            </div>
            
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-sm font-medium text-green-800 mb-2">
                Напоминание о перерывах
              </p>
              <p className="text-sm text-gray-700">
                В четверг у вас запланировано 5 сессий подряд без перерывов. Рекомендуем добавить 
                15-минутные перерывы между сессиями для поддержания высокой концентрации и качества работы.
              </p>
            </div>
          </div>
        </div>
      </Card>
      
      {/* Модальное окно с деталями события */}
      {selectedEvent && (
        <Modal 
          isOpen={isModalOpen} 
          onClose={handleCloseModal}
          title="Детали сессии"
        >
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold">{selectedEvent.title}</h3>
              <div className="flex items-center mt-1">
                <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(selectedEvent.status)}`}>
                  {getStatusText(selectedEvent.status)}
                </span>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center">
                <FiCalendar className="text-gray-400 mr-2" />
                <span className="text-sm">
                  {moment(selectedEvent.start).format('DD MMMM YYYY')}
                </span>
              </div>
              
              <div className="flex items-center">
                <FiClock className="text-gray-400 mr-2" />
                <span className="text-sm">
                  {moment(selectedEvent.start).format('HH:mm')} - {moment(selectedEvent.end).format('HH:mm')}
                </span>
              </div>
              
              <div className="flex items-center">
                <FiUser className="text-gray-400 mr-2" />
                <span className="text-sm">
                  {clients.find(c => c.id === selectedEvent.clientId)?.firstName} {clients.find(c => c.id === selectedEvent.clientId)?.lastName}
                </span>
              </div>
            </div>
            
            {selectedEvent.notes && (
              <div>
                <p className="text-sm font-medium mb-1">Заметки:</p>
                <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded">{selectedEvent.notes}</p>
              </div>
            )}
            
            {selectedEvent.homework && (
              <div>
                <p className="text-sm font-medium mb-1">Домашнее задание:</p>
                <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded">{selectedEvent.homework}</p>
              </div>
            )}
            
            <div className="flex justify-end gap-2 mt-4">
              <Button 
                variant="secondary" 
                size="sm"
                onClick={handleCloseModal}
              >
                Закрыть
              </Button>
              <Button 
                variant="primary" 
                size="sm"
              >
                Редактировать
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Calendar;
