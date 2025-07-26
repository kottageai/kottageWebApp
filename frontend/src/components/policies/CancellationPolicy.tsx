import React, { useState } from 'react';
import { ToggleSwitch } from '../ui/ToggleSwitch';
import {
  containerStyle,
  ruleRowStyle,
  textStyle,
  numberInputStyle,
  selectInputStyle,
  actionButtonStyle,
  toggleContainerStyle,
  storefrontHeaderStyle,
  previewBoxStyle,
  previewTitleStyle,
  previewItemStyle,
  previewDateStyle,
  previewRefundStyle,
  ruleRowWrapperStyle,
} from './CancellationPolicy.styles';

interface Rule {
  id: number;
  paymentType: 'full' | 'deposit';
  cancelTime: number;
  timeUnit: 'hours' | 'days' | 'day';
  refundType: 'percentage' | 'full_deposit' | 'half_deposit';
  refundValue: number; // For percentage
}

export const CancellationPolicy: React.FC = () => {
  const [rules, setRules] = useState<Rule[]>([
    { id: 1, paymentType: 'full', cancelTime: 12, timeUnit: 'hours', refundType: 'percentage', refundValue: 50 },
    { id: 2, paymentType: 'full', cancelTime: 3, timeUnit: 'days', refundType: 'percentage', refundValue: 100 },
    { id: 3, paymentType: 'deposit', cancelTime: 1, timeUnit: 'day', refundType: 'full_deposit', refundValue: 0 },
    { id: 4, paymentType: 'deposit', cancelTime: 1, timeUnit: 'day', refundType: 'half_deposit', refundValue: 0 },
  ]);
  const [allowFreeCancellation, setAllowFreeCancellation] = useState(true);

  const addRule = () => {
    const newId = rules.length > 0 ? Math.max(...rules.map(r => r.id)) + 1 : 1;
    setRules([...rules, {
      id: newId,
      paymentType: 'full',
      cancelTime: 24,
      timeUnit: 'hours',
      refundType: 'percentage',
      refundValue: 50
    }]);
  };

  const removeRule = (id: number) => {
    setRules(rules.filter(rule => rule.id !== id));
  };

  const updateRule = (id: number, field: keyof Rule, value: any) => {
    setRules(rules.map(rule => {
      if (rule.id === id) {
        const updatedRule = { ...rule, [field]: value };
        
        if (field === 'paymentType') {
          if (value === 'full') {
            updatedRule.refundType = 'percentage';
            updatedRule.refundValue = 50;
          } else if (value === 'deposit') {
            updatedRule.refundType = 'full_deposit';
            updatedRule.refundValue = 0;
          }
        }
        
        return updatedRule;
      }
      return rule;
    }));
  };

  const getRefundText = (rule: Rule) => {
    switch (rule.refundType) {
      case 'percentage':
        return `Get back ${rule.refundValue}% of what you paid`;
      case 'full_deposit':
        return 'Get back 100% of what you paid';
      case 'half_deposit':
        return 'Get back 50% of what you paid';
      default:
        return '';
    }
  };

  const getRefundTitle = (rule: Rule) => {
    switch (rule.refundType) {
      case 'percentage':
        return rule.refundValue === 100 ? 'Full refund' : 'Partial refund';
      case 'full_deposit':
        return 'Full deposit refund';
      case 'half_deposit':
        return 'Partial deposit refund';
      default:
        return '';
    }
  }

  const renderRuleRow = (rule: Rule, index: number, isLast: boolean) => (
    <div key={rule.id} style={ruleRowWrapperStyle}>
        <div style={{...ruleRowStyle, marginBottom: 0, justifyContent: 'space-between'}}>
            {/* Left side */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={textStyle}>For</span>
                <select
                    value={rule.paymentType}
                    onChange={e => updateRule(rule.id, 'paymentType', e.target.value)}
                    style={{...selectInputStyle, minWidth: '140px'}}
                >
                    <option value="full">full payments</option>
                    <option value="deposit">deposit payments</option>
                </select>
            </div>

            {/* Right side */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={textStyle}>cancel</span>
                <input
                    type="number"
                    value={rule.cancelTime}
                    onChange={e => updateRule(rule.id, 'cancelTime', parseInt(e.target.value))}
                    style={numberInputStyle}
                />
                <select
                    value={rule.timeUnit}
                    onChange={e => updateRule(rule.id, 'timeUnit', e.target.value)}
                    style={{...selectInputStyle, minWidth: '60px'}}
                >
                    <option value="hours">hours</option>
                    <option value="days">days</option>
                    <option value="day">day</option>
                </select>
                <span style={textStyle}>before the scheduled appointment to receive</span>
                {rule.paymentType === 'full' ? (
                    <>
                    <input
                        type="number"
                        value={rule.refundValue}
                        onChange={e => updateRule(rule.id, 'refundValue', parseInt(e.target.value))}
                        style={numberInputStyle}
                    />
                    <span style={textStyle}>%</span>
                    </>
                ) : (
                    <select
                    value={rule.refundType}
                    onChange={e => updateRule(rule.id, 'refundType', e.target.value)}
                    style={{...selectInputStyle, minWidth: '100px'}}
                    >
                    <option value="full_deposit">full deposit</option>
                    <option value="half_deposit">half deposit</option>
                    </select>
                )}
                <span style={textStyle}>as a refund</span>
            </div>
        </div>
        <button onClick={() => removeRule(rule.id)} style={actionButtonStyle}>-</button>
        {isLast ? (
            <button onClick={addRule} style={actionButtonStyle}>+</button>
        ) : (
            <div style={{ width: '44px', flexShrink: 0 }} />
        )}
    </div>
  );

  return (
    <div style={containerStyle}>
      <div>
        {rules.map((rule, index) =>
          renderRuleRow(rule, index, index === rules.length - 1)
        )}
      </div>

      <div style={toggleContainerStyle}>
        <span>Allow free cancellation requests</span>
        <ToggleSwitch enabled={allowFreeCancellation} onChange={setAllowFreeCancellation} />
      </div>

      <h2 style={storefrontHeaderStyle}>
        How it appears on your storefront
      </h2>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        <div style={previewBoxStyle}>
          <h3 style={previewTitleStyle}>Cancellation policy</h3>
          {rules.filter(r => r.paymentType === 'full').map(rule => (
            <div key={rule.id} style={previewItemStyle}>
              <div style={previewDateStyle}>
                <p style={{ fontWeight: 500 }}>Before</p>
                <p>15 Mar</p>
                <p>2.00 pm</p>
              </div>
              <div style={previewRefundStyle}>
                <p style={{ fontWeight: 500 }}>{getRefundTitle(rule)}</p>
                <p>{getRefundText(rule)}</p>
              </div>
            </div>
          ))}
        </div>
        <div style={previewBoxStyle}>
          <h3 style={previewTitleStyle}>Cancellation policy</h3>
          {rules.filter(r => r.paymentType === 'deposit').map(rule => (
            <div key={rule.id} style={previewItemStyle}>
              <div style={previewDateStyle}>
                <p style={{ fontWeight: 500 }}>Before</p>
                <p>15 Mar</p>
                <p>2.00 pm</p>
              </div>
              <div style={previewRefundStyle}>
                <p style={{ fontWeight: 500 }}>{getRefundTitle(rule)}</p>
                <p>{getRefundText(rule)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}; 