import React, { useState, useEffect, useCallback } from 'react';
import { ToggleSwitch } from '@/components/ui/ToggleSwitch';
import { RadioSelect } from './RadioSelect';

interface PaymentMethod {
  name: string;
  enabled: boolean;
}

interface PaymentPolicyProps {
  onDataChange: (data: any) => void;
}

export const PaymentPolicy: React.FC<PaymentPolicyProps> = ({ onDataChange }) => {
  const [onlinePaymentMethods, setOnlinePaymentMethods] = useState<PaymentMethod[]>([
    { name: 'Debit or Credit Card', enabled: true },
    { name: 'PayPal', enabled: true },
    { name: 'Klarna', enabled: true },
  ]);

  const [onsitePaymentMethods, setOnsitePaymentMethods] = useState<PaymentMethod[]>([
    { name: 'Cash', enabled: true },
    { name: 'Debit or Credit Card', enabled: true },
    { name: 'Cash App', enabled: true },
  ]);

  const [selectedPaymentRequirement, setSelectedPaymentRequirement] = useState('full-payment');

  useEffect(() => {
    // Load data from localStorage on component mount
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('kottageSetupForm');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.onlinePaymentMethods) {
          setOnlinePaymentMethods(parsed.onlinePaymentMethods);
        }
        if (parsed.onsitePaymentMethods) {
          setOnsitePaymentMethods(parsed.onsitePaymentMethods);
        }
        if (parsed.selectedPaymentRequirement) {
          setSelectedPaymentRequirement(parsed.selectedPaymentRequirement);
        }
      }
    }
  }, []);

  const memoizedOnDataChange = useCallback(() => {
    onDataChange({ onlinePaymentMethods, onsitePaymentMethods, selectedPaymentRequirement });
  }, [onlinePaymentMethods, onsitePaymentMethods, selectedPaymentRequirement, onDataChange]);

  useEffect(() => {
    // Notify parent component of data changes
    memoizedOnDataChange();
  }, [memoizedOnDataChange]);

  const handleOnlinePaymentMethodToggle = (methodName: string) => {
    setOnlinePaymentMethods(prev =>
      prev.map(method =>
        method.name === methodName ? { ...method, enabled: !method.enabled } : method
      )
    );
  };

  const handleOnsitePaymentMethodToggle = (methodName: string) => {
    setOnsitePaymentMethods(prev =>
      prev.map(method =>
        method.name === methodName ? { ...method, enabled: !method.enabled } : method
      )
    );
  };

  const handlePaymentRequirementChange = (value: string) => {
    setSelectedPaymentRequirement(value);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div style={{ background: '#f9fafb', padding: '24px', borderRadius: 12, border: '1px solid #e5e7eb' }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: 16 }}>Booking payment requirements</h3>
        <RadioSelect
          options={[
            { value: 'full-payment', label: 'Full payment at booking' },
            { 
              value: 'deposit', 
              label: 'Deposit required',
              expandedContent: (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: 8, fontSize: '0.875rem', fontWeight: 500, color: '#374151' }}>
                      Deposit amount
                    </label>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <input type="radio" id="percentage" name="depositType" defaultChecked style={{ width: 16, height: 16 }} />
                        <label htmlFor="percentage" style={{ fontSize: '0.875rem', color: '#374151', marginRight: 8 }}>Percentage:</label>
                        <input
                          type="number"
                          placeholder="50"
                          style={{
                            width: '60px',
                            padding: '6px 8px',
                            borderRadius: 4,
                            border: '1px solid #d1d5db',
                            fontSize: '0.875rem'
                          }}
                        />
                        <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>% of total service cost</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <input type="radio" id="flatAmount" name="depositType" style={{ width: 16, height: 16 }} />
                        <label htmlFor="flatAmount" style={{ fontSize: '0.875rem', color: '#374151', marginRight: 8 }}>Flat amount:</label>
                        <span style={{ fontSize: '0.875rem', color: '#6b7280', marginRight: 4 }}>$</span>
                        <input
                          type="number"
                          placeholder="100"
                          style={{
                            width: '80px',
                            padding: '6px 8px',
                            borderRadius: 4,
                            border: '1px solid #d1d5db',
                            fontSize: '0.875rem'
                          }}
                        />
                      </div>
                    </div>
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: 8, fontSize: '0.875rem', fontWeight: 500, color: '#374151' }}>
                      When is remaining payment due?
                    </label>
                    <select style={{
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: 6,
                      border: '1px solid #d1d5db',
                      fontSize: '0.875rem',
                      backgroundColor: 'white'
                    }}>
                      <option value="before-service">Before service begins</option>
                      <option value="after-service">After service completion</option>
                      <option value="on-arrival">Upon arrival</option>
                    </select>
                  </div>
                </div>
              )
            },
            { value: 'payment-after', label: 'Payment after service' },
          ]}
          selected={selectedPaymentRequirement}
          onChange={handlePaymentRequirementChange}
          allowExpansion={true}
        />
      </div>

      <div style={{ display: 'flex', flexDirection: 'row', gap: 24 }}>
        <div style={{ flex: '1 1 0', minWidth: 0, background: '#f9fafb', padding: '24px', borderRadius: 12, border: '1px solid #e5e7eb' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: 16 }}>Online booking payment methods</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {onlinePaymentMethods.map((method) => (
              <div 
                key={method.name} 
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  backgroundColor: method.enabled ? 'white' : '#f8f9fa',
                  padding: '16px',
                  borderRadius: 8,
                  border: `1px solid ${method.enabled ? '#e5e7eb' : '#e9ecef'}`,
                  opacity: method.enabled ? 1 : 0.6,
                  transition: 'all 0.2s ease-in-out'
                }}
              >
                <span style={{ 
                  fontWeight: 500, 
                  color: method.enabled ? '#1f2937' : '#6c757d' 
                }}>
                  {method.name}
                </span>
                <ToggleSwitch
                  size="small"
                  enabled={method.enabled}
                  onChange={() => handleOnlinePaymentMethodToggle(method.name)}
                />
              </div>
            ))}
          </div>
        </div>

        <div style={{ flex: '1 1 0', minWidth: 0, background: '#f9fafb', padding: '24px', borderRadius: 12, border: '1px solid #e5e7eb' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: 16 }}>On-site payment methods</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {onsitePaymentMethods.map((method) => (
              <div 
                key={method.name} 
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  backgroundColor: method.enabled ? 'white' : '#f8f9fa',
                  padding: '16px',
                  borderRadius: 8,
                  border: `1px solid ${method.enabled ? '#e5e7eb' : '#e9ecef'}`,
                  opacity: method.enabled ? 1 : 0.6,
                  transition: 'all 0.2s ease-in-out'
                }}
              >
                <span style={{ 
                  fontWeight: 500, 
                  color: method.enabled ? '#1f2937' : '#6c757d' 
                }}>
                  {method.name}
                </span>
                <ToggleSwitch
                  size="small"
                  enabled={method.enabled}
                  onChange={() => handleOnsitePaymentMethodToggle(method.name)}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}; 