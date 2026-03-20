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
      label: t.header.groups.rescue,
      items: [
        { label: '📍 How It Works', action: () => handleNavClick('how-it-works') },
        { label: '🚨 Report Emergency', action: () => { onEmergency(); setMenuOpen(false); setActiveDropdown(null); } },
        { label: '🏥 Find NGOs', action: () => handleNavClick('ngo-finder') },
        { label: '📊 Live Counter', action: () => handleNavClick('rescue-counter') },
      ],
    },
    {
      id: 'community',
      label: t.header.groups.community,
      items: [
        { label: '🌟 Support a Rescue', action: () => handleNavClick('support-rescue') },
        { label: '💰 Donate', action: () => handleNavClick('donate') },
        { label: '🙋 Volunteer', action: () => { onVolunteer(); setMenuOpen(false); setActiveDropdown(null); } },
        { label: '⚙️ Features', action: () => handleNavClick('features') },
      ],
    },
    {
      id: 'info',
      label: t.header.groups.info,
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

          {navGroups.map(group => {
            const roles = user?.roles || (user?.role ? [user.role] : []);
            const isVolunteer = roles.includes('volunteer');

            let items = group.items;
            if (group.id === 'community') {
              items = group.items.map(item => {
                if (item.label.includes('Volunteer')) {
                  return {
                    ...item,
                    label: isVolunteer ? '👷 Volunteer Portal' : '🙋 Volunteer'
                  };
                }
                return item;
              });
            }

            return (
              <div key={group.id} className="nav-dropdown-wrapper">
                <button
                  className={`nav-link nav-link--dropdown ${activeDropdown === group.id ? 'active' : ''}`}
                  onClick={(e) => {
                    e.preventDefault();
                    toggleDropdown(group.id);
                  }}
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
                    {items.map((item, i) => (
                      <li key={i}>
                        <button className="nav-submenu-item" onClick={item.action}>
                          {item.label}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            );
          })}
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
                onClick={() => navigate((user.roles?.includes('admin') || user.role === 'admin') ? '/admin' : '/dashboard')}
              >
                <span className="user-avatar-mini">
                  {user.name?.[0]?.toUpperCase() ?? '👤'}
                </span>
                <span className="user-name-mini">{user.name?.split(' ')[0] || user.email?.split('@')[0] || 'User'}</span>
                <span className="nav-arrow" style={{ opacity: 0.6, marginLeft: '4px' }}>▾</span>
              </button>
              <div className="user-dropdown">
                <button onClick={() => navigate((user.roles?.includes('admin') || user.role === 'admin') ? '/admin' : '/dashboard')}>
                  {(user.roles?.includes('admin') || user.role === 'admin') ? '📊 Admin Dashboard' : '👤 My Dashboard'}
                </button>
                {(user.roles?.includes('volunteer') || user.role === 'volunteer') && (
                  <button onClick={onVolunteer}>
                    👷 Volunteer Portal
                  </button>
                )}
                <button onClick={onLogout} className="logout-item">🚪 Logout</button>
              </div>
            </div>
          ) : (
            <div className="login-actions-group">
              <button className="btn-staff-link" onClick={() => navigate('/admin/login')}>
                Staff Portal
              </button>
              <button className="btn-volunteer-link" onClick={() => navigate('/volunteer/login')}>
                Volunteer Login
              </button>
              <button className="btn-login" onClick={() => navigate('/login')}>
                {t.header.login}
              </button>
            </div>
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
                <button className="mobile-nav-link" onClick={() => {
                  const isAdmin = user.roles?.includes('admin') || user.role === 'admin';
                  navigate(isAdmin ? '/admin' : '/dashboard');
                  setMenuOpen(false);
                }}>
                  {(user.roles?.includes('admin') || user.role === 'admin') ? '📊 Admin Dashboard' : '👤 My Dashboard'}
                </button>
                <button className="btn-login logged-in" onClick={() => { onLogout(); setMenuOpen(false); }}>
                  🚪 Logout ({user.name?.split(' ')[0] || 'User'})
                </button>
              </>
            ) : (
              <>
                <button className="btn-volunteer-link mobile-full" onClick={() => { navigate('/volunteer/login'); setMenuOpen(false); }}>
                  Volunteer Login
                </button>
                <button className="btn-login" onClick={() => { navigate('/login'); setMenuOpen(false); }}>
                  {t.header.login}
                </button>
              </>
            )}

            {!user && (
              <div className="mobile-admin-entry" style={{ width: '100%', marginTop: '1rem', borderTop: '1px solid #eee', paddingTop: '1rem' }}>
                <button
                  className="mobile-nav-link"
                  onClick={() => { navigate('/admin/login'); setMenuOpen(false); }}
                  style={{ background: 'rgba(13, 115, 119, 0.05)', borderRadius: '12px', border: '1px solid rgba(13, 115, 119, 0.1)' }}
                >
                  🛡️ Staff & NGO Portal (Login)
                </button>
              </div>
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
