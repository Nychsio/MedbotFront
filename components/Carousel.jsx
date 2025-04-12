// components/Carousel.jsx
import { useState, useEffect } from 'react';
import "../styles/Carousel.css";

const Carousel = ({ slides }) => {
  const [activeSlide, setActiveSlide] = useState(0);
  const [autoplay, setAutoplay] = useState(true);

  // Automatyczne przewijanie slajdów
  useEffect(() => {
    let intervalId;
    
    if (autoplay) {
      intervalId = setInterval(() => {
        handleNextSlide();
      }, 5000); // Zmiana slajdu co 5 sekund
    }
    
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [autoplay, activeSlide]);

  const handleNextSlide = () => {
    setActiveSlide((prev) => (prev + 1) % slides.length);
  };

  const handlePrevSlide = () => {
    setActiveSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const pauseAutoplay = () => {
    setAutoplay(false);
  };

  const resumeAutoplay = () => {
    setAutoplay(true);
  };

  return (
    <section 
      className="carousel" 
      onMouseEnter={pauseAutoplay} 
      onMouseLeave={resumeAutoplay}
    >
      <div 
        className="carousel-inner" 
        style={{ transform: `translateX(-${activeSlide * 100}%)` }}
      >
        {slides.map((slide, index) => (
          <div key={index} className="carousel-slide">
            <img 
              src={slide.image} 
              alt={slide.title} 
              className="carousel-image"
            />
            <div className="carousel-content">
              <h2 className="carousel-title">
                {slide.title.includes("NOWOŚĆ") ? (
                  <>
                    <span className="new-badge">NOWOŚĆ!</span> 
                    <span>Chatbot LuxMed</span>
                  </>
                ) : (
                  slide.title
                )}
              </h2>
              <p className="carousel-description">{slide.description}</p>
            </div>
          </div>
        ))}
      </div>
      
      <button 
        className="carousel-control carousel-control-prev"
        onClick={handlePrevSlide}
        aria-label="Poprzedni slajd"
      >
        &#8592;
      </button>
      
      <button 
        className="carousel-control carousel-control-next"
        onClick={handleNextSlide}
        aria-label="Następny slajd"
      >
        &#8594;
      </button>
      
      <div className="carousel-indicators">
        {slides.map((_, index) => (
          <button 
            key={index}
            className={`carousel-indicator ${activeSlide === index ? 'active' : ''}`}
            onClick={() => setActiveSlide(index)}
            aria-label={`Przejdź do slajdu ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
};

export default Carousel;