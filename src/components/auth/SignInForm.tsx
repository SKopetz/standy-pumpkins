import React from 'react';
import { useSignInForm } from '../../hooks/useSignInForm';
import { FormInput } from '../ui/FormInput';
import { Button } from '../ui/Button';
import { Alert } from '../ui/Alert';
import { Divider } from '../ui/Divider';

interface SignInFormProps {
  onSuccess?: () => void;
  onSwitchToSignUp: () => void;
  onClose: () => void;
}

export function SignInForm({ onSuccess, onSwitchToSignUp, onClose }: SignInFormProps) {
  const {
    email,
    message,
    error,
    isSubmitting,
    showSignUp,
    handleChange,
    handleSubmit: submit
  } = useSignInForm();

  const handleSubmit = async (e: React.FormEvent) => {
    const success = await submit(e);
    if (success && onSuccess) {
      onSuccess();
    }
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <FormInput
          type="email"
          id="email"
          label="Email"
          value={email}
          onChange={handleChange}
          required
          disabled={isSubmitting}
        />
        <Button type="submit" loading={isSubmitting}>
          Sign In with Email
        </Button>
      </form>
      
      {message && <Alert variant="success">{message}</Alert>}
      {error && <Alert variant="error">{error}</Alert>}
      
      <div className="pt-4 text-center space-y-4">
        <Divider>
          <span className={showSignUp ? 'text-red-600 font-medium' : ''}>
            {showSignUp ? 'No user found' : "Don't have an account?"}
          </span>
        </Divider>

        <Button 
          variant="secondary" 
          onClick={onSwitchToSignUp}
          disabled={isSubmitting}
        >
          Create an Account
        </Button>
      </div>
    </div>
  );
}