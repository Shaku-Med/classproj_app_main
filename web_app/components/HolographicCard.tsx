'use client'
import React, { useState } from 'react';

interface HolographicCardProps {
  children: React.ReactNode;
  className?: string;
}

export const HolographicCard = ({ children, className = "" }: HolographicCardProps) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    setMousePosition({ x, y });
  };

  return (
    <div
      className={`relative overflow-hidden rounded-2xl border border-white/10 backdrop-blur-xl ${className}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        background: isHovered 
          ? `radial-gradient(circle at ${mousePosition.x * 100}% ${mousePosition.y * 100}%, rgba(139, 92, 246, 0.3) 0%, rgba(236, 72, 153, 0.2) 50%, transparent 100%)`
          : 'rgba(0, 0, 0, 0.1)',
        transform: isHovered 
          ? `perspective(1000px) rotateX(${(mousePosition.y - 0.5) * 10}deg) rotateY(${(mousePosition.x - 0.5) * 10}deg) scale(1.05)`
          : 'none',
        transition: 'all 0.2s ease-out',
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 via-transparent to-pink-500/20 opacity-50" />
      {children}
    </div>
  );
}; 