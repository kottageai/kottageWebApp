import React, { useState, useEffect } from 'react';

type Option = string | { label: string; value: string };
type Field = {
  label: string;
  type: string;
  required?: boolean;
  options?: Option[];
  value?: string;
  prefilled?: boolean;
};

// Props for the BookingFormEditor component
// - fields: Array of field definitions to render
// - onFieldChange: Optional callback for when a field value changes (used for suggested category)
// - categoryValue: Optional value for the suggested category field
type BookingFormEditorProps = {
  fields: Field[];
  onFieldChange?: (label: string, value: string) => void;
  categoryValue?: string;
};

// Helper to get the value from an option (string or object)
function getOptionValue(option: Option) {
  return typeof option === 'string' ? option : option.value;
}
// Helper to get the label from an option (string or object)
function getOptionLabel(option: Option) {
  return typeof option === 'string' ? option : option.label;
}

export default function BookingFormEditor({ fields, onFieldChange }: BookingFormEditorProps) {
  const [fieldValues, setFieldValues] = useState<Record<string, any>>({});

  useEffect(() => {
    // Prefill values for fields with prefilled: true (e.g., suggested category)
    fields.forEach(field => {
      if (field.prefilled && field.value !== undefined) {
        setFieldValues(prev => ({ ...prev, [field.label]: field.value }));
      }
    });
    // eslint-disable-next-line
  }, [fields]);

  const handleFieldChange = (label: string, value: any) => {
    setFieldValues(prev => ({
      ...prev,
      [label]: value
    }));
    if (onFieldChange && label === 'Suggested Category') {
      onFieldChange(label, value);
    }
  };
  
  // Render a single field based on its type
  const renderField = (field: Field) => {
    const commonProps = {
      onChange: (e: React.ChangeEvent<any>) => handleFieldChange(field.label, e.target.type === 'checkbox' ? e.target.checked : e.target.value),
      placeholder: `${field.label}`,
      style: { 
        width: '100%', 
        padding: '12px 16px', 
        borderRadius: 8, 
        border: '1px solid #e2e8f0',
        fontSize: '16px',
        outline: 'none',
        transition: 'border-color 0.2s, box-shadow 0.2s',
        backgroundColor: '#ffffff',
        color: '#1e293b'
      },
      onFocus: (e: any) => {
        e.target.style.borderColor = '#2563eb';
        e.target.style.boxShadow = '0 0 0 3px rgba(37, 99, 235, 0.1)';
      },
      onBlur: (e: any) => {
        e.target.style.borderColor = '#e2e8f0';
        e.target.style.boxShadow = 'none';
      }
    };

    const value = field.prefilled ? field.value : fieldValues[field.label] || '';

    switch (field.type) {
      case 'textarea':
        return <textarea {...commonProps} value={value} rows={4} />;
      case 'select':
        return (
          <select {...commonProps} value={value}>
            <option value="">Select an option</option>
            {field.options?.map((option, index) => (
              <option key={`${getOptionValue(option)}-${index}`} value={getOptionValue(option)}>
                {getOptionLabel(option)}
              </option>
            ))}
          </select>
        );
      case 'checkbox-group':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {field.options?.map((option, index) => (
              <label key={`${getOptionValue(option)}-${index}`} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <input
                  type="checkbox"
                  checked={fieldValues[field.label]?.[getOptionValue(option)] || false}
                  onChange={(e) => handleFieldChange(field.label, { ...fieldValues[field.label], [getOptionValue(option)]: e.target.checked })}
                />
                {getOptionLabel(option)}
              </label>
            ))}
          </div>
        );
      case 'checkbox':
      case 'boolean':
        return (
          <input
            type="checkbox"
            checked={!!fieldValues[field.label]}
            onChange={(e) => handleFieldChange(field.label, e.target.checked)}
            style={{ width: 20, height: 20 }}
          />
        );
      case 'file':
        return <input type="file" {...commonProps} />;
      default:
        return <input type={field.type} {...commonProps} value={value} />;
    }
  };

  // If no fields, show a placeholder message
  if (!fields || fields.length === 0) {
    return (
      <div style={{
        textAlign: 'center',
        color: '#64748b',
        fontStyle: 'italic',
        padding: '40px 20px'
      }}>
        No fields generated yet. Describe your service above to get started.
      </div>
    );
  }

  // Render the form with all fields
  return (
    <form style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {fields.map((field, idx) => (
        <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <label style={{ fontSize: '14px', fontWeight: '500', color: '#1e293b', display: 'flex', alignItems: 'center', gap: 4 }}>
            {field.label}
            {field.required && <span style={{ color: '#ef4444', fontSize: '16px', fontWeight: 'bold' }}> *</span>}
          </label>
          {renderField(field)}
        </div>
      ))}
    </form>
  );
} 