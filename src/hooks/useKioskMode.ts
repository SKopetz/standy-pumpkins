import { useState, useEffect } from 'react';

export function useKioskMode() {
  const [isKioskMode, setIsKioskMode] = useState(false);

  useEffect(() => {
    // Check URL parameters
    const params = new URLSearchParams(window.location.search);
    const kioskParam = params.get('kiosk');
    setIsKioskMode(kioskParam === 'true');

    // Listen for URL changes
    const handleUrlChange = () => {
      const newParams = new URLSearchParams(window.location.search);
      setIsKioskMode(newParams.get('kiosk') === 'true');
    };

    window.addEventListener('popstate', handleUrlChange);
    return () => window.removeEventListener('popstate', handleUrlChange);
  }, []);

  return isKioskMode;
}