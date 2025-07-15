"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase/client';
import { ToggleSwitch } from '@/components/ui/ToggleSwitch';
import { useAuth } from '@/lib/auth/AuthProvider';
import { profileApi } from '@/lib/api-client';

// Add CSS animation for spinners
const spinKeyframes = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

// Inject the keyframes into the document head
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = spinKeyframes;
  document.head.appendChild(style);
}

type SignupStep = 'credentials' | 'profile';
type PageMode = 'signup' | 'complete-profile';

export default function SignupPage() {
  const router = useRouter();
  const { refreshProfile } = useAuth();
  
  // Page state
  const [pageMode, setPageMode] = useState<PageMode>('signup');
  const [currentStep, setCurrentStep] = useState<SignupStep>('credentials');
  const [user, setUser] = useState<any>(null);
  
  // Step 1: Credentials
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // Step 2: Profile
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [wantsToBeProvider, setWantsToBeProvider] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [authData, setAuthData] = useState<any>(null);

  useEffect(() => {
    const checkAuthStatus = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        setUser(user);
        
        // Pre-fill name from OAuth data if available
        if (user.user_metadata?.full_name) {
          setFullName(user.user_metadata.full_name);
        }

        // Check if profile already exists
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (profile) {
          // Profile already exists, redirect appropriately
          const { data: provider } = await supabase
            .from('providers')
            .select('*')
            .eq('id', user.id)
            .single();

          if (provider) {
            router.push('/provider/my-kottage');
          } else {
            router.push('/');
          }
        } else {
          // User exists but no profile - show profile completion
          setPageMode('complete-profile');
          setCurrentStep('profile');
        }
      } else {
        // No user - show regular signup flow
        setPageMode('signup');
        setCurrentStep('credentials');
      }
    };

    checkAuthStatus();
  }, [router]);

  const handleCredentialsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        setError(error.message);
      } else {
        if (data.user) {
          setAuthData(data);
          setUser(data.user);
          setCurrentStep('profile');
        } else {
          setError('Failed to create account');
        }
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!fullName.trim()) {
      setError('Full name is required');
      setLoading(false);
      return;
    }

    if (!phone.trim()) {
      setError('Phone number is required');
      setLoading(false);
      return;
    }

    try {
      // Create profile via backend API
      const result = await profileApi.create({
        full_name: fullName.trim(),
        phone: phone.trim(),
        home_address: address || undefined,
        is_provider: wantsToBeProvider,
      });

      console.log('Profile created successfully:', result);

      // Refresh auth context to update profile data
      await refreshProfile();

      // Redirect based on provider choice
      if (wantsToBeProvider) {
        router.push('/provider/my-kottage');
      } else {
        router.push('/');
      }
    } catch (err) {
      console.error('Profile creation error:', err);
      if (err instanceof Error) {
        if (err.message.includes('No authentication token')) {
          setError('Authentication session expired. Please try again.');
          if (pageMode === 'signup') {
            setCurrentStep('credentials');
          } else {
            router.push('/auth/login');
          }
        } else {
          setError(err.message);
        }
      } else {
        setError('An unexpected error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    setLoading(true);
    setError('');
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        throw error;
      }
      // Manually reset state for a smooth UI transition without a full reload
      setUser(null);
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      setFullName('');
      setPhone('');
      setAddress('');
      setWantsToBeProvider(false);
      setAuthData(null);
      setPageMode('signup');
      setCurrentStep('credentials');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to sign out');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/signup`
        }
      });

      if (error) {
        setError(error.message);
      }
    } catch (err) {
      setError('An unexpected error occurred');
    }
  };

  const renderCredentialsStep = () => (
    <>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h1 style={{ 
          fontSize: '2rem', 
          fontWeight: 700, 
          color: '#1f2937',
          marginBottom: '0.5rem'
        }}>
          Create account
        </h1>
        <p style={{ 
          color: '#6b7280'
        }}>
          Join Kottage and start your journey
        </p>
      </div>

      <form onSubmit={handleCredentialsSubmit} style={{ marginBottom: '1.5rem' }}>
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ 
            display: 'block', 
            fontSize: '0.875rem', 
            fontWeight: 500, 
            color: '#374151',
            marginBottom: '0.5rem'
          }}>
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              fontSize: '1rem',
              outline: 'none',
              transition: 'border-color 0.2s'
            }}
            onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
            onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
          />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label style={{ 
            display: 'block', 
            fontSize: '0.875rem', 
            fontWeight: 500, 
            color: '#374151',
            marginBottom: '0.5rem'
          }}>
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              fontSize: '1rem',
              outline: 'none',
              transition: 'border-color 0.2s'
            }}
            onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
            onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
          />
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ 
            display: 'block', 
            fontSize: '0.875rem', 
            fontWeight: 500, 
            color: '#374151',
            marginBottom: '0.5rem'
          }}>
            Confirm Password
          </label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              fontSize: '1rem',
              outline: 'none',
              transition: 'border-color 0.2s'
            }}
            onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
            onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            width: '100%',
            padding: '0.75rem',
            backgroundColor: loading ? '#9ca3af' : '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            fontSize: '1rem',
            fontWeight: 500,
            cursor: loading ? 'not-allowed' : 'pointer',
            transition: 'background-color 0.2s'
          }}
        >
          {loading ? 'Creating account...' : 'Continue'}
        </button>
      </form>

      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        marginBottom: '1.5rem'
      }}>
        <div style={{ flex: 1, height: '1px', backgroundColor: '#e5e7eb' }}></div>
        <span style={{ 
          padding: '0 1rem', 
          fontSize: '0.875rem', 
          color: '#6b7280'
        }}>
          or
        </span>
        <div style={{ flex: 1, height: '1px', backgroundColor: '#e5e7eb' }}></div>
      </div>

      <button
        onClick={handleGoogleSignUp}
        style={{
          width: '100%',
          padding: '0.75rem',
          backgroundColor: 'white',
          border: '1px solid #d1d5db',
          borderRadius: '6px',
          fontSize: '1rem',
          fontWeight: 500,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.5rem',
          transition: 'background-color 0.2s'
        }}
        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'}
        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
      >
        <div style={{ 
          width: 20, 
          height: 20, 
          backgroundColor: '#4285f4', 
          borderRadius: 4,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontSize: '12px',
          fontWeight: 'bold'
        }}>
          G
        </div>
        Continue with Google
      </button>
    </>
  );

  const renderProfileStep = () => (
    <>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h1 style={{ 
          fontSize: '2rem', 
          fontWeight: 700, 
          color: '#1f2937',
          marginBottom: '0.5rem'
        }}>
          {pageMode === 'complete-profile' ? 'Complete your profile' : 'Tell us about yourself'}
        </h1>
        <p style={{ 
          color: '#6b7280'
        }}>
          {pageMode === 'complete-profile' 
            ? 'Just a few more details to get you started'
            : 'Help us personalize your experience'
          }
        </p>
        {pageMode === 'complete-profile' && user && (
          <p style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '1rem' }}>
            Signed in as <strong>{user.email}</strong>.{' '}
            <button
              onClick={handleSignOut}
              disabled={loading}
              style={{
                background: 'none',
                border: 'none',
                color: '#3b82f6',
                cursor: 'pointer',
                textDecoration: 'underline',
                padding: 0,
                font: 'inherit'
              }}
            >
              Use a different account
            </button>
          </p>
        )}
      </div>

      <form onSubmit={handleProfileSubmit}>
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ 
            display: 'block', 
            fontSize: '0.875rem', 
            fontWeight: 500, 
            color: '#374151',
            marginBottom: '0.5rem'
          }}>
            Full Name *
          </label>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              fontSize: '1rem',
              outline: 'none',
              transition: 'border-color 0.2s'
            }}
            onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
            onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
          />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label style={{ 
            display: 'block', 
            fontSize: '0.875rem', 
            fontWeight: 500, 
            color: '#374151',
            marginBottom: '0.5rem'
          }}>
            Phone Number *
          </label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              fontSize: '1rem',
              outline: 'none',
              transition: 'border-color 0.2s'
            }}
            onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
            onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
          />
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ 
            display: 'block', 
            fontSize: '0.875rem', 
            fontWeight: 500, 
            color: '#374151',
            marginBottom: '0.5rem'
          }}>
            Address (Optional)
          </label>
          <textarea
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            rows={3}
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              fontSize: '1rem',
              outline: 'none',
              transition: 'border-color 0.2s',
              resize: 'vertical'
            }}
            onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
            onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
          />
        </div>

        <div style={{
          padding: '1rem',
          backgroundColor: '#f9fafb',
          border: '1px solid #e5e7eb',
          borderRadius: '8px',
          marginBottom: '1.5rem'
        }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            marginBottom: '0.5rem'
          }}>
            <label style={{ 
              fontSize: '0.875rem', 
              fontWeight: 500, 
              color: '#374151'
            }}>
              I want to offer services
            </label>
            <ToggleSwitch
              enabled={wantsToBeProvider}
              onChange={setWantsToBeProvider}
            />
          </div>
          <p style={{ 
            fontSize: '0.75rem', 
            color: '#6b7280',
            margin: 0
          }}>
            Enable this if you want to provide services to customers on Kottage
          </p>
        </div>

        <button
          type="submit"
          disabled={loading || !fullName.trim() || !phone.trim()}
          style={{
            width: '100%',
            padding: '0.75rem',
            backgroundColor: (loading || !fullName.trim() || !phone.trim()) ? '#9ca3af' : '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            fontSize: '1rem',
            fontWeight: 500,
            cursor: (loading || !fullName.trim() || !phone.trim()) ? 'not-allowed' : 'pointer',
            transition: 'background-color 0.2s'
          }}
        >
          {loading ? 'Completing setup...' : 'Complete Setup'}
        </button>
      </form>
    </>
  );

  // Show loading state while checking auth status
  if (pageMode === 'signup' && currentStep === 'credentials' && user) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f9fafb'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '32px',
            height: '32px',
            border: '3px solid #e5e7eb',
            borderTop: '3px solid #3b82f6',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 1rem auto'
          }}></div>
          <p style={{ 
            color: '#6b7280'
          }}>
            Loading...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#f9fafb'
    }}>
      <div style={{
        maxWidth: '400px',
        width: '100%',
        padding: '2rem',
        backgroundColor: 'white',
        borderRadius: '12px',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        margin: '0 1rem'
      }}>
        {error && (
          <div style={{
            padding: '0.75rem',
            marginBottom: '1rem',
            borderRadius: '6px',
            border: error.includes('check your email') ? '1px solid #fecaca' : '1px solid #fecaca',
            backgroundColor: error.includes('check your email') ? '#fee2e2' : '#fee2e2'
          }}>
            <p style={{ 
              color: error.includes('check your email') ? '#dc2626' : '#dc2626',
              fontSize: '0.875rem',
              margin: 0
            }}>
              {error}
            </p>
          </div>
        )}

        {currentStep === 'credentials' ? renderCredentialsStep() : renderProfileStep()}

        {currentStep === 'credentials' && pageMode === 'signup' && (
          <p style={{ 
            textAlign: 'center', 
            fontSize: '0.875rem', 
            color: '#6b7280',
            marginTop: '1.5rem'
          }}>
            Already have an account?{' '}
            <Link 
              href="/auth/login" 
              style={{ 
                fontWeight: 500, 
                color: '#3b82f6', 
                textDecoration: 'none'
              }}
            >
              Sign in
            </Link>
          </p>
        )}
      </div>
    </div>
  );
} 