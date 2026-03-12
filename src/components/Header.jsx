import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from '../utils/LanguageContext';
import './Header.css';

const LANGUAGES = [
  { code: 'en', label: 'EN', full: 'English' },
  { code: 'hi', label: 'हिंदी', full: 'हिंदी' },
  { code: 'ta', label: 'தமிழ்', full: 'தமிழ்' },
  { code: 'te', label: 'తెలుగు', full: 'తెలుగు' },
  { code: 'bn', label: 'বাংলা', full: 'বাংলা' },
];

// Router handles navigation

export default function Header({ onEmergency, language, onLanguageChange, onVolunteer, user, onLogout }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null); // 'rescue' | 'community' | 'info'
  const langRef = useRef(null);
  const navRef = useRef(null);
  const t = useTranslation();

  const currentLang = LANGUAGES.find(l => l.code === language) || LANGUAGES[0];

  const handleNavClick = (page) => {
    if (page === 'home') navigate('/');
    else navigate(`/${page}`);
    setMenuOpen(false);
    setActiveDropdown(null);
  };

  // handleScrollTo is removed as it's no longer needed

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (langRef.current && !langRef.current.contains(e.target)) {
        setLangOpen(false);
      }
      if (navRef.current && !navRef.current.contains(e.target)) {
        setActiveDropdown(null);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLangSelect = (code) => {
    onLanguageChange(code);
    setLangOpen(false);
    setMenuOpen(false);
  };

  const toggleDropdown = (name) => {
    setActiveDropdown(prev => (prev === name ? null : name));
  };

  const navGroups = [
    {
      id: 'rescue',
      label: '🐾 Rescue',
      items: [
        { label: '📍 How It Works', action: () => handleNavClick('how-it-works') },
        { label: '🚨 Report Emergency', action: () => { onEmergency(); setMenuOpen(false); setActiveDropdown(null); } },
        { label: '🏥 Find NGOs', action: () => handleNavClick('ngo-finder') },
        { label: '📊 Live Counter', action: () => handleNavClick('rescue-counter') },
      ],
    },
    {
      id: 'community',
      label: '🤝 Community',
      items: [
        { label: '🌟 Support a Rescue', action: () => handleNavClick('support-rescue') },
        { label: '💰 Donate', action: () => handleNavClick('donate') },
        { label: '🙋 Volunteer', action: () => { onVolunteer(); setMenuOpen(false); setActiveDropdown(null); } },
        { label: '⚙️ Features', action: () => handleNavClick('features') },
      ],
    },
    {
      id: 'info',
      label: 'ℹ️ Info',
      items: [
        { label: '🐕 Animal Bite Guide', action: () => handleNavClick('bite-guide') },
        { label: '🌦️ Seasonal Alerts', action: () => handleNavClick('seasonal-alerts') },
        { label: '📖 About Us', action: () => handleNavClick('about') },
        { label: '📬 Contact', action: () => handleNavClick('contact') },
      ],
    },
  ];

  return (
    <header className="header">
      <div className="header-container">
        {/* Logo */}
        <div className="logo" onClick={() => handleNavClick('home')}>
          <span className="logo-icon">🐾</span>
          <span className="logo-text">PawSafe</span>
        </div>

        {/* Desktop Nav with dropdowns */}
        <nav className="nav" ref={navRef}>
          <button className="nav-link" onClick={() => handleNavClick('home')}>
            {t.nav.home}
          </button>

          {navGroups.map(group => (
            <div key={group.id} className="nav-dropdown-wrapper">
              <button
                className={`nav-link nav-link--dropdown ${activeDropdown === group.id ? 'active' : ''}`}
                onClick={() => toggleDropdown(group.id)}
                onMouseEnter={() => setActiveDropdown(group.id)}
              >
                {group.label}
                <span className={`nav-arrow ${activeDropdown === group.id ? 'up' : ''}`}>▾</span>
              </button>
              {activeDropdown === group.id && (
                <ul
                  className="nav-submenu"
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  {group.items.map((item, i) => (
                    <li key={i}>
                      <button className="nav-submenu-item" onClick={item.action}>
                        {item.label}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </nav>

        {/* Hamburger toggle */}
        <button
          className={`menu-toggle ${menuOpen ? 'active' : ''}`}
          onClick={() => { setMenuOpen(!menuOpen); setActiveDropdown(null); }}
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        {/* Right controls */}
        <div className="header-actions">
          {/* Language Switcher */}
          <div className="lang-switcher" ref={langRef}>
            <button
              className="lang-btn"
              onClick={() => setLangOpen(!langOpen)}
              aria-label="Switch language"
            >
              🌐 {currentLang.label}
              <span className={`lang-arrow ${langOpen ? 'up' : ''}`}>▾</span>
            </button>
            {langOpen && (
              <ul className="lang-dropdown">
                {LANGUAGES.map(lang => (
                  <li key={lang.code}>
                    <button
                      className={`lang-option ${lang.code === currentLang.code ? 'active' : ''}`}
                      onClick={() => handleLangSelect(lang.code)}
                    >
                      {lang.full}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Login Button / User Profile */}
          {user ? (
            <div className="user-profile-nav">
              <button
                className="user-profile-btn"
                onClick={() => navigate(user.role === 'admin' ? '/admin' : '/dashboard')}
              >
                <span className="user-avatar-mini">
                  {user.name?.[0]?.toUpperCase() ?? '👤'}
                </span>
                <span className="user-name-mini">{user.name.split(' ')[0]}</span>
                <span className="nav-arrow" style={{ opacity: 0.6, marginLeft: '4px' }}>▾</span>
              </button>
              <div className="user-dropdown">
                <button onClick={() => navigate(user.role === 'admin' ? '/admin' : '/dashboard')}>
                  {user.role === 'admin' ? '📊 Admin Dashboard' : '👤 My Dashboard'}
                </button>
                <button onClick={onLogout} className="logout-item">🚪 Logout</button>
              </div>
            </div>
          ) : (
            <button className="btn-login" onClick={() => navigate('/login')}>
              {t.header.login}
            </button>
          )}

          {/* Emergency Button */}
          <button className="btn-emergency" onClick={onEmergency}>
            {t.header.emergency}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      <div className={`mobile-menu ${menuOpen ? 'open' : ''}`}>
        <div className="mobile-menu-inner">
          <button className="mobile-nav-link" onClick={() => handleNavClick('home')}>
            🏠 {t.nav.home}
          </button>

          {navGroups.map(group => (
            <div key={group.id}>
              <button
                className={`mobile-nav-link mobile-nav-link--group ${activeDropdown === group.id ? 'open' : ''}`}
                onClick={() => toggleDropdown(group.id)}
              >
                {group.label}
                <span className={`nav-arrow ${activeDropdown === group.id ? 'up' : ''}`}>▾</span>
              </button>
              {activeDropdown === group.id && (
                <div className="mobile-submenu">
                  {group.items.map((item, i) => (
                    <button key={i} className="mobile-submenu-item" onClick={item.action}>
                      {item.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}

          <div className="mobile-actions">
            {user ? (
              <>
                <button className="mobile-nav-link" onClick={() => { navigate(user.role === 'admin' ? '/admin' : '/dashboard'); setMenuOpen(false); }}>
                  {user.role === 'admin' ? '📊 Admin Dashboard' : '👤 My Dashboard'}
                </button>
                <button className="btn-login logged-in" onClick={() => { onLogout(); setMenuOpen(false); }}>
                  🚪 Logout ({user.name.split(' ')[0]})
                </button>
              </>
            ) : (
              <button className="btn-login" onClick={() => { navigate('/login'); setMenuOpen(false); }}>
                {t.header.login}
              </button>
            )}
            {!user && (
              <button className="mobile-nav-link" onClick={() => { navigate('/login'); setMenuOpen(false); }} style={{ marginTop: '0.5rem', border: '1px dashed rgba(13, 115, 119, 0.4)' }}>
                {t.ngo.staffPortal}
              </button>
            )}
            <button className="btn-volunteer" onClick={() => { onVolunteer(); setMenuOpen(false); }}>
              {t.header.volunteer}
            </button>
            <button className="btn-emergency" onClick={() => { onEmergency(); setMenuOpen(false); }}>
              {t.header.emergency}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
