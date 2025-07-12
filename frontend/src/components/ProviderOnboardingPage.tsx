"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from '../app/page.module.css';

export default function ProviderOnboardingPage() {
  const router = useRouter();
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    setLoading(true);

    try {
      const res = await fetch('/api/generate-form', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description: inputValue.trim() })
      });

      if (!res.ok) throw new Error('Failed to fetch AI data');
      
      const data = await res.json();
      const initialFormData: Record<string, any> = {
        entityType: 'individual'
      };

      if (data?.classification) {
        initialFormData.serviceCategory = data.classification.category;
        initialFormData.serviceSubcategory = data.classification.subcategory;
      }

      if (typeof window !== 'undefined') {
        localStorage.setItem('kottageSetupForm', JSON.stringify(initialFormData));
      }

      router.push(`/provider/my-kottage`);

    } catch (error) {
      console.error(error);
      // In a real app, show a toast or error message to the user
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <main className={styles.main} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <div className={styles.loadingContainer}>
          <div className={styles.spinner}></div>
          <p style={{ marginTop: 20, fontSize: '1.125rem', color: '#4b5563' }}>
            Analyzing your description...
          </p>
        </div>
      </main>
    );
  }
  
  return (
    <main className={styles.main} style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center',
      minHeight: '100vh' 
    }}>
      <div style={{ textAlign: 'center' }}>
        <h1 className={styles.title} style={{ marginBottom: 24 }}>kottage</h1>
        <p className={styles.subtitle} style={{ marginBottom: 32, maxWidth: 600 }}>
          Describe your service to begin setting up your storefront.
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 12 }}>
          <input
            type="text"
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            placeholder="e.g., I walk dogs in the downtown area..."
            style={{
              width: '400px',
              padding: '12px 16px',
              borderRadius: 8,
              border: '1px solid #e2e8f0',
              fontSize: '16px'
            }}
            onKeyDown={e => {
              if (e.key === 'Enter') handleSubmit(e);
            }}
            disabled={loading}
          />
          <button
            onClick={handleSubmit}
            disabled={loading || !inputValue.trim()}
            style={{
              padding: '12px 24px',
              borderRadius: 8,
              background: loading || !inputValue.trim() ? '#e2e8f0' : '#2563eb',
              color: loading || !inputValue.trim() ? '#64748b' : 'white',
              border: 'none',
              fontSize: '16px',
              fontWeight: '500',
              cursor: loading || !inputValue.trim() ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? 'Sending...' : 'Send'}
          </button>
        </div>
      </div>
    </main>
  );
} 