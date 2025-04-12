// src/App.jsx
import { useState } from 'react';
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
    }
  ];

  const services = [
    { name: "Konsultacje", icon: "🩺", description: "Konsultacje z lekarzami wszystkich specjalności" },
    { name: "Diagnostyka", icon: "🔬", description: "Kompleksowa diagnostyka laboratoryjna i obrazowa" },
    { name: "Zabiegi", icon: "💉", description: "Szeroki zakres zabiegów ambulatoryjnych" },
    { name: "Rehabilitacja", icon: "🤸", description: "Nowoczesne metody rehabilitacji" }
  ];

  // Debug
  console.log("Services data:", services);

  return (
    <div className="app">
      <Header />
      <main className="main-content">
        <Carousel slides={slides} />
        {/* Początek sekcji usług */}
        <Services services={services} />
        {/* Koniec sekcji usług */}
        <CallToAction />
      </main>
      <Footer />
      <Chat />
    </div>
  );
};

export default App;