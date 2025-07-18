export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          firstName: string | null;
          lastName: string | null;
          email: string;
          phone: string | null;
          created_at: string;
          user_type: 'user' | 'admin';
        }
        Insert: {
          id?: string;
          firstName?: string | null;
          lastName?: string | null;
          email: string;
          phone?: string | null;
          created_at?: string;
          user_type?: 'user' | 'admin';
        }
        Update: {
          id?: string;
          firstName?: string | null;
          lastName?: string | null;
          email?: string;
          phone?: string | null;
          created_at?: string;
          user_type?: 'user' | 'admin';
        }
      }
      // ... other tables
    }
  }
}