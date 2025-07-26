"use client";
import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ToggleSwitch } from '@/components/ui/ToggleSwitch';
import { profilesApi } from '@/lib/api';
import { supabase } from '@/lib/supabase/client';

export default function AdditionalInfoPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [address, setAddress] = useState('');
  const [isServiceProvider, setIsServiceProvider] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const formRef = useRef<HTMLFormElement | null>(null);

  // Submit form when Enter is pressed anywhere (not inside input/textarea)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        const activeTag = (document.activeElement as HTMLElement | null)?.tagName;
        if (activeTag !== 'INPUT' && activeTag !== 'TEXTAREA') {
          e.preventDefault();
          formRef.current?.requestSubmit();
        }
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Get currently authenticated user's email from Supabase session
      const { data: { user } } = await supabase.auth.getUser();

      if (!user?.email) {
        throw new Error('Unable to retrieve authenticated user email');
      }

      await profilesApi.createProfile({
        full_name: fullName,
        phone: phoneNumber,
        email: user.email,
        home_address: address,
        is_provider: isServiceProvider
      });

      // Redirect to dashboard
      router.push('/provider/dashboard');
    } catch (err) {
      console.error(err);
      setError('Failed to save profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#f9fafb',
      padding: '1rem'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '500px',
        backgroundColor: 'white',
        borderRadius: '12px',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        padding: '2rem'
      }}>
        <div style={{
          textAlign: 'center',
          marginBottom: '2rem'
        }}>
          <h1 style={{
            fontSize: '2rem',
            fontWeight: 700,
            color: '#1f2937',
            marginBottom: '0.5rem'
          }}>
            Complete Your Profile
          </h1>
          <p style={{
            color: '#6b7280',
            fontSize: '1rem'
          }}>
            Help us get to know you better
          </p>
        </div>

        {error && (
          <div style={{
            backgroundColor: '#fee2e2',
            border: '1px solid #fecaca',
            borderRadius: '8px',
            padding: '0.75rem',
            marginBottom: '1rem'
          }}>
            <p style={{
              color: '#dc2626',
              fontSize: '0.875rem',
              margin: 0
            }}>
              {error}
            </p>
          </div>
        )}

        <form ref={formRef} onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{
              display: 'block',
              fontSize: '0.875rem',
              fontWeight: 600,
              color: '#374151',
              marginBottom: '0.5rem'
            }}>
              Full Name
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              placeholder="Enter your full name"
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '1rem',
                outline: 'none',
                transition: 'border-color 0.2s ease'
              }}
              onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
              onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
            />
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{
              display: 'block',
              fontSize: '0.875rem',
              fontWeight: 600,
              color: '#374151',
              marginBottom: '0.5rem'
            }}>
              Phone Number
            </label>
            <input
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              required
              placeholder="Enter your phone number"
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '1rem',
                outline: 'none',
                transition: 'border-color 0.2s ease'
              }}
              onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
              onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
            />
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{
              display: 'block',
              fontSize: '0.875rem',
              fontWeight: 600,
              color: '#374151',
              marginBottom: '0.5rem'
            }}>
              Address
            </label>
            <textarea
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
              placeholder="Enter your address"
              rows={4}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '1rem',
                outline: 'none',
                transition: 'border-color 0.2s ease',
                resize: 'vertical',
                fontFamily: 'inherit'
              }}
              onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
              onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
            />
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '2rem',
            padding: '1rem',
            backgroundColor: '#f9fafb',
            borderRadius: '8px',
            border: '1px solid #e5e7eb'
          }}>
            <span style={{
              fontSize: '0.875rem',
              fontWeight: 600,
              color: '#374151'
            }}>
              I want to be a service provider
            </span>
            <ToggleSwitch
              enabled={isServiceProvider}
              onChange={setIsServiceProvider}
              size="medium"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '0.875rem',
              backgroundColor: loading ? '#9ca3af' : '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '1rem',
              fontWeight: 600,
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'background-color 0.2s ease'
            }}
            onMouseEnter={(e) => {
              if (!loading) {
                e.currentTarget.style.backgroundColor = '#2563eb';
              }
            }}
            onMouseLeave={(e) => {
              if (!loading) {
                e.currentTarget.style.backgroundColor = '#3b82f6';
              }
            }}
          >
            {loading ? 'Saving...' : 'Complete Profile'}
          </button>
        </form>
      </div>
    </div>
  );
} 