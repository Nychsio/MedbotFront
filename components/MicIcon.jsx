// MicIcon.jsx - Komponent SVG ikony mikrofonu
// Umieść w folderze components/

import React from 'react';

const MicIcon = ({ isActive }) => {
  return (
    <svg 
      width="20" 
      height="20" 
      viewBox="0 0 24 24" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={`mic-svg ${isActive ? 'mic-active' : ''}`}
    >
      <style jsx>{`
        .mic-svg {
          transition: all 0.3s ease;
        }
        
        .mic-active {
          transform: scale(1.1);
        }
        
        @keyframes pulse {
          0% { opacity: 0.7; }
          50% { opacity: 1; }
          100% { opacity: 0.7; }
        }
        
        .mic-active path {
          animation: pulse 1.5s infinite;
        }
      `}</style>
      {/* Ikona mikrofonu */}
      <path 
        d="M12 14C13.6569 14 15 12.6569 15 11V5C15 3.34315 13.6569 2 12 2C10.3431 2 9 3.34315 9 5V11C9 12.6569 10.3431 14 12 14Z" 
        stroke={isActive ? "#FFFFFF" : "#FFFFFF"} 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
      <path 
        d="M19 11V12C19 15.866 15.866 19 12 19C8.13401 19 5 15.866 5 12V11" 
        stroke={isActive ? "#FFFFFF" : "#FFFFFF"} 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
      <path 
        d="M12 19V22" 
        stroke={isActive ? "#FFFFFF" : "#FFFFFF"} 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
      <path 
        d="M8 22H16" 
        stroke={isActive ? "#FFFFFF" : "#FFFFFF"} 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
      
      {/* Fale dźwiękowe widoczne tylko podczas nagrywania */}
      {isActive && (
        <>
          <path 
            d="M2 10C2 10 3.5 7 6 7C8.5 7 10 10 10 10" 
            stroke="#FFFFFF" 
            strokeWidth="1.5" 
            strokeLinecap="round" 
            strokeLinejoin="round"
            style={{ opacity: 0.8 }}
          />
          <path 
            d="M22 10C22 10 20.5 7 18 7C15.5 7 14 10 14 10" 
            stroke="#FFFFFF" 
            strokeWidth="1.5" 
            strokeLinecap="round" 
            strokeLinejoin="round"
            style={{ opacity: 0.8 }}
          />
        </>
      )}
    </svg>
  );
};

export default MicIcon;