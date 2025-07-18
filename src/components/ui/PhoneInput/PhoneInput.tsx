import React, { useRef, useEffect } from 'react';
import { formatPhoneNumber, unformatPhoneNumber, getFormattedCursorPosition } from './formatters';
import { isValidPhoneNumber } from './validators';
import type { PhoneInputProps } from './types';

export function PhoneInput({
  value,
  onChange,
  error,
  label,
  disabled,
  className = '',
  ...props
}: PhoneInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const previousValueRef = useRef(value);

  useEffect(() => {
    previousValueRef.current = value;
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target;
    const selectionStart = input.selectionStart || 0;
    const unformattedValue = unformatPhoneNumber(input.value);
    const formattedValue = formatPhoneNumber(unformattedValue);
    
    onChange(formattedValue);

    // Handle cursor position after React re-renders
    requestAnimationFrame(() => {
      if (inputRef.current) {
        const { position, shouldMove } = getFormattedCursorPosition(
          previousValueRef.current,
          formattedValue,
          selectionStart
        );
        
        if (shouldMove) {
          inputRef.current.setSelectionRange(position, position);
        }
      }
    });
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData('text');
    const unformattedValue = unformatPhoneNumber(pastedText);
    const formattedValue = formatPhoneNumber(unformattedValue);
    onChange(formattedValue);
  };

  const isValid = value ? isValidPhoneNumber(value) : true;
  const showError = error || (value && !isValid);

  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-dark/80">
          {label}
        </label>
      )}
      <input
        ref={inputRef}
        type="tel"
        value={value}
        onChange={handleChange}
        onPaste={handlePaste}
        placeholder="(XXX) XXX-XXXX"
        disabled={disabled}
        className={`
          w-full px-3 py-2 rounded-md border
          ${showError 
            ? 'border-red-500 focus:ring-red-500 focus:border-red-500' 
            : 'border-dark/10 focus:ring-primary/50 focus:border-primary'
          }
          bg-white text-dark
          focus:outline-none focus:ring-2
          disabled:bg-light-hover disabled:cursor-not-allowed
          ${className}
        `}
        {...props}
      />
      {showError && (
        <p className="text-sm text-red-500">
          Please enter a valid phone number
        </p>
      )}
    </div>
  );
}