import { useTranslation } from '../utils/LanguageContext';
import './Footer.css';

export default function Footer() {
  const t = useTranslation();
  const f = t.footer;

  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3>PawSafe</h3>
          <p>{f.tagline}</p>
          <div className="social-links">
            <a href="#" aria-label="Facebook">f</a>
            <a href="#" aria-label="Twitter">𝕏</a>
            <a href="#" aria-label="Instagram">📷</a>
          </div>
        </div>

        <div className="footer-section">
          <h4>{f.quickLinks}</h4>
          <ul>
            <li><a href="#home">{f.links.home}</a></li>
            <li><a href="#about">{f.links.about}</a></li>
            <li><a href="#contact">{f.links.contact}</a></li>
            <li><a href="#">{f.links.faq}</a></li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>{f.resources}</h4>
          <ul>
            <li><a href="#">{f.resourceLinks.partners}</a></li>
            <li><a href="#">{f.resourceLinks.care}</a></li>
            <li><a href="#">{f.resourceLinks.safety}</a></li>
            <li><a href="#">{f.resourceLinks.blog}</a></li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>{f.legal}</h4>
          <ul>
            <li><a href="#">{f.legalLinks.privacy}</a></li>
            <li><a href="#">{f.legalLinks.terms}</a></li>
            <li><a href="#">{f.legalLinks.disclaimer}</a></li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <p>{f.copyright}</p>
        <p>{f.hotline}: <strong>{f.hotlineValue}</strong> — {f.available}</p>
      </div>
    </footer>
  );
}
