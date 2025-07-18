export interface PhoneInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  value: string;
  onChange: (value: string) => void;
  error?: boolean;
  label?: string;
}

export interface CursorPosition {
  position: number;
  shouldMove: boolean;
}