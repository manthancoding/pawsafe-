import { useTranslation } from '../utils/LanguageContext';
import './HowItWorks.css';

export default function HowItWorks() {
  const t = useTranslation();
  const h = t.howItWorks;

  return (
    <section className="how-it-works">
      <div className="container">
        <h2>{h.heading}</h2>
        <p className="section-subtitle">{h.subtitle}</p>

        <div className="steps-container">
          {h.steps.map((step, index) => (
            <div key={index} className="step">
              <div className="step-number">{step.number}</div>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
              {index < h.steps.length - 1 && <div className="step-arrow">→</div>}
            </div>
          ))}
        </div>

        <div className="cta-section">
          <h3>{h.cta.title}</h3>
          <p>{h.cta.subtitle}</p>
          <button className="btn btn-primary btn-lg">{h.cta.button}</button>
        </div>
      </div>
    </section>
  );
}
