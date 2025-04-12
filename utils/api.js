// utils/api.js - wersja z rozszerzonym debugowaniem

/**
 * Funkcja do wysyłania zapytań do API chatbota
 * @param {string} question - Pytanie od użytkownika
 * @returns {Promise<string>} - Odpowiedź od API
 */
export const askQuestion = async (question) => {
    try {
      console.log('Wysyłanie pytania do API:', question);
      
      // Używamy obu metod - bezpośredniej i przez proxy
      let response;
      try {
        console.log('Próba bezpośredniego połączenia...');
        response = await fetch('http://127.0.0.1:5000/ask', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ question })
        });
        console.log('Bezpośrednie połączenie udane!');
      } catch (directError) {
        console.error('Błąd bezpośredniego połączenia:', directError);
        console.log('Próba połączenia przez proxy...');
        response = await fetch('/api/ask', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ question })
        });
        console.log('Połączenie przez proxy udane!');
      }
      
      console.log('Status odpowiedzi:', response.status);
      console.log('Nagłówki odpowiedzi:', Object.fromEntries(response.headers.entries()));
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Błąd API:', response.status, errorText);
        throw new Error(`Błąd API: ${response.status} ${errorText}`);
      }
      
      const responseText = await response.text();
      console.log('Surowa odpowiedź:', responseText);
      
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error('Błąd parsowania JSON:', parseError);
        throw new Error(`Otrzymano nieprawidłowy format JSON: ${responseText}`);
      }
      
      console.log('Odpowiedź po parsowaniu:', data);
      
      if (!data.answer) {
        console.error('Brak właściwości "answer" w odpowiedzi:', data);
        throw new Error('Odpowiedź API nie zawiera właściwości "answer"');
      }
      
      return data.answer;
    } catch (error) {
      console.error('Błąd podczas komunikacji z API:', error);
      console.error('Pełny stack trace:', error.stack);
      
      // Sprawdzamy konkretne typy błędów
      const errorMessage = error.message || '';
      
      if (errorMessage.includes('NetworkError') || 
          errorMessage.includes('Failed to fetch') || 
          errorMessage.includes('CORS') || 
          errorMessage.includes('Access-Control-Allow-Origin')) {
        return "Nie można połączyć się z serwerem. Problem może być związany z CORS. Sprawdź konsolę przeglądarki po więcej szczegółów.";
      }
      
      if (errorMessage.includes('JSON')) {
        return "Problem z przetwarzaniem odpowiedzi z API. Format odpowiedzi nie jest zgodny z oczekiwanym.";
      }
      
      return `Przepraszamy, wystąpił błąd podczas przetwarzania Twojego pytania: ${errorMessage}`;
    }
  };