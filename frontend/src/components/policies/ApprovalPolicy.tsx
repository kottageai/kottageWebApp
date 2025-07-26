import React, { useState, useEffect } from 'react';
import { RadioSelect } from './RadioSelect';

interface ApprovalPolicyProps {
  onDataChange: (data: any) => void;
}

export const ApprovalPolicy: React.FC<ApprovalPolicyProps> = ({ onDataChange }) => {
  const [bookingApprovalMode, setBookingApprovalMode] = useState('instant');

  useEffect(() => {
    // Load data from localStorage on component mount
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('kottageSetupForm');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.bookingApprovalMode) {
          setBookingApprovalMode(parsed.bookingApprovalMode);
        }
      }
    }
  }, []);

  useEffect(() => {
    // Notify parent component of data changes
    onDataChange({ bookingApprovalMode });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookingApprovalMode]);

  const handleApprovalModeChange = (value: string) => {
    setBookingApprovalMode(value);
  };

  return (
    <div style={{ background: '#F4F2F0', padding: '24px', borderRadius: 12, border: '1px solid #EAE8E6' }}>
      <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: 16 }}>Booking approval mode</h3>
      <RadioSelect
        options={[
          { value: 'instant', label: 'Allow instant booking' },
          { value: 'review', label: 'Review booking before confirming' },
        ]}
        selected={bookingApprovalMode}
        onChange={handleApprovalModeChange}
      />
    </div>
  );
}; 