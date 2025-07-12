import React, { useState } from 'react';

interface PolicyButtonProps {
  label: string;
  isActive: boolean;
  onClick: () => void;
}

export const PolicyButton: React.FC<PolicyButtonProps> = ({ label, isActive, onClick }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  const style: React.CSSProperties = {
    padding: "8px 20px",
    borderRadius: "8px",
    border: `1.5px solid ${isActive ? "#2563eb" : "#d1d5db"}`,
    backgroundColor: isHovered ? "#f8fafc" : "transparent",
    color: "#334155",
    fontWeight: 600,
    cursor: "pointer",
    transition: "all 0.2s ease-in-out",
    boxShadow: isActive ? "0 0 0 2px rgba(59, 130, 246, 0.2)" : "none",
  };
  
  return (
    <button 
      style={style} 
      onClick={onClick} 
      onMouseEnter={() => setIsHovered(true)} 
      onMouseLeave={() => setIsHovered(false)}
    >
      {label}
    </button>
  );
}; 