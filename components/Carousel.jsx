// components/Carousel.jsx
import { useState, useEffect, useRef } from 'react';
import "../styles/Carousel.css";

const Carousel = ({ slides }) => {
  const [activeSlide, setActiveSlide] = useState(0);
  const [autoplay, setAutoplay] = useState(true);
  const timerRef = useRef(null);
  
  // Znajduje indeks slajdu chatbota
  const chatbotSlideIndex = slides.findIndex(slide => 
    slide.title.includes("NOWOŚĆ") || slide.title.includes("Chatbot")
  );

  // Znajduje indeks slajdu PDF
  const pdfSlideIndex = slides.findIndex(slide => 
    slide.title.includes("PDF") || slide.title.includes("dokumentacja") || slide.title.includes("Julia")
  );

  // Funkcja ustalająca czas wyświetlania aktualnego slajdu
  const getSlideDisplayTime = (slideIndex) => {
    // Jeśli to slajd z chatbotem lub PDF, pokazujemy go dłużej (7 sekund)
    if (slideIndex === chatbotSlideIndex || slideIndex === pdfSlideIndex) {
      return 7000;
    }
    // Pozostałe slajdy pokazujemy standardowo przez 4 sekundy
    return 4000;
  };

  // Automatyczne przewijanie slajdów z różnymi czasami dla różnych slajdów
  useEffect(() => {
    const setupNextSlideTimer = () => {
      if (autoplay) {
        // Wyczyść poprzedni timer jeśli istnieje
        if (timerRef.current) {
          clearTimeout(timerRef.current);
        }
        
        // Ustaw nowy timer z odpowiednim czasem dla bieżącego slajdu
        timerRef.current = setTimeout(() => {
          // Użyj niestandardowej logiki, aby chatbot i PDF pojawiały się częściej
          if (activeSlide === chatbotSlideIndex || activeSlide === pdfSlideIndex) {
            // Po slajdzie specjalnym przechodzimy do następnego normalnie
            setActiveSlide((prev) => (prev + 1) % slides.length);
          } else {
            // Jest 40% szans, że przejdziemy do specjalnego slajdu zamiast do następnego
            const goToSpecial = Math.random() < 0.4;
            
            if (goToSpecial) {
              // Losowo wybieramy między chatbotem a PDF
              const specialSlides = [chatbotSlideIndex, pdfSlideIndex].filter(index => index !== -1);
              const randomSpecial = specialSlides[Math.floor(Math.random() * specialSlides.length)];
              setActiveSlide(randomSpecial);
            } else {
              // Przechodzimy normalnie do następnego
              setActiveSlide((prev) => (prev + 1) % slides.length);
            }
          }
        }, getSlideDisplayTime(activeSlide));
      }
    };
    
    setupNextSlideTimer();
    
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [autoplay, activeSlide, chatbotSlideIndex, pdfSlideIndex, slides.length]);

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

  const handleSlideClick = (e, index) => {
    // Jeśli to slajd chatbota
    if (index === chatbotSlideIndex) {
      e.preventDefault();
      // Znajdź przycisk czatu i kliknij go
      const chatButton = document.querySelector('.chat-button');
      if (chatButton) {
        chatButton.click();
      }
    }
    // Jeśli to slajd PDF
    else if (index === pdfSlideIndex) {
      e.preventDefault();
      // Pobierz PDF (założenie: plik znajduje się w public/documents/)
      const link = document.createElement('a');
      link.href = '/documents/julia-chatbot-dokumentacja.pdf';
      link.download = 'LuxMed-Julia-Chatbot-Dokumentacja.pdf';
      link.click();
    }
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
          <div 
            key={index} 
            className="carousel-slide" 
            onClick={(e) => handleSlideClick(e, index)}
            style={{
              cursor: (index === chatbotSlideIndex || index === pdfSlideIndex) ? 'pointer' : 'default'
            }}
          >
            <img 
              src={slide.image} 
              alt={slide.title} 
              className="carousel-image"
            />
            <div className="carousel-content">
              <div className="carousel-text-container">
                <h2 className="carousel-title">
                  {index === chatbotSlideIndex ? (
                    <>
                      <span className="new-badge">NOWOŚĆ!</span> 
                      <span className="chatbot-title">Chatbot LuxMed</span>
                    </>
                  ) : index === pdfSlideIndex ? (
                    <>
                      <span className="pdf-badge">📑</span> 
                      <span className="pdf-title">{slide.title}</span>
                    </>
                  ) : (
                    slide.title
                  )}
                </h2>
                <p className="carousel-description">{slide.description}</p>
                {index === pdfSlideIndex && (
                  <div className="pdf-download-hint">
                    <span className="download-icon">📥</span>
                    <span>Kliknij aby pobrać dokumentację PDF</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <button 
        className="carousel-control carousel-control-prev"
        onClick={handlePrevSlide}
        aria-label="Poprzedni slajd"
      >
        &lt;
      </button>
      
      <button 
        className="carousel-control carousel-control-next"
        onClick={handleNextSlide}
        aria-label="Następny slajd"
      >
        &gt;
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