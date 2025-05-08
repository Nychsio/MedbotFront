// Header.jsx - z ikoną SVG dla przycisku hamburger
import React, { useState, useEffect } from 'react';
import '../styles/Header.css';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Dodajemy klasę do body przy otwartym menu
  useEffect(() => {
    if (isMobileMenuOpen) {
      // Blokowanie przewijania
      document.body.style.overflow = 'hidden';
      
      // Dodanie klasy do body, co pozwoli ukryć chatbota
      document.body.classList.add('menu-open');
    } else {
      // Przywracanie normalnego stanu
      document.body.style.overflow = 'auto';
      document.body.classList.remove('menu-open');
    }

    return () => {
      // Czyszczenie przy odmontowaniu
      document.body.style.overflow = 'auto';
      document.body.classList.remove('menu-open');
    };
  }, [isMobileMenuOpen]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const activateChatbot = () => {
    // Symulujemy kliknięcie przycisku chatbota
    const chatButton = document.querySelector('.chat-button');
    if (chatButton) {
      chatButton.click();
    }
    
    // Zamykamy menu mobilne po kliknięciu w chatbota
    setIsMobileMenuOpen(false);
  };

  return (
    <header className={`header ${isScrolled ? 'scrolled' : ''}`}>
      <div className="top-bar">
        <div className="top-bar-container">
          <div className="user-links">
            {/* Linki z ikonami SVG */}
            <span className="user-link patient">
              <span className="circle-icon blue-circle">
                <img src="/images/icons/arrow-right-icon.svg" alt="Strzałka" className="icon" />
              </span> 
              Dla Pacjenta
            </span>
            <span className="user-link doctor">
              <span className="circle-icon red-circle">
                <img src="/images/icons/user-icon-red.svg" alt="Lekarz" className="icon" />
              </span> 
              Dla Lekarza
            </span>
            <span className="user-link company">
              <span className="circle-icon blue-circle">
                <img src="/images/icons/building-icon.svg" alt="Firma" className="icon" />
              </span> 
              Dla Firm
            </span>
          </div>
          <div className="account-link">
            <span className="my-account-button">
              <img src="/images/icons/user-icon-white.svg" alt="Użytkownik" className="account-icon" />
              Moje konto
            </span>
          </div>
        </div>
      </div>
      
      <div className="main-header">
        <div className="main-header-container">
          <div className="logo">
            <div className="logo-wrapper">
              <img src="/images/LOGO-LUXMED.png" alt="LuxMed Lublin" className="logo-image" />
            </div>
          </div>
          
          {/* Overlay menu */}
          <div className={`mobile-menu-overlay ${isMobileMenuOpen ? 'active' : ''}`} onClick={toggleMobileMenu}></div>
          
          <nav className={`main-nav ${isMobileMenuOpen ? 'active' : ''}`}>
            <ul className="nav-list">
              <li className="nav-item">
                <span className="nav-link home-icon">
                  <img src="/images/icons/home-icon.svg" alt="Strona główna" className="home-icon-blue" />
                </span>
              </li>
              <li className="nav-item">
                <span className="nav-link">Lekarze</span>
              </li>
              <li className="nav-item dropdown">
                <span className="nav-link">
                  Badania 
                  <img src="/images/icons/chevron-down.svg" alt="Rozwiń" className="dropdown-arrow" />
                </span>
              </li>
              <li className="nav-item dropdown">
                <span className="nav-link">
                  Zabiegi 
                  <img src="/images/icons/chevron-down.svg" alt="Rozwiń" className="dropdown-arrow" />
                </span>
              </li>
              <li className="nav-item dropdown">
                <span className="nav-link">
                  Poradnie 
                  <img src="/images/icons/chevron-down.svg" alt="Rozwiń" className="dropdown-arrow" />
                </span>
              </li>
              <li className="nav-item dropdown">
                <span className="nav-link">
                  Usługi NFZ 
                  <img src="/images/icons/chevron-down.svg" alt="Rozwiń" className="dropdown-arrow" />
                </span>
              </li>
              <li className="nav-item dropdown">
                <span className="nav-link">
                  Informacje 
                  <img src="/images/icons/chevron-down.svg" alt="Rozwiń" className="dropdown-arrow" />
                </span>
              </li>
              <li className="nav-item dropdown">
                <span className="nav-link">
                  Kontakt 
                  <img src="/images/icons/chevron-down.svg" alt="Rozwiń" className="dropdown-arrow" />
                </span>
              </li>
              
              {/* Chatbot pozostaje jako link, ponieważ ma działać */}
              <li className="nav-item mobile-only chatbot-item">
                <a href="#" className="nav-link" onClick={activateChatbot}>
                  <img src="/images/icons/chat-icon.svg" alt="Chatbot" className="chatbot-icon" />
                  Chatbot AI
                </a>
              </li>
            </ul>
          </nav>
          
          <div className="search-button">
            <button type="button" aria-label="Wyszukaj">
              <img src="/images/icons/search-icon.svg" alt="Szukaj" className="search-icon" />
            </button>
          </div>
          
          {/* Przycisk hamburger menu z ikoną SVG */}
          <div className="mobile-menu-button" onClick={toggleMobileMenu}>
            <img src="/images/icons/hamburger-button-svg.svg" alt="Menu" className="hamburger-icon" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;