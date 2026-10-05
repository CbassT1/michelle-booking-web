import { Routes, Route } from 'react-router-dom';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';

import Home from './pages/Home';
import NotFound from './pages/NotFound';
import ServiceDetail from './pages/ServiceDetail';

import PrivacyPolicy from './components/legal/PrivacyPolicy';
import LegalNotice from './components/legal/LegalNotice';
import CookiesPolicy from './components/legal/CookiesPolicy';

function App() {
  return (
    <div className="bg-light text-dark font-sans antialiased min-h-screen flex flex-col pt-32">
      <Header />
      
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/servicio/:id" element={<ServiceDetail />} />
          
          <Route path="/privacidad" element={<PrivacyPolicy />} />
          <Route path="/aviso-legal" element={<LegalNotice />} />
          <Route path="/cookies" element={<CookiesPolicy />} />
          
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      
      <Footer />
    </div>
  );
}

export default App;