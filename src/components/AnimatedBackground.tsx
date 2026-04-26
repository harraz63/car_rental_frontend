import React from 'react';

const AnimatedBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Gradient base */}
      <div className="absolute inset-0 bg-gradient-to-br from-dark via-dark to-dark-navy/50" />
      
      {/* Animated gradient orbs */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-cyan/10 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-teal/10 rounded-full blur-[100px] animate-pulse animation-delay-2000" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-dark-navy/30 rounded-full blur-[150px]" />
      
      {/* Grid pattern */}
      <div className="absolute inset-0 grid-bg opacity-50" />
      
      {/* Floating particles */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-cyan/40 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${5 + Math.random() * 5}s`,
            }}
          />
        ))}
      </div>
      
      {/* Wave lines */}
      <svg className="absolute bottom-0 left-0 w-full h-48 opacity-20" viewBox="0 0 1440 200" preserveAspectRatio="none">
        <path
          fill="none"
          stroke="url(#gradient1)"
          strokeWidth="2"
          d="M0,100 C360,150 720,50 1080,100 S1440,150 1440,100"
          className="animate-wave"
        />
        <path
          fill="none"
          stroke="url(#gradient2)"
          strokeWidth="2"
          d="M0,120 C360,170 720,70 1080,120 S1440,170 1440,120"
          className="animate-wave animation-delay-1000"
        />
        <defs>
          <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#06b6d4" />
            <stop offset="100%" stopColor="#14b8a6" />
          </linearGradient>
          <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#14b8a6" />
            <stop offset="100%" stopColor="#06b6d4" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
};

export default AnimatedBackground;
