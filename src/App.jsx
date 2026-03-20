import { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
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
import Footer from './components/Footer';
import LoginPage from './components/LoginPage';
import BrowseAnimals from './components/BrowseAnimals';
import RescueStatus from './components/RescueStatus';
import { useTranslation } from './utils/LanguageContext';

// Admin Components
import ProtectedRoute from './components/ProtectedRoute';
import AdminLayout from './components/admin/AdminLayout';
import AdminOverview from './components/admin/AdminOverview';
import AdminAnimals from './components/admin/AdminAnimals';
import AdminAdoptions from './components/admin/AdminAdoptions';
import AdminReports from './components/admin/AdminReports';
import AdminVolunteers from './components/admin/AdminVolunteers';
import AdminDonations from './components/admin/AdminDonations';
import AdminLoginPage from './components/admin/AdminLoginPage';
import VolunteerLoginPage from './components/VolunteerLoginPage';
import BecomeVolunteerPage from './components/BecomeVolunteerPage';

// User Dashboard
import UserDashboard from './components/dashboard/UserDashboard';

const AdminSettings = () => (
  <div className="admin-settings">
    <h2>Admin Settings</h2>
    <div className="admin-welcome-card" style={{ marginTop: '2rem' }}>
      <h3>Theme Configuration</h3>
      <p>Current Theme: <strong>Forest Green (Default)</strong></p>
      <p style={{ fontSize: '0.9rem', opacity: 0.8 }}>System-wide forest green theme is active for PawSafe branding.</p>
    </div>
  </div>
);

function App() {
  const [showEmergencyForm, setShowEmergencyForm] = useState(false);
  const [language, setLanguage] = useState('en');
  const [user, setUser] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  // Load user from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('pawsafe_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (err) {
        console.error('Failed to parse user from localStorage', err);
        localStorage.removeItem('pawsafe_user');
      }
    }
  }, []);

  const handleLoginSuccess = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('pawsafe_token');
    localStorage.removeItem('pawsafe_user');
    setUser(null);
  };

  const handleEmergency = () => setShowEmergencyForm(true);

  // Determine if we are in admin area
  const isAdminArea = location.pathname.startsWith('/admin');

  return (
    <LanguageContext.Provider value={language}>
      <div className="app">
        {!isAdminArea && (
          <Header
            onNavigate={() => { }}
            onEmergency={handleEmergency}
            language={language}
            onLanguageChange={setLanguage}
            onVolunteer={() => window.open('http://localhost:5174', '_blank')}
            user={user}
            onLogout={handleLogout}
          />
        )}

        <Routes>
          {/* Public Routes */}
          <Route path="/" element={
            !showEmergencyForm ? (
              <>
                <Hero onEmergency={handleEmergency} />
                <ReadyToHelp
                  onVolunteer={() => window.open('http://localhost:5174', '_blank')}
                  onDonate={() => navigate('/donate')}
                  onEmergency={handleEmergency}
                  user={user}
                  onLoginSuccess={handleLoginSuccess}
                />
                <Footer />
              </>
            ) : (
              <>
                <EmergencyForm onClose={() => setShowEmergencyForm(false)} user={user} />
                <Footer />
              </>
            )
          } />

          <Route path="/login" element={
            user?.roles?.includes('admin') ? <Navigate to="/admin" replace /> :
              user?.roles?.includes('user') ? <Navigate to="/dashboard" replace /> :
                <LoginPage
                  onClose={() => window.history.back()}
                  onLoginSuccess={handleLoginSuccess}
                  user={user}
                />
          } />

          <Route path="/admin/login" element={
            user?.roles?.includes('admin') ? <Navigate to="/admin" replace /> :
              <AdminLoginPage
                onLoginSuccess={handleLoginSuccess}
                user={user}
              />
          } />


          <Route path="/report" element={<EmergencyForm onClose={() => window.history.back()} />} />
          <Route path="/rescue/:rescueId" element={<RescueStatus user={user} />} />
          <Route path="/about" element={<><AboutPage /><Footer /></>} />
          <Route path="/contact" element={<><ContactPage /><Footer /></>} />

          <Route path="/volunteer/login" element={
            user?.roles?.includes('volunteer') ? <Navigate to="/dashboard/volunteer" replace /> :
              <VolunteerLoginPage
                onLoginSuccess={handleLoginSuccess}
                user={user}
              />
          } />

          <Route path="/become-volunteer" element={
            <BecomeVolunteerPage user={user} onUpdateUser={handleLoginSuccess} />
          } />

          <Route path="/how-it-works" element={<><HowItWorks /><Footer /></>} />
          <Route path="/rescue-counter" element={<><RescueCounter /><Footer /></>} />
          <Route path="/ngo-finder" element={<><NGOFinder /><Footer /></>} />
          <Route path="/support-rescue" element={<><SupportRescue /><Footer /></>} />
          <Route path="/donate" element={<><DonateSection user={user} /><Footer /></>} />
          <Route path="/animals" element={<><BrowseAnimals /><Footer /></>} />
          <Route path="/features" element={<><Features /><Footer /></>} />
          <Route path="/bite-guide" element={<><AnimalBiteGuide /><Footer /></>} />
          <Route path="/seasonal-alerts" element={<><SeasonalAlerts /><Footer /></>} />

          {/* Admin Routes */}
          <Route element={<ProtectedRoute user={user} requiredRole="admin" />}>
            <Route path="/admin" element={
              <AdminLayout user={user} onLogout={handleLogout}>
                <AdminOverview />
              </AdminLayout>
            } />
            <Route path="/admin/animals" element={
              <AdminLayout user={user} onLogout={handleLogout}>
                <AdminAnimals />
              </AdminLayout>
            } />
            <Route path="/admin/adoptions" element={
              <AdminLayout user={user} onLogout={handleLogout}>
                <AdminAdoptions />
              </AdminLayout>
            } />
            <Route path="/admin/reports" element={
              <AdminLayout user={user} onLogout={handleLogout}>
                <AdminReports />
              </AdminLayout>
            } />
            <Route path="/admin/volunteers" element={
              <AdminLayout user={user} onLogout={handleLogout}>
                <AdminVolunteers />
              </AdminLayout>
            } />
            <Route path="/admin/donations" element={
              <AdminLayout user={user} onLogout={handleLogout}>
                <AdminDonations />
              </AdminLayout>
            } />
            <Route path="/admin/settings" element={
              <AdminLayout user={user} onLogout={handleLogout}>
                <AdminSettings />
              </AdminLayout>
            } />
          </Route>

          {/* User Dashboard Routes */}
          <Route element={<ProtectedRoute user={user} requiredRole="user" />}>
            <Route path="/dashboard/*" element={
              <UserDashboard user={user} onLogout={handleLogout} onUpdateUser={handleLoginSuccess} />
            } />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>

        {!isAdminArea && !showEmergencyForm && location.pathname !== '/login' && (
          <EmergencyFAB onEmergency={handleEmergency} />
        )}
      </div>
    </LanguageContext.Provider>
  );
}

function AboutPage() {
  const t = useTranslation();
  if (!t) return null;
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
  if (!t) return null;
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
