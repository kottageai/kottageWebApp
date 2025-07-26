import React, { useState, useEffect, useCallback } from 'react';
import { SECTION_FIELDS, FieldDef } from '@/lib/section-defs';

interface ReschedulingPolicyProps {
  onDataChange: (data: any) => void;
}

function renderField(field: FieldDef, value: any, onChange: (v: any) => void) {
  return (
    <textarea
      value={value || ''}
      onChange={e => onChange(e.target.value)}
      style={{
        width: '100%',
        minHeight: 120,
        padding: '10px 12px',
        borderRadius: 8,
        border: '1px solid #EAE8E6',
        fontSize: 14,
        backgroundColor: 'white',
      }}
      placeholder={`Enter ${field.label}...`}
    />
  );
}

export const ReschedulingPolicy: React.FC<ReschedulingPolicyProps> = ({ onDataChange }) => {
  const [formData, setFormData] = useState<Record<string, any>>({});

  useEffect(() => {
    // Load data from localStorage on component mount
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('kottageSetupForm');
      if (stored) {
        const parsed = JSON.parse(stored);
        setFormData(parsed);
      }
    }
  }, []);

  const memoizedOnDataChange = useCallback(() => {
    onDataChange(formData);
  }, [formData, onDataChange]);

  useEffect(() => {
    // Notify parent component of data changes
    memoizedOnDataChange();
  }, [memoizedOnDataChange]);

  const handleFieldChange = (key: string, value: any) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const fields = SECTION_FIELDS['rescheduling-policy'] || [];

  return (
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
  );
}; 