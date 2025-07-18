import React from 'react';

interface AlertProps {
  children: React.ReactNode;
  variant: 'success' | 'error';
}

export function Alert({ children, variant }: AlertProps) {
  const variants = {
    success: 'bg-green-50 text-green-800 border-green-200',
    error: 'bg-red-50 text-red-800 border-red-200'
  };

  return (
    <div className={`p-4 rounded-md border ${variants[variant]}`}>
      {children}
    </div>
  );
}