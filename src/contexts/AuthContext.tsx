import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Session, AuthError } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isPremium: boolean;
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signUp: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signOut: () => Promise<{ error: AuthError | null }>;
  updatePremiumStatus: (isPremium: boolean) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isPremium, setIsPremium] = useState(false);

  // Check if user has premium access
  const checkPremiumStatus = async (user: User | null) => {
    if (!user) {
      setIsPremium(false);
      return;
    }

    const { data, error } = await supabase
      .from('user_profiles')
      .select('is_premium')
      .eq('id', user.id)
      .maybeSingle();

    if (error) {
      console.error('Error checking premium status:', error);
      setIsPremium(false);
      return;
    }

    if (!data) {
      await supabase
        .from('user_profiles')
        .insert({ id: user.id, is_premium: false });
      setIsPremium(false);
      return;
    }

    setIsPremium(data.is_premium || false);
  };

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      checkPremiumStatus(session?.user ?? null);
      setLoading(false);
    }).catch((error) => {
      console.error('Session check failed:', error);
      // Clear invalid tokens by signing out
      supabase.auth.signOut();
      setSession(null);
      setUser(null);
      setIsPremium(false);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      checkPremiumStatus(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { error };
  };

  const signUp = async (email: string, password: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });
    return { error };
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    return { error };
  };

  const updatePremiumStatus = async (isPremium: boolean) => {
    if (!user) return;

    const { error } = await supabase
      .from('user_profiles')
      .upsert({
        id: user.id,
        is_premium: isPremium,
        updated_at: new Date().toISOString()
      });

    if (error) {
      console.error('Error updating premium status:', error);
      return;
    }

    setIsPremium(isPremium);
  };

  const value = {
    user,
    session,
    loading,
    isPremium,
    signIn,
    signUp,
    signOut,
    updatePremiumStatus,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};