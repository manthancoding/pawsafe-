import { useState } from 'react';
import './App.css';
import { LanguageContext } from './utils/LanguageContext';
import Header from './components/Header';
import Hero from './components/Hero';
import Features from './components/Features';
import HowItWorks from './components/HowItWorks';
import EmergencyForm from './components/EmergencyForm';
import EmergencyFAB from './components/EmergencyFAB';
import RescueCounter from './components/RescueCounter';
import SupportRescue from './components/SupportRescue';
import NGOFinder from './components/NGOFinder';
import DonateSection from './components/DonateSection';
import SeasonalAlerts from './components/SeasonalAlerts';
import AnimalBiteGuide from './components/AnimalBiteGuide';
import ReadyToHelp from './components/ReadyToHelp';
import VolunteerDashboard from './components/VolunteerDashboard';
import Footer from './components/Footer';
import LoginPage from './components/LoginPage';
import { useTranslation } from './utils/LanguageContext';

function App() {
  const [showEmergencyForm, setShowEmergencyForm] = useState(false);
  const [currentPage, setCurrentPage] = useState('home');
  const [language, setLanguage] = useState('en');
  const [showVolunteerDash, setShowVolunteerDash] = useState(false);

  const handleEmergency = () => setShowEmergencyForm(true);

  return (
    <LanguageContext.Provider value={language}>
      <div className="app">
        <Header
          onNavigate={setCurrentPage}
          onEmergency={handleEmergency}
          language={language}
          onLanguageChange={setLanguage}
          onVolunteer={() => setShowVolunteerDash(true)}
        />

        {currentPage === 'login' ? (
          <LoginPage
            onClose={() => setCurrentPage('home')}
            onLoginSuccess={() => setCurrentPage('home')}
          />
        ) : !showEmergencyForm ? (
          <>
            {currentPage === 'home' && <Hero onEmergency={handleEmergency} />}
            {currentPage === 'home' && <RescueCounter />}
            {currentPage === 'home' && <Features />}
            {currentPage === 'home' && <HowItWorks />}
            {currentPage === 'home' && <SupportRescue />}
            {currentPage === 'home' && <NGOFinder />}
            {currentPage === 'home' && <DonateSection />}
            {currentPage === 'home' && <SeasonalAlerts />}
            {currentPage === 'home' && <AnimalBiteGuide />}
            {currentPage === 'home' && (
              <ReadyToHelp
                onVolunteer={() => setShowVolunteerDash(true)}
                onDonate={() => document.querySelector('.donate-section')?.scrollIntoView({ behavior: 'smooth' })}
                onEmergency={handleEmergency}
              />
            )}
            {currentPage === 'report' && <EmergencyForm onClose={() => setCurrentPage('home')} />}
            {currentPage === 'about' && <AboutPage />}
            {currentPage === 'contact' && <ContactPage />}
            <Footer />
          </>
        ) : (
          <>
            <EmergencyForm onClose={() => setShowEmergencyForm(false)} />
            <Footer />
          </>
        )}

        {currentPage !== 'login' && !showEmergencyForm && (
          <EmergencyFAB onEmergency={handleEmergency} />
        )}

        {showVolunteerDash && (
          <VolunteerDashboard onClose={() => setShowVolunteerDash(false)} />
        )}


      </div>
    </LanguageContext.Provider>
  );
}

function AboutPage() {
  const t = useTranslation();
  const a = t.about;
  return (
    <section className="about-section">
      <div className="container">
        <h1>{a.heading}</h1>
        <div className="about-content">
          <p>{a.p1}</p>
          <h2>{a.mission}</h2>
          <p>{a.p2}</p>
          <h2>{a.difference}</h2>
          <ul className="about-list">
            {a.list.map((item, i) => <li key={i}>{item}</li>)}
          </ul>
        </div>
      </div>
    </section>
  );
}

function ContactPage() {
  const t = useTranslation();
  const c = t.contact;
  return (
    <section className="contact-section">
      <div className="container">
        <h1>{c.heading}</h1>
        <div className="contact-content">
          <div className="contact-form">
            <h2>{c.form.title}</h2>
            <form onSubmit={(e) => { e.preventDefault(); alert(c.form.success); }}>
              <input type="text" placeholder={c.form.name} required />
              <input type="email" placeholder={c.form.email} required />
              <textarea placeholder={c.form.message} rows="5" required></textarea>
              <button type="submit" className="btn btn-primary">{c.form.send}</button>
            </form>
          </div>
          <div className="contact-info">
            <h2>{c.info.title}</h2>
            <div className="info-item">
              <h3>{c.info.email}</h3>
              <p>support@pawsafe.com</p>
            </div>
            <div className="info-item">
              <h3>{c.info.phone}</h3>
              <p>+91&nbsp;90409&nbsp;59368</p>
            </div>
            <div className="info-item">
              <h3>{c.info.address}</h3>
              <p>{c.info.addressLine}</p>
            </div>
            <div className="info-item">
              <h3>{c.info.hours}</h3>
              <p>{c.info.hoursValue}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default App;
