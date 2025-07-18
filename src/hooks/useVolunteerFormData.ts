import { useState, useEffect } from 'react';
import { useAuthContext } from '../contexts/AuthContext';
import type { Volunteer } from '../types/volunteer.types';

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  groupSize: number;
}

export function useVolunteerFormData(existingVolunteer: Volunteer | null) {
  const { profile } = useAuthContext();
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    groupSize: 1
  });

  useEffect(() => {
    // Priority: existing volunteer > profile > empty
    setFormData({
      firstName: existingVolunteer?.first_name || profile?.firstName || '',
      lastName: existingVolunteer?.last_name || profile?.lastName || '',
      email: existingVolunteer?.email || profile?.email || '',
      phone: existingVolunteer?.phone || profile?.phone || '',
      groupSize: existingVolunteer?.group_size || 1
    });
  }, [existingVolunteer, profile]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'groupSize') {
      const numValue = value.replace(/[^0-9]/g, '');
      const parsedValue = parseInt(numValue, 10);
      if (!isNaN(parsedValue)) {
        setFormData(prev => ({
          ...prev,
          [name]: Math.max(1, Math.min(parsedValue, 999))
        }));
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handlePhoneChange = (value: string) => {
    setFormData(prev => ({ ...prev, phone: value }));
  };

  return {
    formData,
    handleChange,
    handlePhoneChange
  };
}