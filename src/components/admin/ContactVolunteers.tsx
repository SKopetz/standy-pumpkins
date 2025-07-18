import React, { useState } from 'react';
import { Button } from '../ui/Button';
import { Alert } from '../ui/Alert';

export function ContactVolunteers() {
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setStatus(null);

    try {
      // TODO: Implement email sending functionality
      await new Promise(resolve => setTimeout(resolve, 1000));
      setStatus({ 
        type: 'success', 
        message: 'Message sent successfully to all volunteers' 
      });
      setSubject('');
      setMessage('');
    } catch (error) {
      setStatus({ 
        type: 'error', 
        message: 'Failed to send message. Please try again.' 
      });
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-dark mb-6">Contact Volunteers</h1>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="subject" className="block text-sm font-medium text-dark/80 mb-1">
            Subject
          </label>
          <input
            id="subject"
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="w-full px-3 py-2 border border-dark/10 rounded-md"
            required
          />
        </div>

        <div>
          <label htmlFor="message" className="block text-sm font-medium text-dark/80 mb-1">
            Message
          </label>
          <textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={6}
            className="w-full px-3 py-2 border border-dark/10 rounded-md"
            required
          />
        </div>

        {status && (
          <Alert variant={status.type}>
            {status.message}
          </Alert>
        )}

        <Button type="submit" loading={sending}>
          Send Message
        </Button>
      </form>
    </div>
  );
}