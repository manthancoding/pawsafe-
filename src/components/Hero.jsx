import { useTranslation } from '../utils/LanguageContext';
import './Hero.css';

function HeroArtwork() {
  return (
    <svg
      className="hero-artwork"
      viewBox="0 0 560 430"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Pet safety illustration"
    >
      <defs>
        <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#FDE2EA" />
          <stop offset="0.55" stopColor="#E9DBFF" />
          <stop offset="1" stopColor="#D7F0FF" />
        </linearGradient>
        <linearGradient id="phone" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FFFFFF" />
          <stop offset="1" stopColor="#EAF6FF" />
        </linearGradient>
        <linearGradient id="dog" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#C26A3A" />
          <stop offset="1" stopColor="#A5522C" />
        </linearGradient>
        <filter id="softShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="18" stdDeviation="18" floodColor="#1A1A2E" floodOpacity="0.18" />
        </filter>
      </defs>

      {/* Background blob */}
      <g filter="url(#softShadow)">
        <path
          d="M425 72c52 31 84 86 76 145-8 60-56 103-94 151-38 47-66 99-122 112-56 12-108-24-161-57-52-33-110-62-121-120-11-58 28-114 69-164 40-50 81-95 143-107 62-12 158 8 210 40Z"
          fill="url(#bg)"
          opacity="0.9"
        />
      </g>

      {/* Phone with map */}
      <g filter="url(#softShadow)">
        <rect x="310" y="115" width="185" height="235" rx="26" fill="url(#phone)" />
        <rect x="326" y="140" width="153" height="188" rx="18" fill="#DFF2FF" />
        <path d="M338 160h60l18 22h-78z" fill="#CBE8FF" opacity="0.9" />
        <path d="M420 210l40-30 10 14-40 30z" fill="#CBE8FF" opacity="0.9" />
        <path d="M340 250l45 18-9 20-45-18z" fill="#CBE8FF" opacity="0.9" />
        <circle cx="402" cy="236" r="24" fill="#FFFFFF" />
        <path
          d="M402 204c11 0 20 9 20 20 0 18-20 38-20 38s-20-20-20-38c0-11 9-20 20-20Z"
          fill="#FF7A8A"
          opacity="0.95"
        />
        <circle cx="402" cy="224" r="10" fill="#FFFFFF" />
        <path
          d="M402 218c3 0 5 2 5 5 0 2-1 4-3 5 1 2 0 4-2 4s-3-2-2-4c-2-1-3-3-3-5 0-3 2-5 5-5Z"
          fill="#FF7A8A"
        />
      </g>

      {/* Cat peeking */}
      <g filter="url(#softShadow)">
        <path d="M428 108l16-18 12 20 17-12 7 24z" fill="#F6A15C" />
        <circle cx="442" cy="114" r="24" fill="#FFB57A" />
        <circle cx="434" cy="112" r="3.2" fill="#1A1A2E" />
        <circle cx="450" cy="112" r="3.2" fill="#1A1A2E" />
        <path d="M442 117c3 2 3 6 0 8-3-2-3-6 0-8Z" fill="#1A1A2E" opacity="0.75" />
        <path d="M430 120c8 4 16 4 24 0" stroke="#1A1A2E" strokeOpacity="0.35" strokeWidth="2.2" strokeLinecap="round" />
      </g>

      {/* Dog sitting */}
      <g filter="url(#softShadow)">
        <ellipse cx="205" cy="355" rx="160" ry="28" fill="#5FB86B" opacity="0.35" />

        <path
          d="M160 334c0-46 34-84 88-84s92 38 92 84c0 42-34 72-92 72s-88-30-88-72Z"
          fill="url(#dog)"
        />
        <path
          d="M192 268c16-22 46-36 70-36 30 0 54 16 64 38 10 22 7 50-7 70-14 20-40 34-70 34-31 0-57-12-71-32-14-20-18-50 14-74Z"
          fill="#FFFFFF"
          opacity="0.9"
        />

        <path d="M205 248c-22 6-38 20-46 44 2 18 10 32 26 40 8-28 26-50 52-64-6-10-16-18-32-20Z" fill="#B85F34" />
        <path d="M292 248c20 6 34 20 42 42-2 18-10 32-26 40-6-24-22-44-46-58 4-12 12-20 30-24Z" fill="#B85F34" />

        <circle cx="241" cy="294" r="10" fill="#1A1A2E" />
        <circle cx="283" cy="294" r="10" fill="#1A1A2E" />
        <circle cx="238" cy="291" r="3" fill="#FFFFFF" opacity="0.85" />
        <circle cx="280" cy="291" r="3" fill="#FFFFFF" opacity="0.85" />
        <path d="M262 307c10 0 14 10 0 14-14-4-10-14 0-14Z" fill="#1A1A2E" opacity="0.75" />
        <path d="M262 320c14 2 18 10 8 18-8-2-12-8-16-18Z" fill="#FF6B7A" />

        <path
          d="M208 338c0-10 8-18 18-18h74c10 0 18 8 18 18 0 10-8 18-18 18h-74c-10 0-18-8-18-18Z"
          fill="#2FAE6B"
        />
        <circle cx="262" cy="338" r="14" fill="#FFD86B" />
        <path
          d="M262 329c4 0 7 3 7 7 0 3-2 5-4 6 1 2 0 4-3 4-3 0-4-2-3-4-2-1-4-3-4-6 0-4 3-7 7-7Z"
          fill="#2FAE6B"
        />
      </g>

      {/* Floating hearts */}
      <g opacity="0.55">
        <path d="M142 210c10-10 26 2 20 14-4 8-20 18-20 18s-16-10-20-18c-6-12 10-24 20-14Z" fill="#FF6B7A" />
        <path d="M310 74c8-8 20 2 16 12-3 7-16 14-16 14s-13-7-16-14c-4-10 8-20 16-12Z" fill="#FF7FB0" />
      </g>
    </svg>
  );
}

function TrustedIcons() {
  return (
    <div className="hero-trust-icons" aria-hidden="true">
      <svg viewBox="0 0 24 24" className="hero-trust-icon">
        <path d="M4 14c4 0 6-8 8-8s4 8 8 8" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <path d="M6 14v4M18 14v4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
      <svg viewBox="0 0 24 24" className="hero-trust-icon">
        <path d="M4 10 12 4l8 6v10H4V10Z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
        <path d="M10 20v-6h4v6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      </svg>
      <svg viewBox="0 0 24 24" className="hero-trust-icon">
        <path d="M12 3 20 7v6c0 5-4 8-8 8s-8-3-8-8V7l8-4Z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
        <path d="M9 12l2 2 4-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <svg viewBox="0 0 24 24" className="hero-trust-icon">
        <path
          d="M12 13c1.4 0 2.5-1.1 2.5-2.5S13.4 8 12 8s-2.5 1.1-2.5 2.5S10.6 13 12 13Z"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        />
        <path
          d="M5 14c0 2 2 3 4 3 1 0 2-.2 3-.6 1 .4 2 .6 3 .6 2 0 4-1 4-3 0-1.4-1.2-2.4-2.6-2.4-1 0-2 .4-2.6 1.2-.6-.8-1.6-1.2-2.6-1.2C6.2 11.6 5 12.6 5 14Z"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinejoin="round"
        />
      </svg>
      <svg viewBox="0 0 24 24" className="hero-trust-icon">
        <path
          d="M12 21s-7-4.4-9.4-8.5C.6 9.1 3 6 6.5 6c1.8 0 3.3.9 4.2 2.2C11.6 6.9 13.2 6 15 6c3.5 0 5.9 3.1 3.9 6.5C19 16.6 12 21 12 21Z"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

export default function Hero({ onEmergency }) {
  const t = useTranslation();
  const h = t.hero;
  return (
    <section className="hero">
      <div className="hero-inner">
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">
              <span className="hero-title-line">{h.title}</span>
              <span className="hero-title-line hero-title-brand">
                {h.brandLine ?? 'with'}{' '}
                <span className="hero-highlight">PawSafe</span>{' '}
                <span className="hero-paw" aria-hidden="true">🐾</span>
              </span>
            </h1>

            <p className="hero-subtitle">{h.subtitle}</p>

            <div className="hero-buttons">
              <button className="btn btn-primary btn-lg" onClick={onEmergency}>
                {h.report}
              </button>
              <button className="btn btn-secondary btn-lg">{h.learnMore}</button>
            </div>
          </div>

          <div className="hero-media">
            <HeroArtwork />
          </div>
        </div>

        <div className="hero-trust">
          <p className="hero-trust-text">{h.trustedBy ?? 'Trusted by 10,000+ Pet Owners'}</p>
          <TrustedIcons />
        </div>
      </div>
    </section>
  );
}
