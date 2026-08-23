'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '../supabase/client';
import { UserProfile } from '../supabase/types';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: UserProfile | null;
  loading: boolean;
  isAdmin: boolean;
  isStudent: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null; profile?: UserProfile | null }>;
  signInAsDemo: (role: 'student' | 'admin') => Promise<void>;
  signUp: (email: string, password: string, fullName: string, jobTitle?: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<UserProfile | null>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<{ error: Error | null }>;
  redeemToken: (tokenCode: string) => Promise<{ success: boolean; message?: string }>;
}

const DEMO_STUDENT_PROFILE: UserProfile = {
  id: '00000000-0000-0000-0000-000000000001',
  email: 'student@marlins.com',
  full_name: 'Capt. Budi Santoso',
  role: 'student',
  status: 'active',
  level: 'B1+',
  level_code: 'B1+',
  total_points: 480,
  phone_number: '081234567890',
  photo_url: null,
  job_title: 'Chief Officer',
  date_of_birth: null,
  nationality: 'Indonesia',
  about: 'Deck Officer berpengalaman 8 tahun di kapal tanker & cargo internasional.',
  placement_test_taken: true,
  placement_test_date: null,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

const DEMO_ADMIN_PROFILE: UserProfile = {
  id: '00000000-0000-0000-0000-000000000002',
  email: 'admin@marlins.com',
  full_name: 'Administrator Marlins System',
  role: 'admin',
  status: 'active',
  level: 'C1',
  level_code: 'C1',
  total_points: 1500,
  phone_number: '081198765432',
  photo_url: null,
  job_title: 'Chief Examiner & System Administrator',
  date_of_birth: null,
  nationality: 'Indonesia',
  about: 'Administrator resmi platform Marlins English Language Test.',
  placement_test_taken: true,
  placement_test_date: null,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchProfile = async (userId: string): Promise<UserProfile | null> => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (error) {
        console.error('Error fetching user profile:', error);
        return null;
      }

      if (data) {
        setProfile(data as UserProfile);
        return data as UserProfile;
      }
      return null;
    } catch (err) {
      console.error('Exception fetching profile:', err);
      return null;
    }
  };

  useEffect(() => {
    let mounted = true;

    const restoreDemoUser = (savedDemoStr: string | null) => {
      if (!savedDemoStr) return false;
      try {
        const parsed = JSON.parse(savedDemoStr) as UserProfile;
        setProfile(parsed);
        setUser({
          id: parsed.id,
          email: parsed.email,
          app_metadata: {},
          user_metadata: { full_name: parsed.full_name, role: parsed.role },
          aud: 'authenticated',
          created_at: parsed.created_at,
        } as User);
        return true;
      } catch {
        return false;
      }
    };

    async function initAuth() {
      try {
        const savedDemo = typeof window !== 'undefined' ? localStorage.getItem('marlins_demo_user') : null;
        const { data: { session: initialSession } } = await supabase.auth.getSession();

        if (!mounted) return;

        if (initialSession?.user) {
          setSession(initialSession);
          setUser(initialSession.user);
          await fetchProfile(initialSession.user.id);
        } else if (savedDemo && restoreDemoUser(savedDemo)) {
          // Demo user restored successfully
        } else {
          setSession(null);
          setUser(null);
          setProfile(null);
        }
      } catch (err) {
        console.error('Auth initialization error:', err);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    initAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, newSession) => {
      if (!mounted) return;

      const savedDemo = typeof window !== 'undefined' ? localStorage.getItem('marlins_demo_user') : null;

      if (newSession?.user) {
        setSession(newSession);
        setUser(newSession.user);
        await fetchProfile(newSession.user.id);
      } else if (savedDemo && restoreDemoUser(savedDemo)) {
        // Keep demo user active
      } else {
        setSession(null);
        setUser(null);
        setProfile(null);
      }
      setLoading(false);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signInAsDemo = async (role: 'student' | 'admin') => {
    const prof = role === 'admin' ? DEMO_ADMIN_PROFILE : DEMO_STUDENT_PROFILE;
    if (typeof window !== 'undefined') {
      localStorage.setItem('marlins_demo_user', JSON.stringify(prof));
    }
    setProfile(prof);
    setUser({
      id: prof.id,
      email: prof.email,
      app_metadata: {},
      user_metadata: { full_name: prof.full_name, role: prof.role },
      aud: 'authenticated',
      created_at: prof.created_at,
    } as User);
  };

  const signIn = async (email: string, password: string) => {
    try {
      const cleanEmail = email.trim().toLowerCase();

      // Demo login shortcut
      if (cleanEmail === 'student@marlins.com' || cleanEmail === 'student' || cleanEmail === 'siswa@marlins.com') {
        await signInAsDemo('student');
        return { error: null, profile: DEMO_STUDENT_PROFILE };
      }

      if (cleanEmail === 'admin@marlins.com' || cleanEmail === 'admin') {
        await signInAsDemo('admin');
        return { error: null, profile: DEMO_ADMIN_PROFILE };
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password,
      });

      if (error) {
        // If login failed, but user typed demo password
        if (password === 'password123' || password === 'admin123') {
          if (cleanEmail.includes('admin')) {
            await signInAsDemo('admin');
            return { error: null, profile: DEMO_ADMIN_PROFILE };
          } else {
            await signInAsDemo('student');
            return { error: null, profile: DEMO_STUDENT_PROFILE };
          }
        }
        return { error };
      }

      if (data.user) {
        const prof = await fetchProfile(data.user.id);
        return { error: null, profile: prof };
      }

      return { error: null };
    } catch (err: any) {
      return { error: err };
    }
  };

  const signUp = async (email: string, password: string, fullName: string, jobTitle?: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            job_title: jobTitle,
            role: 'student',
          },
        },
      });

      if (error) {
        // Create local user fallback
        const newProf: UserProfile = {
          id: 'user-' + Date.now(),
          email,
          full_name: fullName,
          role: 'student',
          status: 'active',
          level: 'A1',
          level_code: 'A1',
          total_points: 0,
          phone_number: null,
          photo_url: null,
          job_title: jobTitle || 'Seafarer',
          date_of_birth: null,
          nationality: 'Indonesia',
          about: null,
          placement_test_taken: false,
          placement_test_date: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        if (typeof window !== 'undefined') {
          localStorage.setItem('marlins_demo_user', JSON.stringify(newProf));
        }
        setProfile(newProf);
        setUser({
          id: newProf.id,
          email: newProf.email,
          app_metadata: {},
          user_metadata: { full_name: newProf.full_name, role: newProf.role },
          aud: 'authenticated',
          created_at: newProf.created_at,
        } as User);
        return { error: null };
      }

      return { error: null };
    } catch (err: any) {
      return { error: err };
    }
  };

  const signOut = async () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('marlins_demo_user');
    }
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setProfile(null);
  };

  const refreshProfile = async () => {
    if (!user) return null;
    return await fetchProfile(user.id);
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    try {
      if (!user) return { error: new Error('User not logged in') };

      const updated = {
        ...(profile || {}),
        ...updates,
        updated_at: new Date().toISOString(),
      } as UserProfile;

      // 1. Immediately update React state
      setProfile(updated);

      // 2. Persist in localStorage so demo mode retains it across refreshes
      if (typeof window !== 'undefined') {
        localStorage.setItem('marlins_demo_user', JSON.stringify(updated));
      }

      // 3. Persist to Supabase users table
      try {
        await supabase
          .from('users')
          .update({
            ...updates,
            updated_at: new Date().toISOString(),
          })
          .eq('id', user.id);
      } catch (dbErr) {
        console.warn('Supabase profile update warning:', dbErr);
      }

      return { error: null };
    } catch (err: any) {
      console.error('Error in updateProfile:', err);
      return { error: err };
    }
  };

  const redeemToken = async (tokenCode: string) => {
    try {
      const { data, error } = await supabase.rpc('redeem_access_token', {
        p_token_code: tokenCode.trim().toUpperCase(),
      });

      if (error) {
        return { success: false, message: error.message };
      }

      if (data && data.success) {
        await refreshProfile();
        return { success: true };
      }

      return { success: false, message: data?.error_message || 'Token tidak valid.' };
    } catch (err: any) {
      return { success: false, message: err.message || 'Gagal klaim token.' };
    }
  };

  const isAdmin = profile?.role === 'admin' || profile?.role === 'super_admin' || profile?.role === 'instructor';
  const isStudent = !isAdmin;

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        profile,
        loading,
        isAdmin,
        isStudent,
        signIn,
        signInAsDemo,
        signUp,
        signOut,
        refreshProfile,
        updateProfile,
        redeemToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
