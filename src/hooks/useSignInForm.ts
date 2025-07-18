import { useState, ChangeEvent, FormEvent } from 'react';
import { useAuth } from './useAuth';
import { AUTH_ERRORS } from '../lib/auth/errors';

export function useSignInForm() {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    setError(null);
    setMessage('');
    setShowSignUp(false);
  };

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = async (e: FormEvent): Promise<boolean> => {
    e.preventDefault();
    setMessage('');
    setError(null);
    setShowSignUp(false);

    if (!validateEmail(email)) {
      setError(AUTH_ERRORS.INVALID_EMAIL);
      return false;
    }

    setIsSubmitting(true);
    try {
      const success = await signIn(email);
      if (success) {
        setMessage('Successfully signed in!');
        setEmail('');
        return true;
      }
      setShowSignUp(true);
      return false;
    } catch (err) {
      setError(err instanceof Error ? err.message : AUTH_ERRORS.SERVER_ERROR);
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    email,
    message,
    error,
    isSubmitting,
    showSignUp,
    handleChange,
    handleSubmit
  };
}