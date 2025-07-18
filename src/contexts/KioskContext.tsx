import React, { createContext, useContext } from 'react';
import { useKioskMode } from '../hooks/useKioskMode';

interface KioskContextType {
  isKioskMode: boolean;
}

const KioskContext = createContext<KioskContextType | null>(null);

export function KioskProvider({ children }: { children: React.ReactNode }) {
  const isKioskMode = useKioskMode();

  return (
    <KioskContext.Provider value={{ isKioskMode }}>
      {children}
    </KioskContext.Provider>
  );
}

export function useKioskContext() {
  const context = useContext(KioskContext);
  if (!context) {
    throw new Error('useKioskContext must be used within a KioskProvider');
  }
  return context;
}