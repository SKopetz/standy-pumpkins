import React from 'react';

interface DividerProps {
  children?: React.ReactNode;
  className?: string;
}

export function Divider({ children, className = '' }: DividerProps) {
  return (
    <div className={`relative ${className}`}>
      <div className="absolute inset-0 flex items-center">
        <div className="w-full border-t border-dark/10"></div>
      </div>
      {children && (
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-light text-dark/60">
            {children}
          </span>
        </div>
      )}
    </div>
  );
}