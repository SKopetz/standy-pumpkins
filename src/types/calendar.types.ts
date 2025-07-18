export interface Event {
  id: string;
  title: string;
  description: string | null;
  eventDate: string;
  category: string;
  startTime?: string;
  endTime?: string;
  capacity?: number;
}

export interface DayWithEvents {
  date: Date;
  events: Event[];
  isOutsideMonth: boolean;
  isToday: boolean;
}