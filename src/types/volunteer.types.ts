export interface Volunteer {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  group_size: number;
  event_id: string;
  created_at: string;
}

export interface VolunteerWithEvent extends Volunteer {
  event: {
    id: string;
    title: string;
    eventDate: string;
    category: string;
  };
}