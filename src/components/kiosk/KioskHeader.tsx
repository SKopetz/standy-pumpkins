import React from 'react';
import { useLocation } from 'react-router-dom';

export function KioskHeader() {
  const location = useLocation();
  const currentUrl = window.location.origin + location.pathname;

  return (
    <header className="bg-dark text-light shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-xl sm:text-3xl font-bold leading-tight">
              St. Andrew's Episcopal Church
            </h1>
            <p className="text-sm sm:text-base mt-1 text-light/80">
              Scan the QR code with your phone to sign up for a shift, or visit https://pumpkinchurch.com/pumpkinsignup
            </p>
          </div>
          
          <div className="flex items-center justify-center" aria-label="QR Code for volunteer signup">
            <img
              src={`https://api.qrserver.com/v1/create-qr-code/?size=90x90&data=${encodeURIComponent(currentUrl)}`}
              alt="Scan to volunteer"
              className="w-[60px] h-[60px] sm:w-[90px] sm:h-[90px] bg-white p-2 rounded-lg"
              loading="eager"
            />
          </div>
        </div>
      </div>
    </header>
  );
}