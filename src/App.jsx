import { Routes, Route } from 'react-router-dom';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';

// Páginas Principales
import Home from './pages/Home';
import NotFound from './pages/NotFound';
import ServiceDetail from './pages/ServiceDetail';

// Páginas Legales
import PrivacyPolicy from './components/legal/PrivacyPolicy';
import LegalNotice from './components/legal/LegalNotice';
import CookiesPolicy from './components/legal/CookiesPolicy';

function App() {
  return (
    <div className="bg-light text-dark font-sans antialiased min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/servicio/:id" element={<ServiceDetail />} />
          
          {/* Rutas Legales */}
          <Route path="/privacidad" element={<PrivacyPolicy />} />
          <Route path="/aviso-legal" element={<LegalNotice />} />
          <Route path="/cookies" element={<CookiesPolicy />} />
          
          {/* Ruta 404 Catch-all */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      
      <Footer />
    </div>
  );
}

export default App;