// src/App.jsx - Z funkcją zapewniającą widoczność chatbota
import { useState, useEffect } from 'react';
import Header from '../components/Header.jsx';
import Footer from '../components/Footer.jsx';
import Carousel from '../components/Carousel.jsx';
import Services from '../components/Services.jsx';
import CallToAction from '../components/CallToAction.jsx';
import Chat from '../components/Chat.jsx';
import '../styles/App.css';

const App = () => {
  // Dane, które mogą być w przyszłości pobierane z API
  const slides = [
    {
      image: "/images/medical-care.jpg", // Lokalna ścieżka do obrazu
      title: "Kompleksowa opieka medyczna",
      description: "Oferujemy szeroki zakres usług medycznych dla całej rodziny"
    },
    {
      image: "/images/medical-equipment.jpg", // Lokalna ścieżka do obrazu
      title: "Nowoczesny sprzęt medyczny",
      description: "Korzystamy z najnowocześniejszych technologii dla Twojego zdrowia"
    },
    {
      image: "/images/specialists.jpg", // Lokalna ścieżka do obrazu
      title: "Doświadczeni specjaliści",
      description: "Nasz zespół to uznani lekarze z wieloletnim doświadczeniem"
    },
    {
      image: "/images/chatbot.jpg", // Lokalna ścieżka do obrazu
      title: "NOWOŚĆ! Chatbot LuxMed",
      description: "Teraz możesz szybko uzyskać pomoc i informacje poprzez naszego inteligentnego asystenta"
    },
    {
      image: "/images/julia-documentation.jpg", // Nowy obraz dla slajdu PDF
      title: "Dowiedz się więcej jak powstała Julia",
      description: "Poznaj szczegóły procesu wdrożenia naszego medycznego chatbota - pobierz dokumentację PDF"
    }
  ];

  const services = [
    { name: "Konsultacje", icon: "🩺", description: "Konsultacje z lekarzami wszystkich specjalności" },
    { name: "Diagnostyka", icon: "🔬", description: "Kompleksowa diagnostyka laboratoryjna i obrazowa" },
    { name: "Zabiegi", icon: "💉", description: "Szeroki zakres zabiegów ambulatoryjnych" },
    { name: "Rehabilitacja", icon: "🤸", description: "Nowoczesne metody rehabilitacji" }
  ];

  // Efekt, który zapewnia widoczność chatbota zawsze
  useEffect(() => {
    // Funkcja zapewniająca widoczność chatbota
    const ensureChatbotVisibility = () => {
      // Sprawdzanie czy przycisk chatbota istnieje
      const chatButton = document.querySelector('.chat-button');
      if (chatButton) {
        // Reset stylów ukrywających chatbota
        chatButton.style.display = 'flex';
        chatButton.style.visibility = 'visible';
        chatButton.style.opacity = '1';
        chatButton.style.position = 'fixed';
        chatButton.style.zIndex = '9999';
        
        // Tylko jeśli chatbot jest ukryty, to usuń klasę .chat-button-hidden
        if (chatButton.classList.contains('chat-button-hidden') && 
            !document.querySelector('.chat-window')) {
          chatButton.classList.remove('chat-button-hidden');
        }
      }
    };

    // Wykonaj funkcję po załadowaniu strony
    ensureChatbotVisibility();

    // Wykonaj funkcję po każdej zmianie rozmiaru okna
    window.addEventListener('resize', ensureChatbotVisibility);

    // Wykonaj funkcję co 500ms przez pierwsze 5 sekund
    const intervalId = setInterval(ensureChatbotVisibility, 500);
    setTimeout(() => clearInterval(intervalId), 5000);

    // Czyszczenie przy odmontowaniu komponentu
    return () => {
      window.removeEventListener('resize', ensureChatbotVisibility);
      clearInterval(intervalId);
    };
  }, []);

  return (
    <div className="app">
      <Header />
      <main className="main-content">
        <Carousel slides={slides} />
        <Services services={services} />
        <CallToAction />
      </main>
      <Footer />
      <Chat /> {/* Chatbot jest renderowany na najwyższym poziomie, co jest ważne */}
    </div>
  );
};

export default App;