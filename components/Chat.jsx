import { useState, useEffect, useRef } from 'react';
import { askQuestion } from '../utils/api.js';
import "../styles/Chat.css";

// AutoResizeTextarea: automatycznie dostosowuje wysokość i obsługuje Enter/Shift+Enter
const AutoResizeTextarea = ({ value, onChange, placeholder, disabled, onEnter }) => {
  const textareaRef = useRef(null);

  // Funkcja dostosowująca wysokość
  const adjustHeight = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    textarea.style.height = '36px'; // reset wysokości
    const newHeight = Math.min(textarea.scrollHeight, 120); // max 120px
    textarea.style.height = `${newHeight}px`;
  };

  useEffect(() => {
    adjustHeight();
  }, [value]);

  const handleChange = (e) => {
    onChange(e);
    // adjustHeight wywoła się automatycznie w useEffect
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (onEnter) onEnter(e);
    }
  };

  return (
    <textarea
      ref={textareaRef}
      className="chat-input-textarea"
      value={value}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      placeholder={placeholder}
      disabled={disabled}
      rows={1}
      maxLength={250}
      style={{ resize: 'none', overflow: 'hidden' }}
    />
  );
};

const VoiceButton = ({ isListening, isDisabled, onClick }) => {
  return (
    <button 
      type="button"
      onClick={onClick}
      className={`chat-mic-button ${isListening ? 'chat-mic-active' : ''}`}
      aria-label={isListening ? "Zatrzymaj nagrywanie" : "Zacznij nagrywać"}
      disabled={isDisabled}
    >
      🎤
      {isListening && <span className="listening-indicator">Słucham...</span>}
    </button>
  );
};

const Chat = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, text: "Witamy w czacie LuxMed Lublin. W czym możemy pomóc?", sender: "bot", timestamp: new Date() }
  ]);
  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState(null);
  const [isListening, setIsListening] = useState(false);
  const [isSpeechSupported, setIsSpeechSupported] = useState(false);
  const [hasSpoken, setHasSpoken] = useState(false); // Czy użytkownik coś powiedział
  
  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);
  const silenceTimeoutRef = useRef(null); // Timer dla wykrywania ciszy
  const welcomeShown = useRef(false); // Ref dla wiadomości powitalnej
  
  const SILENCE_TIMEOUT = 2000; // 2 sekundy ciszy = zatrzymanie nagrywania
  
  const stopListening = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {
        console.error("Błąd podczas zatrzymywania rozpoznawania mowy:", e);
      }
    }
    
    setIsListening(false);
    
    if (silenceTimeoutRef.current) {
      clearTimeout(silenceTimeoutRef.current);
      silenceTimeoutRef.current = null;
    }
  };
  
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      setIsSpeechSupported(true);
      
      const initRecognition = () => {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = false;
        recognitionRef.current.interimResults = true;
        recognitionRef.current.lang = 'pl-PL';
        
        recognitionRef.current.onresult = (event) => {
          const transcript = Array.from(event.results)
            .map(result => result[0])
            .map(result => result.transcript)
            .join('');
          
          setNewMessage(transcript);
          setHasSpoken(true);
          
          if (silenceTimeoutRef.current) {
            clearTimeout(silenceTimeoutRef.current);
          }
          
          silenceTimeoutRef.current = setTimeout(() => {
            console.log("Wykryto ciszę - zatrzymywanie nagrywania");
            stopListening();
          }, SILENCE_TIMEOUT);
        };
        
        recognitionRef.current.onerror = (event) => {
          console.error('Błąd rozpoznawania mowy:', event.error);
          
          if (event.error === 'not-allowed') {
            setError("Dostęp do mikrofonu został zablokowany. Sprawdź ustawienia przeglądarki.");
          } else if (event.error === 'no-speech') {
            console.log("Nie wykryto mowy, restartuję nasłuchiwanie...");
            if (isListening) {
              try {
                recognitionRef.current.stop();
                setTimeout(() => {
                  if (isListening) {
                    try {
                      recognitionRef.current.start();
                    } catch (e) {
                      console.error("Błąd podczas restartu rozpoznawania:", e);
                      setIsListening(false);
                    }
                  }
                }, 100);
              } catch (e) {
                console.error("Błąd podczas zatrzymywania rozpoznawania:", e);
              }
            }
            return;
          }
          
          setIsListening(false);
        };
        
        recognitionRef.current.onend = () => {
          console.log("Rozpoznawanie mowy zakończone");
          
          if (isListening && !hasSpoken) {
            console.log("Restart nasłuchiwania po automatycznym zakończeniu");
            try {
              setTimeout(() => {
                if (isListening) {
                  try {
                    recognitionRef.current.start();
                  } catch (e) {
                    console.error("Błąd podczas restartu rozpoznawania:", e);
                    setIsListening(false);
                  }
                }
              }, 100);
            } catch (e) {
              console.error("Błąd podczas restartu rozpoznawania:", e);
              setIsListening(false);
            }
          } else {
            setIsListening(false);
          }
          
          if (silenceTimeoutRef.current) {
            clearTimeout(silenceTimeoutRef.current);
            silenceTimeoutRef.current = null;
          }
        };
      };
      
      initRecognition();
    }
    
    return () => {
      stopListening();
    };
  }, []);
  
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);
  
  useEffect(() => {
    const checkScreenSpace = () => {
      if (window.innerWidth < 320 || document.body.classList.contains('menu-open')) {
        setShowWelcome(false);
        return;
      }

      if (!welcomeShown.current) {
        setShowWelcome(true);
        welcomeShown.current = true;

        const hideTimer = setTimeout(() => {
          setShowWelcome(false);
        }, 5000);

        return () => clearTimeout(hideTimer);
      }
    };

    const timer = setTimeout(checkScreenSpace, 1000);

    window.addEventListener('resize', checkScreenSpace);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', checkScreenSpace);
    };
  }, []);
  
  useEffect(() => {
    if (!isListening) {
      if (silenceTimeoutRef.current) {
        clearTimeout(silenceTimeoutRef.current);
        silenceTimeoutRef.current = null;
      }
    }
  }, [isListening]);
  
  useEffect(() => {
    if (isListening) {
      console.log("Nasłuchiwanie rozpoczęte - fale powinny być aktywne");
      const waves = document.querySelectorAll('.sound-wave');
      waves.forEach(wave => {
        void wave.offsetHeight;
      });
    } else {
      console.log("Nasłuchiwanie zatrzymane - fale powinny zniknąć");
    }
  }, [hasSpoken, isListening]);
  
  useEffect(() => {
    if (isChatOpen) {
      setShowWelcome(false);
      if (messages.length === 0) {
        setMessages([{
          id: 1,
          text: "Hej, jestem wirtualnym asystentem LuxMed! Jak mogę Ci pomóc?",
          sender: "bot",
          timestamp: new Date()
        }]);
      }
    }
  }, [isChatOpen, messages.length]);

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
    setError(null);
    
    if (!isChatOpen === false && isListening) {
      stopListening();
    }
  };
  
  const toggleVoiceRecognition = () => {
    if (!isSpeechSupported) {
      setError("Twoja przeglądarka nie wspiera rozpoznawania mowy.");
      return;
    }
    
    if (isListening) {
      stopListening();
    } else {
      try {
        setHasSpoken(false);
        
        recognitionRef.current.start();
        setIsListening(true);
        setError(null);
        
        silenceTimeoutRef.current = setTimeout(() => {
          if (isListening) {
            console.log("Zatrzymanie nagrywania przez timer bezpieczeństwa");
            stopListening();
          }
        }, SILENCE_TIMEOUT * 2);
      } catch (err) {
        console.error('Błąd podczas uruchamiania rozpoznawania mowy:', err);
        setError("Błąd podczas uruchamiania rozpoznawania mowy. Spróbuj ponownie.");
        setIsListening(false);
      }
    }
  };
  
  const handleSendMessage = async (e) => {
    if (e) e.preventDefault();
    if (newMessage.trim() === "" || isTyping) return;
    
    if (isListening) {
      stopListening();
    }
    
    const userMessage = {
      id: messages.length + 1,
      text: newMessage,
      sender: "user",
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    const questionText = newMessage.trim();
    setNewMessage("");
    setIsTyping(true);
    setError(null);
    
    try {
      const answer = await askQuestion(questionText);
      
      const botMessage = {
        id: Date.now(),
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
              opacity: '0.9',
              filter: 'contrast(1.1) brightness(1.05)'
            }}
          />
        </div>
      </button>
      
      {showWelcome && !isChatOpen && (
        <div className="welcome-message">
          {window.innerWidth > 400 
            ? "Hej, jestem wirtualnym asystentem LuxMed! Masz jakieś pytanie?" 
            : "Potrzebujesz pomocy? Kliknij tutaj!"}
        </div>
      )}
        
      {isChatOpen && (
        <div className="chat-window">
          <div className="chat-header">
            <div className="consultant-avatar-container">
              <div className={`consultant-avatar ${isListening ? 'avatar-recording' : ''}`}>
                <img 
                  src="/images/Julia.webp" 
                  alt="Konsultant LuxMed"
                  style={{
                    opacity: '0.9',
                    filter: 'contrast(1.1) brightness(1.05)'
                  }}
                />
              </div>
            </div>
            
            <div className="chat-header-info">
              <div className="chat-title-container">
                <h3 className="chat-title">Julia AI</h3>
                <img src="/images/LOGO-LUXMED.png" alt="LuxMed" className="luxmed-logo" />
              </div>
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
            
            <div className={`sound-waves-container ${isListening ? 'waves-active' : 'waves-inactive'}`}>
              <div className="sound-wave"></div>
              <div className="sound-wave"></div>
              <div className="sound-wave"></div>
              <div className="sound-wave"></div>
              <div className="sound-wave"></div>
            </div>
            
            <div className="medical-disclaimer-container">
              <div className="medical-disclaimer">
                Wyświetlane wiadomości są generowane przez AI i nie stanowią porady medycznej. W razie problemów zdrowotnych skontaktuj się z lekarzem. Wiadomośći mogą być zapoisane w celach analitycznych.
              </div>
            </div>
          </div>
          
          <form onSubmit={handleSendMessage} className="chat-input-form">
            <AutoResizeTextarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Wpisz wiadomość lub kliknij mikrofon, aby mówić..."
              disabled={isTyping}
              onEnter={handleSendMessage}
            />
            
            {isSpeechSupported && (
              <VoiceButton 
                isListening={isListening}
                isDisabled={isTyping}
                onClick={toggleVoiceRecognition}
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