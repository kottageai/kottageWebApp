"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase/client';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const checkUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();
      
      console.log("data", data);

      if (error) {
        console.error('Error checking profile:', error);
        return false;
      }

      if (!data) {
        return false;
      }

      return !!data;
    } catch (err) {
      console.error('Unexpected error checking profile:', err);
      return false;
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setError(error.message);
      } else if (data.user) {
        console.log("data.user", data.user);
        const hasProfile = await checkUserProfile(data.user.id);
        if (hasProfile) {
          router.push('/provider/dashboard');
        } else {
          router.push('/auth/additional-info');
        }
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
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
            Welcome back
          </h1>
          <p style={{ color: '#6b7280' }}>
            Sign in to your Kottage account
          </p>
        </div>

        {error && (
          <div style={{
            padding: '0.75rem',
            backgroundColor: '#fee2e2',
            border: '1px solid #fecaca',
            borderRadius: '6px',
            marginBottom: '1rem'
          }}>
            <p style={{ color: '#dc2626', fontSize: '0.875rem' }}>{error}</p>
          </div>
        )}

        <form onSubmit={handleSignIn} style={{ marginBottom: '1.5rem' }}>
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

          <div style={{ marginBottom: '1.5rem' }}>
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
            {loading ? 'Signing in...' : 'Sign in'}
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
          onClick={handleGoogleSignIn}
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
          Don't have an account?{' '}
          <Link href="/auth/signup" style={{ 
            color: '#3b82f6', 
            textDecoration: 'none',
            fontWeight: 500
          }}>
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
} 