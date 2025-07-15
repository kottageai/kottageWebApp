"use client";
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { useRouter, usePathname } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';

interface Profile {
  id: string;
  full_name: string | null;
  phone: string | null;
  address: string | null;
  created_at: string;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  isProvider: boolean;
  loading: boolean;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  profile: null,
  isProvider: false,
  loading: true,
  signOut: async () => {},
  refreshProfile: async () => {},
});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isProvider, setIsProvider] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  const checkProfile = async (currentUser: User) => {
    try {
      // Check if profile exists
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', currentUser.id)
        .single();

      if (profileError && profileError.code !== 'PGRST116') {
        console.error('Error fetching profile:', profileError);
        return;
      }

      setProfile(profileData);

      // Check if user is a provider
      const { data: providerData } = await supabase
        .from('providers')
        .select('id')
        .eq('id', currentUser.id)
        .single();

      setIsProvider(!!providerData);

      // Redirect incomplete profiles to signup page for profile completion
      // But avoid redirect loops and allow access to auth pages
      const authPages = ['/auth/login', '/auth/signup'];
      const isOnAuthPage = authPages.some(page => pathname.startsWith(page));

      if (!profileData && !isOnAuthPage) {
        router.push('/auth/signup');
      }
    } catch (error) {
      console.error('Error checking profile:', error);
    }
  };

  const refreshProfile = async () => {
    if (user) {
      await checkProfile(user);
    }
  };

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        checkProfile(session.user);
      }
      
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        await checkProfile(session.user);
      } else {
        setProfile(null);
        setIsProvider(false);
      }
      
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [pathname, router]);

  const signOut = async () => {
    await supabase.auth.signOut();
    setProfile(null);
    setIsProvider(false);
  };

  const value = {
    user,
    session,
    profile,
    isProvider,
    loading,
    signOut,
    refreshProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 