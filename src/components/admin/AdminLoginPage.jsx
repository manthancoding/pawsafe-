import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminLoginPage.css';

const API_BASE_URL = '/api';

export default function AdminLoginPage({ onLoginSuccess, user: initialUser }) {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [form, setForm] = useState({
        email: '',
        password: '',
    });

    useEffect(() => {
        const roles = initialUser?.roles || (initialUser?.role ? [initialUser.role] : []);
        if (roles.includes('admin')) {
            navigate('/admin');
        }
    }, [initialUser, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);

        try {
            const response = await fetch(`${API_BASE_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: form.email,
                    password: form.password
                })
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Login failed');

            const userData = data.user;
            const roles = userData.roles || (userData.role ? [userData.role] : []);

            if (!roles.includes('admin')) {
                throw new Error('Access denied. You do not have administrator privileges.');
            }

            localStorage.setItem('pawsafe_token', data.token);
            localStorage.setItem('pawsafe_user', JSON.stringify(data.user));

            if (onLoginSuccess) onLoginSuccess(data.user);
            setSuccess('Admin authorized. Redirecting...');
            setTimeout(() => navigate('/admin'), 1500);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="admin-login-container">
            <div className="admin-login-overlay"></div>
            <div className="admin-login-card">
                <div className="admin-login-header">
                    <div className="admin-icon-shield">🛡️</div>
                    <h1>Admin Control Panel</h1>
                    <p>Secure authentication required for PawSafe systems.</p>
                </div>

                <form className="admin-auth-form" onSubmit={handleSubmit}>
                    {error && <div className="admin-error">❌ {error}</div>}
                    {success && <div className="admin-success">🛡️ {success}</div>}

                    <div className="admin-form-group">
                        <label>Administrator Email</label>
                        <input
                            name="email"
                            type="email"
                            placeholder="admin@pawsafe.com"
                            value={form.email}
                            onChange={(e) => setForm({ ...form, email: e.target.value })}
                            required
                            autoComplete="email"
                        />

                        <label style={{ marginTop: '1rem', display: 'block' }}>Administrator Password</label>
                        <input
                            name="password"
                            type="password"
                            placeholder="••••••••"
                            value={form.password}
                            onChange={(e) => setForm({ ...form, password: e.target.value })}
                            required
                            autoComplete="current-password"
                        />

                        <button className="admin-submit-btn" type="submit" disabled={loading} style={{ marginTop: '2rem' }}>
                            {loading ? 'Authorizing...' : 'Authorize Access'}
                        </button>
                    </div>
                </form>
                <div className="admin-login-footer">
                    &copy; {new Date().getFullYear()} PawSafe Infrastructure Core
                </div>

                <div className="admin-switch-link">
                    <button onClick={() => navigate('/login')}>
                        🐾 Not an Admin? Go to User Login
                    </button>
                </div>
            </div>
        </div>
    );
}
