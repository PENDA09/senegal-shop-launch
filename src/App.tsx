import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Landing from './components/Landing';
import Dashboard from './components/Dashboard';
import Storefront from './components/Storefront';
import Onboarding from './components/Onboarding';
import ResetPassword from './components/ResetPassword';
import ResetPasswordToken from './components/ResetPasswordToken';
import { StoreProvider } from './context/StoreContext';
import { Toaster } from 'sonner';

const TitleUpdater = () => {
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === '/') {
      document.title = 'Sunuboutique - Vendez sur WhatsApp';
    } else if (location.pathname === '/dashboard') {
      document.title = 'Tableau de bord - Sunuboutique';
    } else if (location.pathname === '/onboarding') {
      document.title = 'Créer ma boutique - Sunuboutique';
    } else if (location.pathname === '/forgot-password') {
      document.title = 'Réinitialiser mon mot de passe - Sunuboutique';
    } else if (location.pathname === '/reset-password') {
      document.title = 'Nouveau mot de passe - Sunuboutique';
    }
  }, [location]);

  return null;
};

const App: React.FC = () => {
  return (
    <StoreProvider>
      <Router>
        <TitleUpdater />
        <div className="min-h-screen bg-slate-50 font-['Poppins',_sans-serif] text-slate-900">
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/onboarding" element={<Onboarding onComplete={() => window.location.href = '/dashboard'} />} />
            <Route path="/dashboard" element={<Dashboard onLogout={() => window.location.href = '/'} onPreview={() => window.open('/shop/demo', '_blank')} />} />
            <Route path="/shop/:slug" element={<Storefront />} />
            <Route path="/forgot-password" element={<ResetPassword />} />
            <Route path="/reset-password" element={<ResetPasswordToken />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          <Toaster position="top-right" richColors />
        </div>
      </Router>
    </StoreProvider>
  );
};

export default App;