import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { FormInput } from '../ui/FormInput';
import { Button } from '../ui/Button';
import { Alert } from '../ui/Alert';
import { useVolunteerCount } from '../../hooks/useVolunteerCount';
import type { Event } from '../../types/calendar.types';
import type { Profile } from '../../types/profile.types';

interface AdminVolunteerFormProps {
  event: Event;
  onClose: () => void;
  onSuccess: (data: any) => void;
}

interface UserProfile extends Profile {
  fullName: string;
}

export function AdminVolunteerForm({ event, onClose, onSuccess }: AdminVolunteerFormProps) {
  const [profiles, setProfiles] = useState<UserProfile[]>([]);
  const [selectedProfile, setSelectedProfile] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const volunteerCount = useVolunteerCount(1);

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('id, firstName, lastName, email, phone')
          .order('lastName', { ascending: true });

        if (error) throw error;

        const formattedProfiles = (data || []).map(profile => ({
          ...profile,
          fullName: `${profile.lastName}, ${profile.firstName}`
        }));

        setProfiles(formattedProfiles);
      } catch (err) {
        console.error('Error fetching profiles:', err);
        setError('Failed to load user profiles');
      }
    };

    fetchProfiles();
  }, []);

  const selectedUser = profiles.find(p => p.id === selectedProfile);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;

    try {
      setLoading(true);
      setError(null);

      const registrationData = {
        firstName: selectedUser.firstName,
        lastName: selectedUser.lastName,
        email: selectedUser.email,
        phone: selectedUser.phone,
        groupSize: volunteerCount.parsedValue
      };

      onSuccess(registrationData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to register volunteer');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-1">
        <label className="block text-sm font-medium text-dark/80">
          Select User
        </label>
        <select
          value={selectedProfile}
          onChange={(e) => setSelectedProfile(e.target.value)}
          className="w-full px-3 py-2 rounded-md border border-dark/10 bg-white text-dark"
          required
        >
          <option value="">Select a user...</option>
          {profiles.map((profile) => (
            <option key={profile.id} value={profile.id}>
              {profile.fullName}
            </option>
          ))}
        </select>
      </div>

      {selectedUser && (
        <>
          <FormInput
            label="Email"
            value={selectedUser.email || ''}
            readOnly
            disabled
          />

          <FormInput
            label="Phone"
            value={selectedUser.phone || ''}
            readOnly
            disabled
          />

          <FormInput
            label="Number of Volunteers"
            type="text"
            name="groupSize"
            value={volunteerCount.value}
            onChange={(e) => volunteerCount.handleChange(e.target.value)}
            required
            error={volunteerCount.error !== null}
          />
        </>
      )}

      {error && <Alert variant="error">{error}</Alert>}

      <div className="flex gap-4">
        <Button type="submit" loading={loading} disabled={!selectedUser}>
          Register User
        </Button>
        <Button type="button" variant="secondary" onClick={onClose}>
          Cancel
        </Button>
      </div>
    </form>
  );
}