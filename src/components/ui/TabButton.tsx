import React from 'react';

interface TabButtonProps {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}

export function TabButton({ active, onClick, children }: TabButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-md transition-colors ${
        active
          ? 'bg-primary text-dark font-medium'
          : 'bg-light-hover text-dark/70 hover:bg-light-hover hover:text-dark'
      }`}
    >
      {children}
    </button>
  );
}