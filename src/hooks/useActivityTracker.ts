import { useCallback, useRef } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../contexts/AuthContext';

const DEBOUNCE_MS = 60_000;

export const useActivityTracker = () => {
  const { user } = useAuth();
  const lastUpdateRef = useRef<number>(0);

  const updateLastActive = useCallback(async () => {
    if (!user?.id) return;
    const now = Date.now();
    if (now - lastUpdateRef.current < DEBOUNCE_MS) return;
    lastUpdateRef.current = now;
    await supabase
      .from('facial_profiles')
      .update({ last_active_at: new Date().toISOString() })
      .eq('user_id', user.id);
    console.log('Activity tracked:', user.id);
  }, [user?.id]);

  return { updateLastActive };
};
