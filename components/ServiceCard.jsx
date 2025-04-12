// components/ServiceCard.jsx
import "../styles/ServiceCard.css";

const ServiceCard = ({ service }) => {
  const { name, icon, description } = service;
  
  return (
    <div className="service-card">
      <div className="service-icon">{icon}</div>
      <h3 className="service-title">{name}</h3>
      <p className="service-description">{description}</p>
    </div>
  );
};

export default ServiceCard;