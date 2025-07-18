import React from 'react';
import { Info } from 'lucide-react';

interface InfoBannerProps {
  message: string;
}

export function InfoBanner({ message }: InfoBannerProps) {
  return (
    <div className="flex items-center gap-2 px-4 py-2 bg-primary/10 text-dark rounded-lg">
      <Info className="w-5 h-5 text-primary shrink-0" />
      <p className="text-sm">{message}</p>
    </div>
  );
}