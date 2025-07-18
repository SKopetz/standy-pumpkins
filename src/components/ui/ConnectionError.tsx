import React from 'react';
import { WifiOff } from 'lucide-react';

interface ConnectionErrorProps {
  message?: string;
}

export function ConnectionError({ message = 'Unable to connect to the server' }: ConnectionErrorProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-dark/70">
      <WifiOff className="w-12 h-12 mb-4" />
      <p className="text-lg font-medium">{message}</p>
      <p className="mt-2 text-sm">Please check your connection and try again</p>
    </div>
  );
}