import { useTranslation } from '../utils/LanguageContext';
import './Features.css';

export default function Features() {
  const t = useTranslation();
  const f = t.features;

  return (
    <section className="features">
      <div className="container">
        <h2>{f.heading}</h2>
        <p className="section-subtitle">{f.subtitle}</p>

        <div className="features-grid">
          {f.items.map((feature, i) => (
            <div key={i} className="feature-card">
              <div className="feature-icon">{feature.icon}</div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
