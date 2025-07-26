"use client";
import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { SECTION_FIELDS, FieldDef } from '@/lib/section-defs';
import Sidebar from '@/components/Sidebar';

function renderField(field: FieldDef, value: any, onChange: (v: any) => void) {
  switch (field.type) {
    case 'radio':
      return (
        <div style={{ display: 'flex', gap: '2rem' }}>
          {(field.options || []).map(option => (
            <div key={option.key} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <input
                type="radio"
                id={`${field.key}-${option.key}`}
                name={field.key}
                value={option.key}
                checked={value === option.key}
                onChange={e => onChange(e.target.value)}
                style={{ width: 16, height: 16 }}
              />
              <label htmlFor={`${field.key}-${option.key}`}>{option.label}</label>
            </div>
          ))}
        </div>
      );
    case 'checkbox':
      return (
        <input
          type="checkbox"
          checked={!!value}
          onChange={e => onChange(e.target.checked)}
          style={{ width: 20, height: 20 }}
        />
      );
    case 'textarea':
      return (
        <textarea
          value={value || ''}
          onChange={e => onChange(e.target.value)}
          style={{
            width: '100%',
            minHeight: 120,
            padding: '10px 12px',
            borderRadius: 8,
            border: '1px solid #e2e8f0',
            fontSize: 14,
          }}
          placeholder={`Enter ${field.label}...`}
        />
      );
    case 'file':
      return (
        <input
          type="file"
          onChange={e => {
            if (e.target.files) {
              onChange(e.target.files[0]?.name);
            }
          }}
        />
      );
    default:
      return (
        <input
          type="text"
          value={value || ''}
          onChange={e => onChange(e.target.value)}
          placeholder={`Enter ${field.label}...`}
          style={{
            width: '100%',
            padding: '10px 12px',
            borderRadius: 8,
            border: '1px solid #e2e8f0',
            fontSize: 14,
          }}
        />
      );
  }
}

export default function SectionPage() {
  const router = useRouter();
  const params = useParams<{ section: string }>();
  const sectionKey = params.section;
  const fields = SECTION_FIELDS[sectionKey] || [];

  const [formData, setFormData] = useState<Record<string, any>>({});

  // Load stored data on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('kottageSetupForm');
      if (stored) setFormData(JSON.parse(stored));
    }
  }, []);

  const handleFieldChange = (key: string, value: any) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('kottageSetupForm', JSON.stringify(formData));
    }
    router.push('/provider/my-kottage');
  };

  if (!fields.length) {
    return (
      <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'white' }}>
        <Sidebar />
        <main style={{ flex: 1, padding: '2rem' }}>
          <p>Unknown section.</p>
          <button onClick={() => router.push('/provider/my-kottage')}>Back</button>
        </main>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'white' }}>
      <Sidebar />
      <main style={{ flex: 1, padding: '2rem' }}>
        <div style={{ maxWidth: 960, margin: '0 auto' }}>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '2rem' }}>
            {sectionKey.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
          </h1>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            {fields.map(field => (
              <div key={field.key}>
                <label style={{ display: 'block', marginBottom: 8, fontSize: 14, fontWeight: 500 }}>
                  {field.label} {field.mandatory && <span style={{ color: 'red' }}>*</span>}
                </label>
                {renderField(field, formData[field.key], (value) => handleFieldChange(field.key, value))}
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 40 }}>
            <button onClick={handleSave} style={{ padding: '10px 20px', backgroundColor: '#2563eb', color: 'white', borderRadius: 8, border: 'none' }}>Save & Continue</button>
          </div>
        </div>
      </main>
    </div>
  );
}