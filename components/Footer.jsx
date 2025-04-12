// components/Footer.jsx
import "../styles/Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-column">
            <h3 className="footer-heading">LuxMed Lublin</h3>
            <p className="footer-text">ul. Przykładowa 123</p>
            <p className="footer-text">20-000 Lublin</p>
            <p className="footer-text">tel: +48 123 456 789</p>
            <p className="footer-text">email: kontakt@luxmedlublin.pl</p>
          </div>
          
          <div className="footer-column">
            <h3 className="footer-heading">Godziny otwarcia</h3>
            <p className="footer-text">Poniedziałek - Piątek: 8:00 - 20:00</p>
            <p className="footer-text">Sobota: 8:00 - 16:00</p>
            <p className="footer-text">Niedziela: nieczynne</p>
          </div>
          
          <div className="footer-column">
            <h3 className="footer-heading">Przydatne linki</h3>
            <ul className="footer-links">
              <li><a href="#" className="footer-link">Polityka prywatności</a></li>
              <li><a href="#" className="footer-link">Regulamin</a></li>
              <li><a href="#" className="footer-link">Kariera</a></li>
              <li><a href="#" className="footer-link">FAQ</a></li>
            </ul>
          </div>
        </div>
        
        <div className="copyright">
          <p>&copy; 2025 LuxMed Lublin. Wszelkie prawa zastrzeżone.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;