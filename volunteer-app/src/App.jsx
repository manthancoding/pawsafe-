import { Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import VolunteerLoginPage from './components/VolunteerLoginPage';
import VolunteerDashboard from './components/VolunteerDashboard';
import BecomeVolunteerForm from './components/BecomeVolunteerForm';
import { LanguageProvider } from './utils/LanguageContext';
import './index.css';

function ProtectedRoute({ children, user, onUpgrade }) {
    if (!user) return <Navigate to="/login" replace />;
    const roles = user.roles || (user.role ? [user.role] : []);
    if (!roles.includes('volunteer')) {
        return <BecomeVolunteerForm user={user} onUpgrade={onUpgrade} />;
    }
    return children;
}

function App() {
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('pawsafe_user')));

    const handleLogin = (userData) => {
        setUser(userData);
    };

    const handleLogout = () => {
        localStorage.removeItem('pawsafe_user');
        localStorage.removeItem('pawsafe_token');
        setUser(null);
    };

    return (
        <LanguageProvider>
            <Routes>
                <Route path="/login" element={
                    (user?.roles?.includes('volunteer') || user?.role === 'volunteer') ? <Navigate to="/dashboard" replace /> : <VolunteerLoginPage onLoginSuccess={handleLogin} />
                } />
                <Route path="/dashboard/*" element={
                    <ProtectedRoute user={user} onUpgrade={handleLogin}>
                        <VolunteerDashboard onLogout={handleLogout} />
                    </ProtectedRoute>
                } />
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
        </LanguageProvider>
    );
}

export default App;
