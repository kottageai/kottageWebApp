import React from 'react';

export const containerStyle: React.CSSProperties = {
  fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'",
  color: '#1f2937',
  maxWidth: '1100px',
};

export const ruleRowWrapperStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  marginBottom: '12px',
};

export const ruleRowStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '12px',
    backgroundColor: '#F4F2F0',
    padding: '12px',
    borderRadius: '12px'
};

export const textStyle: React.CSSProperties = {
  fontSize: '14px',
  color: '#4b5563',
  whiteSpace: 'nowrap'
};

export const numberInputStyle: React.CSSProperties = {
  width: '60px',
  padding: '8px',
  borderRadius: '8px',
  border: '1px solid #EAE8E6',
  backgroundColor: 'white',
  textAlign: 'center',
  fontSize: '14px',
  fontWeight: 500,
  flexShrink: 0,
};

export const selectInputStyle: React.CSSProperties = {
  padding: '8px 12px',
  borderRadius: '8px',
  border: '1px solid #EAE8E6',
  backgroundColor: 'white',
  fontSize: '14px',
  fontWeight: 500,
  color: '#1f2937',
  appearance: 'none',
  flexShrink: 0,
  textAlign: 'center',
  textAlignLast: 'center',
};

export const actionButtonStyle: React.CSSProperties = {
  width: '44px',
  height: '44px',
  borderRadius: '8px',
  border: '1px solid #EAE8E6',
  backgroundColor: 'white',
  fontSize: '24px',
  color: '#4b5563',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
};

export const toggleContainerStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '20px',
  backgroundColor: '#F4F2F0',
  borderRadius: '12px',
  marginTop: '24px',
  fontSize: '14px',
  fontWeight: 500,
};

export const storefrontHeaderStyle: React.CSSProperties = {
  fontSize: '20px',
  fontWeight: '600',
  marginTop: '40px',
  marginBottom: '20px'
};

export const previewBoxStyle: React.CSSProperties = {
  backgroundColor: '#F4F2F0',
  padding: '24px',
  borderRadius: '12px',
};

export const previewTitleStyle: React.CSSProperties = {
  fontSize: '16px',
  fontWeight: 600,
  marginBottom: '16px',
  color: '#1f2937'
};

export const previewItemStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  padding: '20px 0',
  borderTop: '1px solid #e5e7eb',
  fontSize: '14px',
  color: '#374051'
};

export const previewDateStyle: React.CSSProperties = {
  textAlign: 'left',
  lineHeight: '1.5'
};

export const previewRefundStyle: React.CSSProperties = {
  textAlign: 'right',
  lineHeight: '1.5'
}; 