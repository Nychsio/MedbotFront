// components/Chat.jsx
import { useState, useEffect, useRef } from 'react';
import { askQuestion } from '../utils/api.js';
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
  };
  
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (newMessage.trim() === "" || isTyping) return;
    
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
    {/* Przycisk czatu */}
    <button 
        className={`chat-button ${isChatOpen ? 'chat-button-hidden' : ''}`}
        onClick={toggleChat}
        aria-label="Otwórz czat"
        onMouseEnter={() => setShowWelcome(true)}
        onMouseLeave={() => setShowWelcome(false)}
      >
        💬
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
    <div className="consultant-avatar">
      <img 
        src="/images/Julia.jpg" 
        alt="Konsultant LuxMed" 
      />
    </div>
  </div>
  
  <div className="chat-header-info">
    <h3 className="chat-title">Julia AI</h3>
    <span className="chat-status">
      <span className="status-dot"></span>
      Dostępna teraz
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
          
          <form onSubmit={handleSendMessage} className="chat-input-form">
            <input 
              type="text" 
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Wpisz wiadomość..." 
              className="chat-input"
              disabled={isTyping}
            />
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