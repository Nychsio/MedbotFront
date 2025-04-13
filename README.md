# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript and enable type-aware lint rules. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.


LuxMed Lublin - Dokumentacja projektu
Spis treści
Opis projektu
Demo
Struktura projektu
Technologie
Instalacja
Uruchomienie
Komponenty
API Czatbota
Style CSS
Rozwiązywanie problemów

Autor
Opis projektu
Projekt "LuxMed Lublin" to interaktywny mockup strony kliniki medycznej LuxMed Lublin, stworzony przy użyciu React i Vite. Mockup zawiera wszystkie kluczowe elementy oryginalnej strony, takie jak nagłówek z menu nawigacyjnym, karuzelę ze slajdami, sekcję usług, sekcję call-to-action, stopkę oraz interaktywny czatbot podłączony do zewnętrznego API.

Projekt jest responsywny i dostosowuje się do różnych szerokości ekranu, zapewniając optymalne doświadczenie użytkownika zarówno na urządzeniach mobilnych, jak i desktopowych.

Demo
[Link do wersji demo] (jeśli dostępny)

Struktura projektu
LUXMED1/
├── components/               # Folder zawierający komponenty React
│   ├── CallToAction.jsx      # Sekcja "call to action" (umów wizytę)
│   ├── Carousel.jsx          # Karuzela ze slajdami na stronie głównej
│   ├── Chat.jsx              # Komponent czatu z integracją API
│   ├── Footer.jsx            # Stopka strony
│   ├── Header.jsx            # Nagłówek/menu nawigacyjne
│   ├── ServiceCard.jsx       # Karta pojedynczej usługi
│   └── Services.jsx          # Sekcja usług z kartami
├── node_modules/             # Zainstalowane zależności
├── public/                   # Statyczne zasoby
│   └── images/               # Obrazy dla karuzeli
│       ├── medical-care.jpg
│       ├── medical-equipment.jpg
│       ├── specialists.jpg
│       └── chatbot.jpg
├── src/                      # Źródła główne
│   ├── assets/               # Zasoby aplikacji
│   ├── App.jsx               # Główny komponent aplikacji
│   ├── index.css             # Globalne style CSS
│   └── main.jsx              # Główny plik wejściowy aplikacji
├── styles/                   # Style CSS dla komponentów
│   ├── App.css
│   ├── CallToAction.css
│   ├── Carousel.css
│   ├── Chat.css
│   ├── Footer.css
│   ├── Header.css
│   ├── ServiceCard.css
│   └── Services.css
├── utils/                    # Funkcje pomocnicze
│   └── api.js                # Obsługa połączenia z API czatbota
├── .gitignore
├── eslintrc.js
├── index.html
├── package-lock.json
├── package.json
└── vite.config.js            # Konfiguracja Vite z ustawieniami proxy
Technologie
Projekt wykorzystuje następujące technologie:

React - biblioteka JavaScript do budowania interfejsów użytkownika
Vite - narzędzie do budowania i uruchamiania aplikacji
JavaScript (ES6+) - język programowania
CSS - style i animacje
Fetch API - do komunikacji z zewnętrznym API
Lucide React (opcjonalnie) - biblioteka ikon
Instalacja
Aby zainstalować projekt, wykonaj następujące kroki:

Sklonuj repozytorium:
bash
git clone [adres_repozytorium]
cd LUXMED1
Zainstaluj zależności:
bash
npm install
Jeśli planujesz korzystać z czatbota, upewnij się, że API jest dostępne pod adresem http://127.0.0.1:5000/ask lub skonfiguruj proxy w vite.config.js.
Uruchomienie
Aby uruchomić aplikację w trybie deweloperskim:

bash
npm run dev
Aplikacja będzie dostępna pod adresem http://localhost:5173 (lub innym, wskazanym w terminalu).

Aby zbudować wersję produkcyjną:

bash
npm run build
Zbudowana aplikacja znajdzie się w folderze dist.

Komponenty
App.jsx
Główny komponent aplikacji, który importuje i renderuje wszystkie pozostałe komponenty. Zawiera dane dla karuzeli i sekcji usług.

jsx
const App = () => {
  // Dane karuzeli i usług
  const slides = [...];
  const services = [...];

  return (
    <div className="app">
      <Header />
      <main className="main-content">
        <Carousel slides={slides} />
        <Services services={services} />
        <CallToAction />
      </main>
      <Footer />
      <Chat />
    </div>
  );
};
Header.jsx
Komponent nagłówka zawierający logo i menu nawigacyjne. Obsługuje zarówno widok desktop, jak i mobilny.

Carousel.jsx
Komponent karuzeli wyświetlający slajdy z obrazami i tekstem. Obsługuje automatyczne przewijanie, przyciski nawigacyjne oraz wskaźniki slajdów.

ServiceCard.jsx i Services.jsx
Komponenty odpowiedzialne za wyświetlanie sekcji usług. ServiceCard reprezentuje pojedynczą kartę usługi, a Services renderuje siatkę kart na podstawie dostarczonych danych.

CallToAction.jsx
Komponent z sekcją "call to action", zachęcającą do umówienia wizyty.

Footer.jsx
Komponent stopki zawierający informacje kontaktowe, godziny otwarcia i przydatne linki.

Chat.jsx
Interaktywny czatbot podłączony do zewnętrznego API. Pozwala użytkownikowi zadawać pytania i wyświetla odpowiedzi z API.

API Czatbota
Czatbot komunikuje się z API pod adresem http://127.0.0.1:5000/ask. Logika komunikacji znajduje się w pliku utils/api.js.

Format zapytania
json
{
  "question": "Treść pytania użytkownika"
}
Format odpowiedzi
json
{
  "answer": "Odpowiedź od API"
}
Obsługa CORS
Aby rozwiązać problemy z CORS, w projekcie zastosowano proxy skonfigurowane w vite.config.js:

javascript
server: {
  proxy: {
    '/api': {
      target: 'http://127.0.0.1:5000',
      changeOrigin: true,
      rewrite: (path) => path.replace(/^\/api/, '')
    }
  }
}
Style CSS
Każdy komponent ma dedykowany plik CSS w folderze styles/. Globalne style znajdują się w src/index.css. Projekt jest w pełni responsywny dzięki użyciu media queries.

Główne klasy CSS
.app - kontener główny aplikacji
.container - kontener ograniczający szerokość zawartości
.header - styl nagłówka
.carousel - styl karuzeli
.services-section - styl sekcji usług
.cta-section - styl sekcji "call to action"
.footer - styl stopki
.chat-window i .chat-button - style czatu
Rozwiązywanie problemów
Problem z CORS
Jeśli występują problemy z połączeniem do API czatbota związane z CORS, możesz:

Upewnić się, że proxy jest poprawnie skonfigurowane w vite.config.js
Dodać nagłówki CORS po stronie serwera API:
python
from flask import Flask
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Włącza CORS dla wszystkich endpointów
Problem z wyświetlaniem menu
Jeśli menu nawigacyjne "ucieka" przy większych szerokościach ekranu:

Sprawdź style w Header.css
Upewnij się, że maksymalna szerokość kontenera jest ustawiona (max-width: 1200px)
Dostosuj marginesy i paddingi dla elementów menu
Problem z duplikacją sekcji
Jeśli sekcje się duplikują:

Sprawdź, czy komponent nie jest importowany wielokrotnie
Upewnij się, że struktura JSX w App.jsx jest prawidłowa


Autor
Piotr Niemiec

