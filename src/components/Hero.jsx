import { useTranslation } from '../utils/LanguageContext';
import './Hero.css';

export default function Hero({ onEmergency }) {
  const t = useTranslation();
  const h = t.hero;
  return (
    <section className="hero">
      <div className="hero-content">
        <div className="hero-text">
          <h1>{h.title}</h1>
          <p>{h.subtitle}</p>
          <div className="hero-buttons">
            <button className="btn btn-primary btn-lg" onClick={onEmergency}>
              {h.report}
            </button>
            <button className="btn btn-secondary btn-lg">{h.learnMore}</button>
          </div>
        </div>
        <div className="hero-image">
          <div className="hero-visual">
            <div className="floating-shape shape-1"></div>
            <div className="floating-shape shape-2"></div>
            <div className="floating-shape shape-3"></div>
            <div className="pulse-ripple"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
