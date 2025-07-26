"use client";
import React, { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import { ApprovalPolicy } from '@/components/policies/ApprovalPolicy';
import { PaymentPolicy } from '@/components/policies/PaymentPolicy';
import { CancellationPolicy } from '@/components/policies/CancellationPolicy';
import { LatePolicy } from '@/components/policies/LatePolicy';
import { PolicyButton } from '@/components/policies/PolicyButton';
import { ReschedulingPolicy } from '@/components/policies/ReschedulingPolicy';

type PolicyType = 'approval-policy' | 'payment-policy' | 'cancellation-policy' | 'late-policy' | 'booking-policy';

const POLICIES = [
  { key: 'approval-policy' as PolicyType, label: 'Approval', Component: ApprovalPolicy },
  { key: 'payment-policy' as PolicyType, label: 'Payment', Component: PaymentPolicy },
  { key: 'cancellation-policy' as PolicyType, label: 'Cancellation', Component: CancellationPolicy },
  { key: 'lateness-policy' as PolicyType, label: 'Lateness', Component: LatePolicy },
  { key: 'rescheduling-policy' as PolicyType, label: 'Rescheduling', Component: ReschedulingPolicy },
];

export default function CustomerBookingPoliciesPage() {
  const router = useRouter();
  const [activePolicy, setActivePolicy] = useState<PolicyType>('approval-policy');
  const [allPolicyData, setAllPolicyData] = useState<Record<string, any>>({});

  const handleDataChange = useCallback((data: any) => {
    setAllPolicyData(prev => ({
      ...prev,
      [activePolicy]: data, 
    }));
  }, [activePolicy]); 

  const handleSave = () => {
    if (typeof window !== 'undefined') {
      const flatData = Object.values(allPolicyData).reduce((acc, policyData) => ({ ...acc, ...policyData }), {});
      localStorage.setItem('kottageSetupForm', JSON.stringify(flatData));
      alert('Policies saved!');
    }
  };

  const ActivePolicyComponent = POLICIES.find(p => p.key === activePolicy)?.Component;

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'white' }}>
      <Sidebar />
      <main style={{ flex: 1, padding: '2rem' }}>
        <div style={{ maxWidth: 960, margin: '0 auto' }}>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700 }}>Customer Booking Policies</h1>
          <p style={{ marginTop: 8, marginBottom: '2rem', color: '#64748b', fontSize: '1rem' }}>
            Choose your default settings. Policies for individual service listings can be adjusted in the listing editor.
          </p>
          
          <div style={{ display: 'flex', gap: 16, marginBottom: 24 }}>
            {POLICIES.map(policy => (
              <PolicyButton
                key={policy.key}
                label={policy.label}
                isActive={activePolicy === policy.key}
                onClick={() => setActivePolicy(policy.key)}
              />
            ))}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            {ActivePolicyComponent && <ActivePolicyComponent onDataChange={handleDataChange} />}
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 40, gap: '1rem' }}>
            <button onClick={() => router.push('/provider/my-kottage')} style={{ padding: '10px 20px', border: '1px solid #ccc', borderRadius: 8 }}>Back</button>
            <button onClick={handleSave} style={{ padding: '10px 20px', backgroundColor: '#2563eb', color: 'white', borderRadius: 8, border: 'none' }}>Save</button>
          </div>
        </div>
      </main>
    </div>
  );
}