// components/CallToAction.jsx
import "../styles/CallToAction.css";

const CallToAction = () => {
  // Dodajemy konsolę do debugowania
  console.log("Rendering CallToAction component");
  
  const handlePdfDownload = () => {
    // Pobierz PDF
    const link = document.createElement('a');
    link.href = '/documents/julia-chatbot-dokumentacja.pdf';
    link.download = 'LuxMed-Julia-Chatbot-Dokumentacja.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Opcjonalnie dodaj śledzenie pobierania (np. dla Google Analytics)
    console.log("PDF downloaded: Julia Chatbot Documentation");
  };
  
  return (
    <section className="cta-section" id="cta-section">
      <div className="container">
        <h2 className="cta-heading">Poznaj historię powstania Julii</h2>
        <p className="cta-text">
          Dowiedz się więcej o procesie wdrożenia naszego medycznego chatbota - 
          pobierz szczegółową dokumentację projektu
        </p>
        <button className="cta-button" onClick={handlePdfDownload}>
          <span className="pdf-icon">📑</span>
          Pobierz dokumentację PDF
        </button>
        <div className="cta-additional-info">
          <small>Darmowy dostęp do pełnej dokumentacji i naszej histori wdrożenia chatbota Julia</small>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;