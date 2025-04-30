// src/hooks/useVoiceRecognition.js
import { useState, useEffect, useRef } from 'react';

/**
 * Hook do obsługi rozpoznawania mowy
 * @param {Object} options - Opcje konfiguracyjne
 * @param {string} options.language - Język rozpoznawania mowy (domyślnie 'pl-PL')
 * @param {number} options.silenceTimeout - Czas ciszy w ms po którym rozpoznawanie zostanie zatrzymane (domyślnie 2000)
 * @param {function} options.onTextChange - Callback wywoływany gdy tekst się zmienia
 * @returns {Object} - Obiekt zawierający stan i metody do kontrolowania rozpoznawania mowy
 */
const useVoiceRecognition = ({ 
  language = 'pl-PL', 
  silenceTimeout = 2000,
  onTextChange = () => {} 
} = {}) => {
  const [isListening, setIsListening] = useState(false);
  const [isSpeechSupported, setIsSpeechSupported] = useState(false);
  const [error, setError] = useState(null);
  const [transcript, setTranscript] = useState('');
  const [hasSpoken, setHasSpoken] = useState(false);
  
  const recognitionRef = useRef(null);
  const silenceTimeoutRef = useRef(null);
  
  // Sprawdzenie czy przeglądarka wspiera rozpoznawanie mowy
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      setIsSpeechSupported(true);
      
      const initRecognition = () => {
        // Inicjalizacja obiektu rozpoznawania mowy
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = false;
        recognitionRef.current.interimResults = true;
        recognitionRef.current.lang = language;
        
        // Obsługa wyniku rozpoznawania
        recognitionRef.current.onresult = (event) => {
          const newTranscript = Array.from(event.results)
            .map(result => result[0])
            .map(result => result.transcript)
            .join('');
          
          // Aktualizacja transkrypcji
          setTranscript(newTranscript);
          onTextChange(newTranscript);
          setHasSpoken(true);
          
          // Za każdym razem gdy otrzymamy wynik, resetujemy timer ciszy
          if (silenceTimeoutRef.current) {
            clearTimeout(silenceTimeoutRef.current);
          }
          
          // Ustaw nowy timer ciszy
          silenceTimeoutRef.current = setTimeout(() => {
            console.log("Wykryto ciszę - zatrzymywanie nagrywania");
            stopListening();
          }, silenceTimeout);
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
  }, [language, onTextChange]);
  
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
  
  // Funkcja rozpoczynająca nasłuchiwanie
  const startListening = () => {
    if (!isSpeechSupported) {
      setError("Twoja przeglądarka nie wspiera rozpoznawania mowy.");
      return;
    }
    
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
      }, silenceTimeout * 2); // Dwa razy dłuższy czas na początkową wypowiedź
    } catch (err) {
      console.error('Błąd podczas uruchamiania rozpoznawania mowy:', err);
      setError("Błąd podczas uruchamiania rozpoznawania mowy. Spróbuj ponownie.");
      setIsListening(false);
    }
  };
  
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
  
  // Funkcja przełączająca nasłuchiwanie
  const toggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };
  
  // Funkcja resetująca transkrypcję
  const resetTranscript = () => {
    setTranscript('');
  };
  
  return {
    transcript,
    isListening,
    isSpeechSupported,
    error,
    startListening,
    stopListening,
    toggleListening,
    resetTranscript
  };
};

export default useVoiceRecognition;