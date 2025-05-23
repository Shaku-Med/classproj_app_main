'use client'
import React from 'react';

export const CustomIcons = {
  Logo: () => (
    <svg viewBox="0 0 40 40" className="w-full h-full">
      <defs>
        <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#8B5CF6" />
          <stop offset="100%" stopColor="#EC4899" />
        </linearGradient>
      </defs>
      <circle cx="20" cy="20" r="18" fill="url(#logoGrad)" opacity="0.2"/>
      <path d="M12 15L20 20L28 15V25L20 30L12 25V15Z" fill="url(#logoGrad)" stroke="white" strokeWidth="2"/>
      <circle cx="20" cy="20" r="3" fill="white"/>
    </svg>
  ),
  Home: () => (
    <svg viewBox="0 0 24 24" className="w-full h-full" fill="currentColor">
      <path d="M3 12L5 10V20H19V10L21 12L22.5 10.5L12 0L1.5 10.5L3 12Z"/>
      <circle cx="12" cy="16" r="2" fill="white"/>
    </svg>
  ),
  Videos: () => (
    <svg viewBox="0 0 24 24" className="w-full h-full" fill="currentColor">
      <path d="M8 5V19L19 12L8 5Z"/>
      <circle cx="4" cy="6" r="2"/>
      <circle cx="4" cy="12" r="2"/>
      <circle cx="4" cy="18" r="2"/>
    </svg>
  ),
  Feed: () => (
    <svg viewBox="0 0 24 24" className="w-full h-full" fill="currentColor">
      <rect x="3" y="4" width="18" height="3" rx="1"/>
      <rect x="3" y="10" width="12" height="3" rx="1"/>
      <rect x="3" y="16" width="15" height="3" rx="1"/>
      <circle cx="20" cy="17" r="2"/>
    </svg>
  ),
  Dating: () => (
    <svg viewBox="0 0 24 24" className="w-full h-full" fill="currentColor">
      <path d="M12 21C12 21 21 13.5 21 7.5C21 4.46 18.54 2 15.5 2C13.76 2 12.26 2.85 12 4.07C11.74 2.85 10.24 2 8.5 2C5.46 2 3 4.46 3 7.5C3 13.5 12 21 12 21Z"/>
      <circle cx="9" cy="8" r="1.5" fill="white"/>
      <circle cx="15" cy="8" r="1.5" fill="white"/>
    </svg>
  ),
  Community: () => (
    <svg viewBox="0 0 24 24" className="w-full h-full" fill="currentColor">
      <circle cx="9" cy="8" r="4"/>
      <circle cx="17" cy="8" r="3"/>
      <path d="M3 18V16C3 13.79 6.58 12 9 12C11.42 12 15 13.79 15 16V18"/>
      <path d="M16 18V16.5C16 15.12 18.24 14 21 14V18"/>
    </svg>
  ),
  Chat: () => (
    <svg viewBox="0 0 24 24" className="w-full h-full" fill="currentColor">
      <path d="M20 2H4C2.9 2 2 2.9 2 4V16C2 17.1 2.9 18 4 18H6L10 22L14 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2Z"/>
      <circle cx="8" cy="9" r="1.5" fill="white"/>
      <circle cx="12" cy="9" r="1.5" fill="white"/>
      <circle cx="16" cy="9" r="1.5" fill="white"/>
    </svg>
  ),
  Sparkles: () => (
    <svg viewBox="0 0 24 24" className="w-full h-full" fill="currentColor">
      <path d="M12 0L14.09 8.26L22 6L14.09 8.26L12 0Z"/>
      <path d="M12 24L9.91 15.74L2 18L9.91 15.74L12 24Z"/>
      <path d="M0 12L8.26 9.91L6 2L8.26 9.91L0 12Z"/>
      <path d="M24 12L15.74 14.09L18 22L15.74 14.09L24 12Z"/>
      <circle cx="12" cy="12" r="2"/>
    </svg>
  ),
  Menu: () => (
    <svg viewBox="0 0 24 24" className="w-full h-full" fill="currentColor">
      <rect x="3" y="6" width="18" height="2" rx="1"/>
      <rect x="3" y="11" width="18" height="2" rx="1"/>
      <rect x="3" y="16" width="18" height="2" rx="1"/>
    </svg>
  ),
  Close: () => (
    <svg viewBox="0 0 24 24" className="w-full h-full" fill="currentColor">
      <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  )
}; 