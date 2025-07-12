"use client";
import React, { useState } from "react";
import Image from 'next/image';

interface ProgressButtonProps {
  label: string;
  isActive?: boolean;
  isCompleted?: boolean;
  onClick: () => void;
  icon?: string;
}

export default function ProgressButton({ label, isActive, isCompleted, onClick, icon }: ProgressButtonProps) {
  const [isHovered, setIsHovered] = useState(false);
  
  const baseStyles: React.CSSProperties = {
    padding: "8px 20px",
    borderRadius: "8px",
    borderWidth: "1.5px",
    borderStyle: "solid",
    borderColor: isCompleted ? 'transparent' : "#d1d5db",
    backgroundColor: isHovered && !isCompleted ? "#f8fafc" : (isCompleted ? "#f8fafc" : "transparent"),
    color: "#334155",
    fontWeight: 600,
    fontSize: "16px",
    cursor: "pointer",
    transition: "all 0.2s ease-in-out",
    display: "flex",
    alignItems: "center",
    gap: "8px",
  };

  if (isActive) {
    baseStyles.borderColor = "#2563eb";
    baseStyles.boxShadow = "0 0 0 2px rgba(59, 130, 246, 0.2)";
  }

  return (
    <button
      style={baseStyles}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {icon && <Image src={icon} alt="" width={18} height={18} />}
      {label}
      {isCompleted && <span style={{ color: "#10b981" }}>✓</span>}
    </button>
  );
} 