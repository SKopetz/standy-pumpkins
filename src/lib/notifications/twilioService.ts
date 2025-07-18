import { TWILIO_CONFIG } from '../twilio/config';

interface MessageOptions {
  to: string;
  body: string;
  scheduleType?: 'fixed';
  sendAt?: Date;
}

interface TwilioError {
  status: number;
  message: string;
  code?: string;
  more_info?: string;
}

async function getMessageStatus(messageSid: string): Promise<string> {
  try {
    const endpoint = `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_CONFIG.accountSid}/Messages/${messageSid}.json`;
    
    const response = await fetch(endpoint, {
      method: 'GET',
      headers: {
        'Authorization': `Basic ${btoa(`${TWILIO_CONFIG.accountSid}:${TWILIO_CONFIG.authToken}`)}`,
      }
    });

    if (!response.ok) {
      throw new Error('Failed to get message status');
    }

    const data = await response.json();
    return data.status;
  } catch (error) {
    console.error('Failed to get message status:', error);
    throw error;
  }
}

export async function scheduleMessage(options: MessageOptions): Promise<string> {
  try {
    const endpoint = `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_CONFIG.accountSid}/Messages.json`;
    
    // Validate required config
    if (!TWILIO_CONFIG.accountSid || !TWILIO_CONFIG.authToken || !TWILIO_CONFIG.phoneNumber) {
      console.warn('Missing required Twilio configuration');
      return '';
    }

    // Format phone number to E.164 format
    const formattedPhone = options.to.replace(/\D/g, '');
    const e164Phone = formattedPhone.startsWith('1') ? `+${formattedPhone}` : `+1${formattedPhone}`;

    const body = new URLSearchParams({
      To: e164Phone,
      From: TWILIO_CONFIG.phoneNumber,
      Body: options.body,
      ...(TWILIO_CONFIG.messagingServiceSid && { 
        MessagingServiceSid: TWILIO_CONFIG.messagingServiceSid 
      }),
      ...(options.scheduleType && { ScheduleType: options.scheduleType }),
      ...(options.sendAt && { SendAt: options.sendAt.toISOString() })
    });

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${btoa(`${TWILIO_CONFIG.accountSid}:${TWILIO_CONFIG.authToken}`)}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body
    });

    const data = await response.json();

    if (!response.ok) {
      const error = data as TwilioError;
      throw new Error(
        `Failed to send message: ${error.message}`
      );
    }

    return data.sid;
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error occurred';
    console.error('Twilio scheduling error:', message);
    return '';
  }
}

export async function cancelScheduledMessage(messageSid: string): Promise<void> {
  try {
    // Check message status first
    const status = await getMessageStatus(messageSid);
    
    // Only attempt to cancel if message is in a cancelable state
    if (!['scheduled', 'accepted', 'queued'].includes(status)) {
      console.log(`Message ${messageSid} is in ${status} state and cannot be cancelled`);
      return;
    }

    const endpoint = `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_CONFIG.accountSid}/Messages/${messageSid}.json`;
    
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${btoa(`${TWILIO_CONFIG.accountSid}:${TWILIO_CONFIG.authToken}`)}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        Status: 'canceled'
      })
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(`Failed to cancel message: ${data.message}`);
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error occurred';
    console.error('Failed to cancel message:', message);
    throw new Error(`Failed to cancel message: ${message}`);
  }
}