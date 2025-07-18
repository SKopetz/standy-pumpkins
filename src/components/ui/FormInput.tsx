import React from 'react';

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: boolean;
}

export function FormInput({ label, id, error, className = '', ...props }: FormInputProps) {
  return (
    <div>
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-dark/80 mb-1">
          {label}
        </label>
      )}
      <input
        id={id}
        {...props}
        className={`
          w-full px-3 py-2 rounded-md border
          ${error 
            ? 'border-red-500 focus:ring-red-500 focus:border-red-500' 
            : 'border-dark/10 focus:ring-primary/50 focus:border-primary'
          }
          bg-white text-dark
          focus:outline-none focus:ring-2
          disabled:bg-light-hover disabled:cursor-not-allowed
          ${className}
        `}
      />
    </div>
  );
}