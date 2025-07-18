export interface AuthProfile {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  phone: string | null;
  created_at: string;
  user_type: 'user' | 'admin';
  smspreference: boolean;
}

export interface AuthState {
  profile: AuthProfile | null;
  loading: boolean;
  error: string | null;
}

export interface ProfileFormData {
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  user_type?: 'user' | 'admin';
  smspreference: boolean;
}