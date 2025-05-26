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

          <div className="footer-column">
            <h3 className="footer-heading">Autorzy projektu</h3>
            <div className="authors-grid">
              <div className="author-card">
                <div className="author-image">
                  <img src="/images/author1.jpg" alt="Jan Kowalski" />
                </div>
                <div className="author-info">
                  <h4 className="author-name">Karol Kowal</h4>
                  <a 
                    href="https://www.linkedin.com/in/kowal-karol/?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app&fbclid=IwZXh0bgNhZW0CMTAAYnJpZBExUDdVaGkydHVOQ0lJbm15bwEezi7WxmDBErv5FwOhPVZTPNhKvMD8wFoiZVuvvXbGWlKm0O8hE-IdriBHLhY_aem_joYQE4M8OoN8BllZFZGz0Q" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="linkedin-link"
                  >
                    <span className="linkedin-icon">💼</span> LinkedIn
                  </a>
                </div>
              </div>

              <div className="author-card">
                <div className="author-image">
                  <img src="/images/author2.jpg" alt="Piotr Niemiec" />
                </div>
                <div className="author-info">
                  <h4 className="author-name">Piotr Niemiec</h4>
                  <a 
                    href="https://www.linkedin.com/in/piotrniemiec/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="linkedin-link"
                  >
                    <span className="linkedin-icon">💼</span> LinkedIn
                  </a>
                </div>
              </div>

              <div className="author-card">
                <div className="author-image">
                  <img src="/images/author3.jpg" alt="Piotr Wiśniewski" />
                </div>
                <div className="author-info">
                  <h4 className="author-name">Damian Cybula</h4>
                  <a 
                    href="https://www.linkedin.com/in/damian-cybula/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="linkedin-link"
                  >
                    <span className="linkedin-icon">💼</span> LinkedIn
                  </a>
                </div>
              </div>
            </div>
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