import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { AuthProvider } from './contexts/AuthContext';
import { KioskProvider } from './contexts/KioskContext';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <KioskProvider>
      <AuthProvider>
        <App />
      </AuthProvider>
    </KioskProvider>
  </StrictMode>
);