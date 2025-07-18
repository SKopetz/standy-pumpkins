import { useState } from 'react';
import { supabase } from '../lib/supabase';
import type { OnCloseFunction } from '../types/modal.types';

export function useDeleteUser(onClose: OnCloseFunction) {
  const [loading, setLoading] = useState(false);

  const deleteUser = async (userId: string) => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', userId);

      if (error) throw error;
      await onClose();
    } catch (err) {
      console.error('Error deleting user:', err);
      // Re-throw to be handled by the UI
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { deleteUser, loading };
}