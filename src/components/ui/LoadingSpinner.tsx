import React from 'react';

export function LoadingSpinner() {
  return (
    <div className="p-4 flex justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    </div>
  );
}