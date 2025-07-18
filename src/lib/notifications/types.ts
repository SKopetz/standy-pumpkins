export type NotificationStatus = 'pending' | 'scheduled' | 'sent' | 'cancelled';

export interface NotificationRecord {
  id: string;
  volunteer_id: string;
  message_sid: string | null;
  status: NotificationStatus;
  scheduled_for: string | null;
  sent_at: string | null;
}