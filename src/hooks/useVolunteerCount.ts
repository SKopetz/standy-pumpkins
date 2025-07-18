import { useState, useCallback } from 'react';

interface UseVolunteerCountReturn {
  value: string;
  parsedValue: number;
  handleChange: (value: string) => void;
  error: string | null;
  validate: () => boolean;
}

export function useVolunteerCount(initialValue: number = 1): UseVolunteerCountReturn {
  const [value, setValue] = useState(initialValue.toString());
  const [lastValidValue, setLastValidValue] = useState(initialValue);
  const [error, setError] = useState<string | null>(null);

  const isValidNumber = (val: string): boolean => {
    const num = parseInt(val, 10);
    return !isNaN(num) && num > 0 && num <= 999;
  };

  const handleChange = useCallback((newValue: string) => {
    // Allow empty value during typing
    if (newValue === '') {
      setValue('');
      setError(null);
      return;
    }

    // Only allow digits
    if (!/^\d*$/.test(newValue)) {
      return;
    }

    setValue(newValue);
    setError(null);

    // Update lastValidValue if the new value is valid
    if (isValidNumber(newValue)) {
      setLastValidValue(parseInt(newValue, 10));
    }
  }, []);

  const validate = useCallback((): boolean => {
    if (value === '') {
      setValue(lastValidValue.toString());
      return true;
    }

    if (!isValidNumber(value)) {
      setError('Please enter a number between 1 and 999');
      setValue(lastValidValue.toString());
      return false;
    }

    return true;
  }, [value, lastValidValue]);

  return {
    value,
    parsedValue: value === '' ? lastValidValue : parseInt(value, 10),
    handleChange,
    error,
    validate
  };
}