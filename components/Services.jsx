// components/Services.jsx
import ServiceCard from './ServiceCard.jsx';
import "../styles/Services.css";

const Services = ({ services }) => {
  // Dodajemy konsolę do debugowania
  console.log("Rendering Services component with:", services);
  
  if (!services || services.length === 0) {
    console.error("No services data provided to Services component");
    return null;
  }

  return (
    <section className="services-section" id="services-section">
      <div className="container">
        <h2 className="services-heading">Nasze usługi</h2>
        <div className="services-grid">
          {services.map((service, index) => (
            <ServiceCard key={index} service={service} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;