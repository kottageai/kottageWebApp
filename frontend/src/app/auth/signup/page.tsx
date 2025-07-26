"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase/client';

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const checkUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error && error.code === 'PGRST116') {
        // No profile found, redirect to additional info
        return false;
      }
      
      if (error) {
        console.error('Error checking profile:', error);
        return false;
      }

      return !!data;
    } catch (err) {
      console.error('Unexpected error checking profile:', err);
      return false;
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
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
        // Check if email confirmation is required
        if (data.user && !data.user.email_confirmed_at) {
          setError('Please check your email for confirmation link');
        } else if (data.user) {
          // Check if user has profile
          const hasProfile = await checkUserProfile(data.user.id);
          if (hasProfile) {
            router.push('/provider/dashboard');
          } else {
            router.push('/auth/additional-info');
          }
        }
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      });

      if (error) {
        setError(error.message);
      }
    } catch (err) {
      setError('An unexpected error occurred');
    }
  };

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

        <form onSubmit={handleSignUp} style={{ marginBottom: '1.5rem' }}>
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
            {loading ? 'Creating account...' : 'Create account'}
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
      </div>
    </div>
  );
} 