import { Outlet, useLocation } from 'react-router-dom';
import TabBar from './TabBar';

// Интерфейс больше не нужен, так как мы генерируем заголовок на основе пути

const Layout = () => {
  const location = useLocation();
  
  // Определяем заголовок на основе текущего пути
  const getTitle = () => {
    const path = location.pathname;
    if (path === '/') return 'Панель управления';
    if (path.includes('/clients')) return 'Клиенты';
    if (path.includes('/calendar')) return 'Календарь';
    if (path.includes('/programs')) return 'Программы';
    if (path.includes('/analytics')) return 'Аналитика';
    return '';
  };
  
  const title = getTitle();
  return (
    <div className="flex flex-col min-h-screen bg-cloud-white">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-ios shadow-ios">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          {title && <h1 className="text-xl font-semibold text-ios-dark-gray">{title}</h1>}
        </div>
      </header>
      
      {/* Main Content */}
      <main className="flex-grow container mx-auto px-4 py-4 pb-20">
        <Outlet />
      </main>
      
      {/* Tab Bar */}
      <TabBar />
    </div>
  );
};

export default Layout;
