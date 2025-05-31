import { Link, useLocation } from 'react-router-dom';
import { FiHome, FiUsers, FiCalendar, FiBook, FiBarChart2 } from 'react-icons/fi';

const TabBar = () => {
  const location = useLocation();
  
  const tabs = [
    { id: 'dashboard', name: 'Главная', icon: <FiHome size={22} />, path: '/' },
    { id: 'clients', name: 'Клиенты', icon: <FiUsers size={24} />, path: '/clients' },
    { id: 'calendar', name: 'Календарь', icon: <FiCalendar size={24} />, path: '/calendar' },
    { id: 'programs', name: 'Программы', icon: <FiBook size={24} />, path: '/programs' },
    { id: 'analytics', name: 'Аналитика', icon: <FiBarChart2 size={24} />, path: '/analytics' },

  ];
  
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-ios border-t border-gray-200 flex justify-around items-center px-2 py-2 z-10">
      {tabs.map((tab) => (
        <Link 
          key={tab.id}
          to={tab.path}
          className={`flex flex-col items-center justify-center w-full py-1 ${location.pathname === tab.path || (tab.path !== '/' && location.pathname.startsWith(tab.path)) ? 'text-blue-500' : 'text-gray-500'}`}
        >
          {tab.icon}
          <span className="text-xs mt-1">{tab.name}</span>
        </Link>
      ))}
    </div>
  );
};

export default TabBar;
