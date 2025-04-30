import { useState, useEffect, useRef } from 'react';
import { askQuestion } from '../utils/api.js';
import useVoiceRecognition from '../hooks/useVoiceRecognition';
import VoiceButton from './VoiceButton';
import "../styles/Chat.css";

const Chat = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, text: "Witamy w czacie LuxMed Lublin. W czym możemy pomóc?", sender: "bot", timestamp: new Date() }
  ]);
  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState(null);
  
  const messagesEndRef = useRef(null);
  
  // Korzystamy z hooka rozpoznawania mowy
  const { 
    transcript, 
    isListening, 
    isSpeechSupported, 
    error: voiceError, 
    toggleListening, 
    stopListening,
    resetTranscript
  } = useVoiceRecognition({
    onTextChange: (text) => setNewMessage(text)
  });
  
  // Obsługa błędu z rozpoznawania mowy
  useEffect(() => {
    if (voiceError) {
      setError(voiceError);
    }
  }, [voiceError]);
  
  // Automatyczne przewijanie do najnowszej wiadomości
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);
  
  useEffect(() => {
    // Automatyczne pokazanie powitania przy pierwszym renderze
    const timer = setTimeout(() => {
      setShowWelcome(true);
      
      // Autoukrywanie wiadomości po 5 sekundach
      const hideTimer = setTimeout(() => {
        setShowWelcome(false);
      }, 5000);
      
      return () => clearTimeout(hideTimer);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);
  
  const welcomeText = window.innerWidth > 400 
    ? "Hej, jestem Julia AI asystentem LuxMed! Masz jakieś pytanie?" 
    : "Potrzebujesz pomocy? Kliknij tutaj!";
  
  useEffect(() => {
    if (isChatOpen) {
      setShowWelcome(false); // Ukryj powitanie po otwarciu czatu
      if (messages.length === 0) {
        // Dodaj powitalną wiadomość w czacie
        setMessages([{
          id: 1,
          text: "Hej, jestem wirtualnym asystentem LuxMed! Jak mogę Ci pomóc?",
          sender: "bot",
          timestamp: new Date()
        }]);
      }
    }
  }, [isChatOpen]);

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
    setError(null); // Resetujemy błędy przy zamknięciu/otwarciu czatu
    
    // Zatrzymujemy nasłuchiwanie głosu przy zamknięciu czatu
    if (!isChatOpen === false && isListening) {
      stopListening();
    }
  };
  
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (newMessage.trim() === "" || isTyping) return;
    
    // Zatrzymaj nasłuchiwanie jeśli jest aktywne
    if (isListening) {
      stopListening();
    }
    
    // Dodajemy wiadomość użytkownika
    const userMessage = {
      id: messages.length + 1,
      text: newMessage,
      sender: "user",
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    const questionText = newMessage.trim(); // Zapisujemy tekst pytania
    setNewMessage(""); // Czyścimy pole tekstowe
    resetTranscript(); // Resetujemy transkrypcję
    setIsTyping(true); // Pokazujemy indykator ładowania
    setError(null); // Resetujemy błąd
    
    try {
      // Wysyłamy pytanie do API i czekamy na odpowiedź
      const answer = await askQuestion(questionText);
      
      // Dodajemy odpowiedź bota
      const botMessage = {
        id: Date.now(), // Używamy timestampa jako ID dla unikalności
        text: answer,
        sender: "bot",
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Błąd podczas wysyłania wiadomości:', error);
      setError("Wystąpił problem z połączeniem. Spróbuj ponownie.");
    } finally {
      setIsTyping(false);
    }
  };
  
  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  return (
    <>
      {/* Przycisk czatu ze zdjęciem Julii */}
      <button 
        className={`chat-button ${isChatOpen ? 'chat-button-hidden' : ''}`}
        onClick={toggleChat}
        aria-label="Otwórz czat"
        onMouseEnter={() => setShowWelcome(true)}
        onMouseLeave={() => setShowWelcome(false)}
      >
        <div className="chat-button-avatar">
          <div className="avatar-container"></div>
          <img src="/images/Julia.webp" 
            alt="Julia AI" 
            style={{
              opacity: '0.9', // Lekka przezroczystość zdjęcia
              filter: 'contrast(1.1) brightness(1.05)' // Poprawa jakości zdjęcia
            }}
          />
        </div>
      </button>
      
      {/* Wyskakująca wiadomość powitalna */}
      {showWelcome && !isChatOpen && (
        <div className="welcome-message">
          Hej, jestem wirtualnym asystentem LuxMed! Masz jakieś pytanie?
        </div>
      )}

      {/* Okno czatu */}
      {isChatOpen && (
        <div className="chat-window">
          <div className="chat-header">
            <div className="consultant-avatar-container">
              <div className={`consultant-avatar ${isListening ? 'avatar-recording' : ''}`}>
                <img 
                  src="/images/Julia.webp" 
                  alt="Konsultant LuxMed"
                  style={{
                    opacity: '0.9', // Lekka przezroczystość zdjęcia
                    filter: 'contrast(1.1) brightness(1.05)' // Poprawa jakości zdjęcia
                  }}
                />
              </div>
            </div>
            
            <div className="chat-header-info">
              <h3 className="chat-title">Julia AI</h3>
              <span className={`chat-status ${isTyping ? 'thinking-status' : ''}`}>
                <span className="status-dot"></span>
                {isTyping ? 'Myśli...' : 'Dostępna teraz'}
              </span>
            </div>
            
            <button 
              className="chat-close-button" 
              onClick={toggleChat}
              aria-label="Zamknij czat"
            >
              ✕
            </button>
          </div>
          
          <div className="chat-messages">
            <div className="messages-container">
              {messages.map((message) => (
                <div 
                  key={message.id} 
                  className={`chat-message ${message.sender === 'user' ? 'user-message' : 'bot-message'}`}
                >
                  <div className="message-content">
                    {message.text}
                  </div>
                  <div className="message-timestamp">
                    {formatTime(message.timestamp)}
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="chat-message bot-message">
                  <div className="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              )}
              
              {error && (
                <div className="chat-error">
                  {error}
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
            
            {/* Absolutnie pozycjonowany przezroczysty disclaimer medyczny */}
            <div className="medical-disclaimer-container">
              <div className="medical-disclaimer">
                Wyświetlane wiadomości nie stanowią porady medycznej. W razie problemów zdrowotnych skontaktuj się z lekarzem.
              </div>
            </div>
            
            {/* Kontener na fale dźwiękowe z płynnym zanikaniem */}
            <div className={`sound-waves-container ${isListening ? 'waves-active' : 'waves-inactive'}`}>
              <div className="sound-wave"></div>
              <div className="sound-wave"></div>
              <div className="sound-wave"></div>
              <div className="sound-wave"></div>
              <div className="sound-wave"></div>
            </div>
          </div>
          
          <form onSubmit={handleSendMessage} className="chat-input-form">
            <input 
              type="text" 
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Wpisz wiadomość lub kliknij mikrofon, aby mówić..." 
              className="chat-input"
              disabled={isTyping}
            />
            
            {/* Użycie komponentu przycisku mikrofonu */}
            {isSpeechSupported && (
              <VoiceButton 
                isListening={isListening}
                isDisabled={isTyping}
                onClick={toggleListening}
              />
            )}
            
            <button 
              type="submit" 
              className="chat-send-button"
              disabled={newMessage.trim() === "" || isTyping}
              aria-label="Wyślij wiadomość"
            >
              ➤
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export default Chat;