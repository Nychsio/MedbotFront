import { useState, useEffect, useRef } from 'react';
import { askQuestion } from '../utils/api.js';
import "../styles/Chat.css";

// Możesz użyć tego komponentu bezpośrednio lub zaimportować VoiceButton z osobnego pliku
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
  
  // Stała definiująca czas ciszy w milisekundach przed zatrzymaniem nagrywania
  const SILENCE_TIMEOUT = 2000; // 2 sekundy ciszy = zatrzymanie nagrywania
  
  // Funkcja zatrzymująca nasłuchiwanie
  const stopListening = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {
        console.error("Błąd podczas zatrzymywania rozpoznawania mowy:", e);
      }
    }
    
    setIsListening(false);
    
    // Wyczyść timeout
    if (silenceTimeoutRef.current) {
      clearTimeout(silenceTimeoutRef.current);
      silenceTimeoutRef.current = null;
    }
  };
  
  // Sprawdzenie czy przeglądarka wspiera rozpoznawanie mowy
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      setIsSpeechSupported(true);
      
      const initRecognition = () => {
        // Inicjalizacja obiektu rozpoznawania mowy
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = false; // Zmiana na false dla lepszego wykrywania ciszy
        recognitionRef.current.interimResults = true;
        recognitionRef.current.lang = 'pl-PL'; // Ustawienie języka na polski
        
        // Obsługa wyniku rozpoznawania
        recognitionRef.current.onresult = (event) => {
          const transcript = Array.from(event.results)
            .map(result => result[0])
            .map(result => result.transcript)
            .join('');
          
          // Aktualizacja pola tekstowego
          setNewMessage(transcript);
          setHasSpoken(true);
          
          // Za każdym razem gdy otrzymamy wynik, resetujemy timer ciszy
          if (silenceTimeoutRef.current) {
            clearTimeout(silenceTimeoutRef.current);
          }
          
          // Ustaw nowy timer ciszy
          silenceTimeoutRef.current = setTimeout(() => {
            console.log("Wykryto ciszę - zatrzymywanie nagrywania");
            stopListening();
          }, SILENCE_TIMEOUT);
        };
        
        // Obsługa błędów
        recognitionRef.current.onerror = (event) => {
          console.error('Błąd rozpoznawania mowy:', event.error);
          
          if (event.error === 'not-allowed') {
            setError("Dostęp do mikrofonu został zablokowany. Sprawdź ustawienia przeglądarki.");
          } else if (event.error === 'no-speech') {
            // Zamiast ustawiać błąd, po prostu restartujemy nasłuchiwanie
            console.log("Nie wykryto mowy, restartuję nasłuchiwanie...");
            if (isListening) {
              try {
                recognitionRef.current.stop();
                // Dajemy przeglądarce chwilę na reset
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
        
        // Zatrzymanie nasłuchiwania po zakończeniu
        recognitionRef.current.onend = () => {
          console.log("Rozpoznawanie mowy zakończone");
          
          // Jeśli użytkownik nic nie powiedział, ale nasłuchiwanie jest nadal aktywne
          // to restartujemy nasłuchiwanie
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
            // Zakończ nasłuchiwanie tylko jeśli użytkownik coś powiedział
            // lub jeśli ręcznie wyłączono nasłuchiwanie
            setIsListening(false);
          }
          
          // Wyczyść timer ciszy
          if (silenceTimeoutRef.current) {
            clearTimeout(silenceTimeoutRef.current);
            silenceTimeoutRef.current = null;
          }
        };
      };
      
      initRecognition();
    }
    
    // Czyszczenie zasobów przy odmontowaniu komponentu
    return () => {
      stopListening();
    };
  }, []);
  
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
  
  // Efekt obsługujący zmianę stanu słuchania
  useEffect(() => {
    if (!isListening) {
      // Zatrzymaj timer ciszy gdy słuchanie jest wyłączone
      if (silenceTimeoutRef.current) {
        clearTimeout(silenceTimeoutRef.current);
        silenceTimeoutRef.current = null;
      }
    }
  }, [isListening]);
  
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
  
  // Funkcja przełączająca nasłuchiwanie głosu
  const toggleVoiceRecognition = () => {
    if (!isSpeechSupported) {
      setError("Twoja przeglądarka nie wspiera rozpoznawania mowy.");
      return;
    }
    
    if (isListening) {
      // Zatrzymanie nagrywania
      stopListening();
    } else {
      try {
        // Reset flagi mówiącej
        setHasSpoken(false);
        
        // Rozpoczęcie nagrywania
        recognitionRef.current.start();
        setIsListening(true);
        setError(null);
        
        // Ustaw timer bezpieczeństwa - zatrzyma nagrywanie po czasie,
        // jeśli nic nie wykryto i nie zadziałały inne mechanizmy
        silenceTimeoutRef.current = setTimeout(() => {
          if (isListening) {
            console.log("Zatrzymanie nagrywania przez timer bezpieczeństwa");
            stopListening();
          }
        }, SILENCE_TIMEOUT * 2); // Dwa razy dłuższy czas na początkową wypowiedź
      } catch (err) {
        console.error('Błąd podczas uruchamiania rozpoznawania mowy:', err);
        setError("Błąd podczas uruchamiania rozpoznawania mowy. Spróbuj ponownie.");
        setIsListening(false);
      }
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
  
  // Efekt pomocniczy dla debugowania animacji
  useEffect(() => {
    // Ten efekt pomoże z debugowaniem animacji fal
    if (isListening) {
      console.log("Nasłuchiwanie rozpoczęte - fale powinny być aktywne");
      // Możemy też wymusić reflow dla lepszej animacji
      const waves = document.querySelectorAll('.sound-wave');
      waves.forEach(wave => {
        void wave.offsetHeight; // Trigger reflow
      });
    } else {
      console.log("Nasłuchiwanie zatrzymane - fale powinny zniknąć");
    }
  }, [isListening]);
  
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
            
            {/* Kontener na fale dźwiękowe z płynnym zanikaniem */}
            <div className={`sound-waves-container ${isListening ? 'waves-active' : 'waves-inactive'}`}>
              <div className="sound-wave"></div>
              <div className="sound-wave"></div>
              <div className="sound-wave"></div>
              <div className="sound-wave"></div>
              <div className="sound-wave"></div>
            </div>
            
            {/* Absolutnie pozycjonowany przezroczysty disclaimer medyczny */}
            <div className="medical-disclaimer-container">
              <div className="medical-disclaimer">
                Wyświetlane wiadomości nie stanowią porady medycznej. W razie problemów zdrowotnych skontaktuj się z lekarzem.
              </div>
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
            
            {/* Przycisk mikrofonu */}
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