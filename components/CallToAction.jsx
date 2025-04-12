// components/CallToAction.jsx
import "../styles/CallToAction.css";

const CallToAction = () => {
  // Dodajemy konsolę do debugowania
  console.log("Rendering CallToAction component");
  
  return (
    <section className="cta-section" id="cta-section">
      <div className="container">
        <h2 className="cta-heading">Umów wizytę już dziś</h2>
        <p className="cta-text">Zadbaj o swoje zdrowie z najlepszymi specjalistami w Lublinie</p>
        <button className="cta-button">
          Rezerwuj online
        </button>
      </div>
    </section>
  );
};

export default CallToAction;