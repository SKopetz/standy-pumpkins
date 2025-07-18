export interface Event {
  id: string;
  title: string;
  description: string | null;
  eventDate: string;
  category: 'Patch' | 'Closing' | 'Staff' | 'Other';
  created_at: string;
}