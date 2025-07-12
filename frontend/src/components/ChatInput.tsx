import React from 'react';

type ChatInputProps = {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSend: () => void;
  disabled?: boolean;
};

export default function ChatInput({ value, onChange, onSend, disabled }: ChatInputProps) {
  return (
    <div style={{ 
      display: 'flex', 
      gap: 12,
      width: '100%'
    }}>
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder="Describe your service..."
        disabled={disabled}
        style={{ 
          flex: 1, 
          padding: '12px 16px', 
          borderRadius: 8, 
          border: '1px solid #e2e8f0',
          fontSize: '16px',
          outline: 'none',
          transition: 'border-color 0.2s, box-shadow 0.2s',
          backgroundColor: disabled ? '#f1f5f9' : '#ffffff',
          color: disabled ? '#64748b' : '#1e293b'
        }}
        onKeyDown={e => {
          if (e.key === 'Enter' && !disabled) onSend();
        }}
        onFocus={(e) => {
          e.target.style.borderColor = '#2563eb';
          e.target.style.boxShadow = '0 0 0 3px rgba(37, 99, 235, 0.1)';
        }}
        onBlur={(e) => {
          e.target.style.borderColor = '#e2e8f0';
          e.target.style.boxShadow = 'none';
        }}
      />
      <button
        onClick={onSend}
        disabled={disabled || !value.trim()}
        style={{ 
          padding: '12px 24px', 
          borderRadius: 8, 
          background: disabled || !value.trim() ? '#e2e8f0' : '#2563eb', 
          color: disabled || !value.trim() ? '#64748b' : '#ffffff', 
          border: 'none',
          fontSize: '16px',
          fontWeight: '500',
          cursor: disabled || !value.trim() ? 'not-allowed' : 'pointer',
          transition: 'background-color 0.2s, transform 0.1s',
          minWidth: '80px'
        }}
        onMouseEnter={(e) => {
          if (!disabled && value.trim()) {
            e.currentTarget.style.backgroundColor = '#1d4ed8';
            e.currentTarget.style.transform = 'translateY(-1px)';
          }
        }}
        onMouseLeave={(e) => {
          if (!disabled && value.trim()) {
            e.currentTarget.style.backgroundColor = '#2563eb';
            e.currentTarget.style.transform = 'translateY(0)';
          }
        }}
      >
        Send
      </button>
    </div>
  );
} 