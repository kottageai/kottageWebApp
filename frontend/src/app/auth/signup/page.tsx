"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase/client';
import { ToggleSwitch } from '@/components/ui/ToggleSwitch';
import { useAuth } from '@/lib/auth/AuthProvider';
import { profileApi } from '@/lib/api-client';

type SignupStep = 'credentials' | 'profile';

export default function SignupPage() {
  const router = useRouter();
  const { refreshProfile } = useAuth();
  const [currentStep, setCurrentStep] = useState<SignupStep>('credentials');
  
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
        address: address.trim() || undefined,
        wants_to_be_provider: wantsToBeProvider,
      });

      console.log('Profile created successfully:', result);

      // Refresh auth context to update profile data
      await refreshProfile();

      // Redirect based on provider choice
      if (wantsToBeProvider) {
        router.push('/provider/my-kottage');
      } else {
        router.push('/'); // or customer dashboard
      }
    } catch (err) {
      console.error('Profile creation error:', err);
      if (err instanceof Error) {
        if (err.message.includes('No authentication token')) {
          setError('Authentication session expired. Please try again.');
          setCurrentStep('credentials');
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

  const handleGoogleSignUp = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/complete-profile`
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
        <p style={{ color: '#6b7280' }}>
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
          marginBottom: '1.5rem',
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
          Complete your profile
        </h1>
        <p style={{ color: '#6b7280' }}>
          Tell us a bit more about yourself
        </p>
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
          marginBottom: '1.5rem',
          padding: '1rem',
          backgroundColor: '#f9fafb',
          borderRadius: '8px',
          border: '1px solid #e5e7eb'
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
          {loading ? 'Completing setup...' : 'Complete Setup'}
        </button>
      </form>
    </>
  );

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
            backgroundColor: error.includes('check your email') ? '#e0f2fe' : '#fee2e2',
            border: `1px solid ${error.includes('check your email') ? '#b3e5fc' : '#fecaca'}`,
            borderRadius: '6px',
            marginBottom: '1rem'
          }}>
            <p style={{ 
              color: error.includes('check your email') ? '#0277bd' : '#dc2626', 
              fontSize: '0.875rem' 
            }}>
              {error}
            </p>
          </div>
        )}

        {currentStep === 'credentials' ? renderCredentialsStep() : renderProfileStep()}

        {currentStep === 'credentials' && (
          <p style={{ 
            textAlign: 'center', 
            fontSize: '0.875rem', 
            color: '#6b7280'
          }}>
            Already have an account?{' '}
            <Link href="/auth/login" style={{ 
              color: '#3b82f6', 
              textDecoration: 'none',
              fontWeight: 500
            }}>
              Sign in
            </Link>
          </p>
        )}
      </div>
    </div>
  );
} 