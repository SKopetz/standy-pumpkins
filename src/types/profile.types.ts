export interface Profile {
  id: string;
  firstName: string | null;
  lastName: string | null;
  phone: string | null;
  email: string | null;
  created_at: string;
  user_type: 'user' | 'admin';
}