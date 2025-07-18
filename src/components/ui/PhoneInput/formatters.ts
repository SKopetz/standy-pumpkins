import { CursorPosition } from './types';

export function formatPhoneNumber(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 10);
  
  if (digits.length === 0) return '';
  if (digits.length <= 3) return `(${digits}`;
  if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
}

export function unformatPhoneNumber(value: string): string {
  return value.replace(/\D/g, '');
}

export function getFormattedCursorPosition(
  previousValue: string,
  newValue: string,
  currentPosition: number
): CursorPosition {
  const isDeleting = previousValue.length > newValue.length;
  const unformattedPosition = unformatPhoneNumber(newValue.slice(0, currentPosition)).length;
  
  // Handle special cases for cursor positioning
  if (isDeleting) {
    if (newValue[currentPosition - 1] === ' ' || 
        newValue[currentPosition - 1] === ')' || 
        newValue[currentPosition - 1] === '-') {
      return { position: currentPosition - 1, shouldMove: true };
    }
  } else {
    if (unformattedPosition === 3) return { position: currentPosition + 2, shouldMove: true };
    if (unformattedPosition === 6) return { position: currentPosition + 1, shouldMove: true };
  }
  
  return { position: currentPosition, shouldMove: false };
}