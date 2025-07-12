import React from 'react';

interface RadioOption {
  value: string;
  label: string;
  expandedContent?: React.ReactNode;
}

interface RadioSelectProps {
  options: RadioOption[];
  selected: string;
  onChange: (value: string) => void;
  allowExpansion?: boolean;
}

export const RadioSelect: React.FC<RadioSelectProps> = ({
  options,
  selected,
  onChange,
  allowExpansion = false,
}) => {
  const handleOptionClick = (value: string) => {
    onChange(value);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {options.map(option => {
        const isSelected = selected === option.value;
        const isExpanded = allowExpansion && isSelected && option.expandedContent;
        const hasExpandableContent = allowExpansion && option.expandedContent;
        
        return (
          <div key={option.value}>
            <div
              onClick={() => handleOptionClick(option.value)}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '16px',
                borderRadius: isExpanded ? '12px 12px 0 0' : 12,
                border: `1.5px solid ${isSelected ? '#3b82f6' : '#e5e7eb'}`,
                backgroundColor: isSelected ? '#eff6ff' : 'white',
                cursor: 'pointer',
                boxShadow: isSelected ? '0 1px 2px 0 rgb(0 0 0 / 0.05)' : 'none',
                transition: 'all 0.2s ease-in-out',
              }}
            >
              <span style={{ fontWeight: 500, color: '#1f2937' }}>{option.label}</span>
              <div
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: '50%',
                  border: `1.5px solid ${isSelected ? '#3b82f6' : '#d1d5db'}`,
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                {isSelected && (
                  <div
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: '50%',
                      backgroundColor: '#3b82f6',
                    }}
                  />
                )}
              </div>
            </div>
            
            {isExpanded && (
              <div
                style={{
                  borderLeft: '1.5px solid #3b82f6',
                  borderRight: '1.5px solid #3b82f6',
                  borderBottom: '1.5px solid #3b82f6',
                  borderRadius: '0 0 12px 12px',
                  backgroundColor: '#f8fafc',
                }}
              >
                <div style={{ padding: '16px' }}>
                  {option.expandedContent}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}; 