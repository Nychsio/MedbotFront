// components/Avatar.jsx
import { useState, useEffect, useRef } from 'react';

/**
 * Komponent Avatar zapewniający wysoką jakość wyświetlania zdjęć profilowych
 * Używa techniki Canvas do poprawy jakości renderowania obrazów
 */
const Avatar = ({ src, alt, size = 60, className = '' }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const canvasRef = useRef(null);

  useEffect(() => {
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    
    img.onload = () => {
      // Po załadowaniu obrazu, renderuj go na canvas
      const canvas = canvasRef.current;
      if (!canvas) return;

      // Ustawienie wielkości canvas na 2x dla ekranów HiDPI
      const scale = window.devicePixelRatio || 1;
      canvas.width = size * scale;
      canvas.height = size * scale;
      
      const ctx = canvas.getContext('2d');
      
      // Wyłączenie wygładzania dla lepszej ostrości
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      
      // Ustawienie stylu canvas na właściwy rozmiar w CSS
      canvas.style.width = `${size}px`;
      canvas.style.height = `${size}px`;
      
      // Zastosowanie skalowania dla ekranów HiDPI
      ctx.scale(scale, scale);
      
      // Rysowanie okrągłego obrazu
      ctx.beginPath();
      ctx.arc(size/2, size/2, size/2, 0, Math.PI * 2, true);
      ctx.closePath();
      ctx.clip();
      
      // Rysowanie obrazu dopasowanego do okręgu
      ctx.drawImage(img, 0, 0, size, size);
      
      // Dodanie obramowania
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 3;
      ctx.stroke();
      
      setImageLoaded(true);
    };
    
    img.onerror = () => {
      console.error('Błąd ładowania obrazu:', src);
      // Można tu dodać logikę dla obrazu zastępczego
    };
    
    img.src = src;
  }, [src, size]);
  
  return (
    <div 
      className={`high-quality-avatar ${className}`} 
      style={{ 
        width: `${size}px`, 
        height: `${size}px`,
        borderRadius: '50%',
        overflow: 'hidden',
        backgroundColor: '#f0f0f0' // Tło przed załadowaniem
      }}
    >
      <canvas 
        ref={canvasRef}
        style={{
          display: imageLoaded ? 'block' : 'none',
          borderRadius: '50%'
        }}
      />
      
      {!imageLoaded && (
        <div 
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#999'
          }}
        >
          <span>...</span>
        </div>
      )}
    </div>
  );
};

export default Avatar;