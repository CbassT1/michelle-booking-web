import { Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';

import Home from './pages/Home';
import NotFound from './pages/NotFound';
import ServiceDetail from './pages/ServiceDetail';

import PrivacyPolicy from './components/legal/PrivacyPolicy';
import LegalNotice from './components/legal/LegalNotice';
import CookiesPolicy from './components/legal/CookiesPolicy';

import Login from './pages/admin/Login';
import Dashboard from './pages/admin/Dashboard';
import ProtectedRoute from './components/layout/ProtectedRoute';

function App() {
  const location = useLocation();
  
  const esRutaAdmin = location.pathname.startsWith('/admin');

  return (
    <div className={`bg-light text-dark font-sans antialiased min-h-screen flex flex-col ${!esRutaAdmin ? 'pt-32' : ''}`}>

      {!esRutaAdmin && <Header />}
      
      <main className="flex-grow">
        <Routes>

          <Route path="/" element={<Home />} />
          <Route path="/servicio/:id" element={<ServiceDetail />} />
          
          <Route path="/privacidad" element={<PrivacyPolicy />} />
          <Route path="/aviso-legal" element={<LegalNotice />} />
          <Route path="/cookies" element={<CookiesPolicy />} />

          <Route path="/admin" element={<Login />} />

          <Route 
            path="/admin/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      
      {!esRutaAdmin && <Footer />}
    </div>
  );
}

export default App;