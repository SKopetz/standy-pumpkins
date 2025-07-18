export const TWILIO_CONFIG = {
  accountSid: import.meta.env.VITE_TWILIO_ACCOUNT_SID,
  authToken: import.meta.env.VITE_TWILIO_AUTH_TOKEN,
  phoneNumber: import.meta.env.VITE_TWILIO_PHONE_NUMBER,
  messagingServiceSid: import.meta.env.VITE_TWILIO_MESSAGING_SERVICE_SID
} as const;