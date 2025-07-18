import { TWILIO_CONFIG } from '../twilio/config';

interface TwilioMessage {
  to: string;
  body: string;
  scheduleType?: 'fixed';
  sendAt?: Date;
}

export async function scheduleMessage(message: TwilioMessage): Promise<string> {
  const endpoint = `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_CONFIG.accountSid}/Messages.json`;
  
  const body = new URLSearchParams({
    To: message.to,
    From: TWILIO_CONFIG.phoneNumber,
    Body: message.body,
    MessagingServiceSid: TWILIO_CONFIG.messagingServiceSid,
    ...(message.scheduleType && { ScheduleType: message.scheduleType }),
    ...(message.sendAt && { SendAt: message.sendAt.toISOString() })
  });

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${btoa(`${TWILIO_CONFIG.accountSid}:${TWILIO_CONFIG.authToken}`)}`,
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body
  });

  if (!response.ok) {
    throw new Error('Failed to schedule message');
  }

  const data = await response.json();
  return data.sid;
}