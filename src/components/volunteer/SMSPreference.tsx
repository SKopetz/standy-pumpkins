import React from 'react';

interface SMSPreferenceProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}

export function SMSPreference({ checked, onChange, disabled }: SMSPreferenceProps) {
  return (
    <div className="flex items-start gap-2">
      <input
        type="checkbox"
        id="sms-preference"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        disabled={disabled}
        className="mt-1 h-4 w-4 rounded border-dark/20 text-primary focus:ring-primary/50"
      />
      <label htmlFor="sms-preference" className="text-sm text-dark/70">
        Yes, I would like to receive text message reminders
        <br />
        <span className="text-xs">
          Message & data rates may apply. You can opt out at any time.
        </span>
      </label>
    </div>
  );
}