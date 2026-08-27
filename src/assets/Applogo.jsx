import React from 'react';

export default function AppLogo({ size = 42, className = '' }) {
  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="drop-shadow-[0_4px_12px_rgba(88,101,242,0.4)]"
      >
        <defs>
          {/* Main Gradient */}
          <linearGradient id="brandGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#5865F2" />
            <stop offset="100%" stopColor="#3B82F6" />
          </linearGradient>
          {/* Accent Pulse Dot Gradient */}
          <linearGradient id="dotGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#23A55A" />
            <stop offset="100%" stopColor="#10B981" />
          </linearGradient>
        </defs>

        {/* Outer Rounded Chat Bubble */}
        <rect width="48" height="48" rx="14" fill="url(#brandGradient)" />

        {/* Inner Chat Icon / Waves */}
        <path
          d="M14 20C14 16.6863 16.6863 14 20 14H28C31.3137 14 34 16.6863 34 20V24C34 27.3137 31.3137 30 28 30H20.8284C20.298 30 19.7893 30.2107 19.4142 30.5858L16 34V22C14.8954 22 14 21.1046 14 20Z"
          fill="white"
          fillOpacity="0.95"
        />

        {/* Chat dots */}
        <circle cx="21" cy="22" r="1.5" fill="#5865F2" />
        <circle cx="25" cy="22" r="1.5" fill="#5865F2" />
        <circle cx="29" cy="22" r="1.5" fill="#5865F2" />

        {/* Live Active Status Ring */}
        <circle cx="38" cy="10" r="4" fill="url(#dotGradient)" stroke="#141517" strokeWidth="2" />
      </svg>
    </div>
  );
}