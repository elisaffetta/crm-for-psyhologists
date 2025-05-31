import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { DataProvider } from './context/DataContext'
import Layout from './components/layout/Layout'

// Импорт страниц
import Dashboard from './pages/Dashboard'
import Clients from './pages/Clients'
import ClientDetail from './pages/ClientDetail'
import Calendar from './pages/Calendar'
import Programs from './pages/Programs'
import ProgramDetail from './pages/ProgramDetail'
import Analytics from './pages/Analytics'

function App() {
  return (
    <Router>
      <DataProvider>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="clients" element={<Clients />} />
            <Route path="clients/:id" element={<ClientDetail />} />
            <Route path="calendar" element={<Calendar />} />
            <Route path="programs" element={<Programs />} />
            <Route path="programs/:id" element={<ProgramDetail />} />
            <Route path="analytics" element={<Analytics />} />
          </Route>
        </Routes>
      </DataProvider>
    </Router>
  )
}

export default App
