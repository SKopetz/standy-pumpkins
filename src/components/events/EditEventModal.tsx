import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useEventManagement } from '../../hooks/useEventManagement';
import { FormInput } from '../ui/FormInput';
import { Button } from '../ui/Button';
import { Alert } from '../ui/Alert';
import type { Event } from '../../types/calendar.types';

interface EditEventModalProps {
  event: Event;
  onClose: () => void;
}

export function EditEventModal({ event, onClose }: EditEventModalProps) {
  const { updateEvent, loading, error } = useEventManagement();
  const [formData, setFormData] = useState({
    title: event.title,
    description: event.description || '',
    eventDate: event.eventDate,
    startTime: event.startTime || '',
    endTime: event.endTime || '',
    capacity: event.capacity || 1,
    category: event.category
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const value = e.target.type === 'number' ? parseInt(e.target.value) : e.target.value;
    setFormData(prev => ({ ...prev, [e.target.name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateEvent(event.id, formData);
      onClose();
    } catch (err) {
      // Error is handled by the hook
      console.error('Failed to update event:', err);
    }
  };

  return (
    <div className="fixed inset-0 bg-dark/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="flex justify-between items-center p-4 border-b border-dark/10">
          <h2 className="text-xl font-semibold text-dark">Edit Event</h2>
          <button
            onClick={onClose}
            className="p-2 text-dark/60 hover:text-dark rounded-full hover:bg-light transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <FormInput
            label="Title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            disabled={loading}
          />

          <div className="space-y-1">
            <label className="block text-sm font-medium text-dark/80">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className="w-full px-3 py-2 rounded-md border border-dark/10 bg-white text-dark"
              disabled={loading}
            />
          </div>

          <FormInput
            label="Date"
            type="date"
            name="eventDate"
            value={formData.eventDate}
            onChange={handleChange}
            required
            disabled={loading}
          />

          <div className="grid grid-cols-2 gap-4">
            <FormInput
              label="Start Time"
              type="time"
              name="startTime"
              value={formData.startTime}
              onChange={handleChange}
              disabled={loading}
            />
            <FormInput
              label="End Time"
              type="time"
              name="endTime"
              value={formData.endTime}
              onChange={handleChange}
              disabled={loading}
            />
          </div>

          <FormInput
            label="Capacity"
            type="number"
            name="capacity"
            value={formData.capacity}
            onChange={handleChange}
            min={1}
            disabled={loading}
          />

          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-dark/80">Category:</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="px-3 py-2 rounded-md border border-dark/10 bg-white text-dark"
              disabled={loading}
              required
            >
              <option value="Patch">Patch</option>
              <option value="Closing">Closing</option>
              <option value="Staff">Staff</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {error && <Alert variant="error">{error}</Alert>}

          <div className="flex gap-4">
            <Button type="submit" loading={loading}>
              Save Changes
            </Button>
            <Button type="button" variant="secondary" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}