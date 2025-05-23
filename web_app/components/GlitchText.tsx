'use client'
import React from 'react';

interface GlitchTextProps {
  children: React.ReactNode;
  className?: string;
}

export const GlitchText = ({ children, className = "" }: GlitchTextProps) => {
  return (
    <div className={`relative ${className}`}>
      <span className="relative z-10">{children}</span>
      <span 
        className="absolute top-0 left-0 -z-10 text-red-500 opacity-70"
        style={{ transform: 'translate(-2px, -1px)' }}
      >
        {children}
      </span>
      <span 
        className="absolute top-0 left-0 -z-20 text-blue-500 opacity-70"
        style={{ transform: 'translate(2px, 1px)' }}
      >
        {children}
      </span>
    </div>
  );
}; 