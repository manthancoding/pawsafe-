import { useState, useEffect } from 'react';
import './LoginPage.css';

const API_BASE = 'http://localhost:5000/api';

export default function LoginPage({ onClose, onLoginSuccess }) {
    const [tab, setTab] = useState('login');          // 'login' | 'signup'
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [showPass, setShowPass] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);

    // Form state
    const [form, setForm] = useState({
        name: '',
        email: '',
        password: '',
    });

    // Restore session on mount
    useEffect(() => {
        const token = localStorage.getItem('pawsafe_token');
        const user = localStorage.getItem('pawsafe_user');
        if (token && user) {
            try {
                setCurrentUser(JSON.parse(user));
            } catch (_) { }
        }
    }, []);

    const handleChange = (e) =>
        setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

    const switchTab = (t) => {
        setTab(t);
        setError('');
        setSuccess('');
        setForm({ name: '', email: '', password: '' });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);

        const endpoint = tab === 'login' ? '/auth/login' : '/auth/register';
        const body =
            tab === 'login'
                ? { email: form.email, password: form.password }
                : { name: form.name, email: form.email, password: form.password };

        try {
            const res = await fetch(`${API_BASE}${endpoint}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });
            const data = await res.json();

            if (!res.ok) {
                setError(data.message || 'Something went wrong');
                return;
            }

            // Persist session
            localStorage.setItem('pawsafe_token', data.token);
            localStorage.setItem('pawsafe_user', JSON.stringify(data.user));
            setCurrentUser(data.user);

            if (tab === 'signup') {
                setSuccess('Account created! Welcome to PawSafe 🐾');
            }

            if (onLoginSuccess) onLoginSuccess(data.user);
        } catch (_) {
            setError('Cannot reach server. Make sure the backend is running.');
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('pawsafe_token');
        localStorage.removeItem('pawsafe_user');
        setCurrentUser(null);
        setSuccess('');
        setError('');
        setForm({ name: '', email: '', password: '' });
        setTab('login');
    };

    return (
        <div className="login-page" onClick={(e) => e.target === e.currentTarget && onClose?.()}>
            {/* Decorative paw prints */}
            <span className="login-paw-deco">🐾</span>
            <span className="login-paw-deco">🐾</span>
            <span className="login-paw-deco">🐾</span>
            <span className="login-paw-deco">🐾</span>

            <div className="login-card">
                {/* Brand */}
                <div className="login-brand">
                    <div className="login-logo">🐾</div>
                    <h1>PawSafe</h1>
                    <p>Protecting animals, one paw at a time</p>
                </div>

                {currentUser ? (
                    /* ── Logged-in state ── */
                    <div className="logged-in-banner">
                        <div className="user-avatar-circle">
                            {currentUser.name?.[0]?.toUpperCase() ?? '?'}
                        </div>
                        <h2>Welcome back, {currentUser.name}!</h2>
                        <p>{currentUser.email}</p>
                        <div className="role-badge">{currentUser.role}</div>
                        <button className="logout-btn" onClick={handleLogout}>
                            🚪 Sign Out
                        </button>
                    </div>
                ) : (
                    <>
                        {/* ── Tabs ── */}
                        <div className="auth-tabs">
                            <button
                                className={`auth-tab ${tab === 'login' ? 'active' : ''}`}
                                onClick={() => switchTab('login')}
                                type="button"
                            >
                                Sign In
                            </button>
                            <button
                                className={`auth-tab ${tab === 'signup' ? 'active' : ''}`}
                                onClick={() => switchTab('signup')}
                                type="button"
                            >
                                Create Account
                            </button>
                        </div>

                        {/* ── Form ── */}
                        <form className="auth-form" onSubmit={handleSubmit} key={tab}>
                            {tab === 'signup' && (
                                <div className="form-group">
                                    <label htmlFor="name">Full Name</label>
                                    <div className="input-wrapper">
                                        <span className="input-icon">👤</span>
                                        <input
                                            id="name"
                                            name="name"
                                            type="text"
                                            placeholder="Your full name"
                                            value={form.name}
                                            onChange={handleChange}
                                            required
                                            autoComplete="name"
                                        />
                                    </div>
                                </div>
                            )}

                            <div className="form-group">
                                <label htmlFor="email">Email Address</label>
                                <div className="input-wrapper">
                                    <span className="input-icon">✉️</span>
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        placeholder="you@example.com"
                                        value={form.email}
                                        onChange={handleChange}
                                        required
                                        autoComplete="email"
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label htmlFor="password">Password</label>
                                <div className="input-wrapper">
                                    <span className="input-icon">🔒</span>
                                    <input
                                        id="password"
                                        name="password"
                                        type={showPass ? 'text' : 'password'}
                                        placeholder={tab === 'signup' ? 'Min. 6 characters' : 'Enter password'}
                                        value={form.password}
                                        onChange={handleChange}
                                        required
                                        minLength={6}
                                        autoComplete={tab === 'login' ? 'current-password' : 'new-password'}
                                    />
                                    <button
                                        type="button"
                                        className="toggle-password"
                                        onClick={() => setShowPass((v) => !v)}
                                        aria-label="Toggle password visibility"
                                    >
                                        {showPass ? '🙈' : '👁️'}
                                    </button>
                                </div>
                            </div>

                            {error && (
                                <div className="auth-error" role="alert">
                                    ⚠️ {error}
                                </div>
                            )}
                            {success && (
                                <div className="auth-success" role="status">
                                    ✅ {success}
                                </div>
                            )}

                            <button className="auth-submit" type="submit" disabled={loading}>
                                {loading ? (
                                    <><span className="spin" /> {tab === 'login' ? 'Signing in…' : 'Creating account…'}</>
                                ) : tab === 'login' ? (
                                    '🐾 Sign In'
                                ) : (
                                    '🚀 Create Account'
                                )}
                            </button>
                        </form>

                        <div className="login-footer">
                            <p>
                                {tab === 'login'
                                    ? "Don't have an account? "
                                    : 'Already have an account? '}
                                <button
                                    type="button"
                                    style={{
                                        background: 'none',
                                        border: 'none',
                                        color: 'rgba(255,255,255,0.85)',
                                        fontWeight: 700,
                                        cursor: 'pointer',
                                        fontSize: 'inherit',
                                        textDecoration: 'underline',
                                    }}
                                    onClick={() => switchTab(tab === 'login' ? 'signup' : 'login')}
                                >
                                    {tab === 'login' ? 'Sign Up' : 'Sign In'}
                                </button>
                            </p>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
