import React, { useState } from 'react';
import { X, Copy, Edit } from 'lucide-react';
import { useEventManagement } from '../../hooks/useEventManagement';
import { useEventTemplates } from '../../hooks/useEventTemplates';
import { FormInput } from '../ui/FormInput';
import { Button } from '../ui/Button';
import { Alert } from '../ui/Alert';

interface NewEventModalProps {
  onClose: () => void;
}

export function NewEventModal({ onClose }: NewEventModalProps) {
  const { createEvent, loading, error } = useEventManagement();
  const { templates, loading: templatesLoading } = useEventTemplates();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    eventDate: '',
    startTime: '',
    endTime: '',
    capacity: 2,
    category: 'Patch'
  });
  const [timeError, setTimeError] = useState<string | null>(null);
  const [useCustomTitle, setUseCustomTitle] = useState(true);
  const [useCustomDescription, setUseCustomDescription] = useState(true);
  const [dateError, setDateError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // Clear time error when either time field changes
    if (name === 'startTime' || name === 'endTime') {
      setTimeError(null);
    }

    if (name === 'eventDate') {
      const selectedDate = value;
      const today = new Date();

      if (selectedDate < today) {
        setDateError('Event date cannot be in the past');
      } else {
        setDateError(null);
      }
    }

    const parsedValue = e.target.type === 'number' ? parseInt(value) : value;
    setFormData(prev => ({ ...prev, [name]: parsedValue }));
  };

  const handleTemplateSelect = (field: 'title' | 'description', value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate times if both are provided
    if (formData.startTime && formData.endTime) {
      const start = new Date(`2000-01-01T${formData.startTime}`);
      const end = new Date(`2000-01-01T${formData.endTime}`);
      
      if (start >= end) {
        setTimeError('End time must be after start time');
        return;
      }
    }

    const selectedDate = formData.eventDate;
    const today = new Date();

    if (selectedDate < today) {
      setDateError('Event date cannot be in the past');
      return;
    }

    try {
      await createEvent({
        ...formData,
        eventDate: formData.eventDate,
        capacity: formData.capacity || null,
        startTime: formData.startTime || null,
        endTime: formData.endTime || null
      });
      onClose();
    } catch (err) {
      console.error('Failed to create event:', err);
    }
  };

  return (
    <div className="fixed inset-0 bg-dark/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="flex justify-between items-center p-4 border-b border-dark/10">
          <h2 className="text-xl font-semibold text-dark">Create New Event</h2>
          <button
            onClick={onClose}
            className="p-2 text-dark/60 hover:text-dark rounded-full hover:bg-light transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-dark/80">Title</label>
              <button
                type="button"
                onClick={() => setUseCustomTitle(!useCustomTitle)}
                className="text-sm text-primary flex items-center gap-1"
              >
                {useCustomTitle ? <Copy className="w-4 h-4" /> : <Edit className="w-4 h-4" />}
                {useCustomTitle ? 'Use Template' : 'Custom Title'}
              </button>
            </div>
            
            {useCustomTitle ? (
              <FormInput
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                disabled={loading}
              />
            ) : (
              <select
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-md border border-dark/10 bg-white text-dark"
                disabled={loading || templatesLoading}
                required
              >
                <option value="">Select a template</option>
                {templates.map((template, index) => (
                  template.title && (
                    <option key={index} value={template.title}>
                      {template.title}
                    </option>
                  )
                ))}
              </select>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-dark/80">Description</label>
              <button
                type="button"
                onClick={() => setUseCustomDescription(!useCustomDescription)}
                className="text-sm text-primary flex items-center gap-1"
              >
                {useCustomDescription ? <Copy className="w-4 h-4" /> : <Edit className="w-4 h-4" />}
                {useCustomDescription ? 'Use Template' : 'Custom Description'}
              </button>
            </div>

            {useCustomDescription ? (
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                className="w-full px-3 py-2 rounded-md border border-dark/10 bg-white text-dark"
                disabled={loading}
              />
            ) : (
              <select
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-md border border-dark/10 bg-white text-dark"
                disabled={loading || templatesLoading}
              >
                <option value="">Select a template</option>
                {templates.map((template, index) => (
                  template.description && (
                    <option key={index} value={template.description}>
                      {template.description}
                    </option>
                  )
                ))}
              </select>
            )}
          </div>

          <div className="space-y-1">
            <FormInput
              label="Date"
              type="date"
              name="eventDate"
              value={formData.eventDate}
              onChange={handleChange}
              required
              disabled={loading}
              error={dateError !== null}
            />
            {dateError && (
              <p className="text-sm text-red-600">{dateError}</p>
            )}
          </div>

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

          {timeError && (
            <p className="text-sm text-red-600">{timeError}</p>
          )}

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
            <Button type="submit" loading={loading} disabled={dateError !== null}>
              Create Event
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