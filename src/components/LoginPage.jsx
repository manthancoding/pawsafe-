import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { auth, db } from '../firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut as firebaseSignOut } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import './LoginPage.css';

export default function LoginPage({ onClose, onLoginSuccess, user: initialUser }) {
    const location = useLocation();
    const [tab, setTab] = useState(location.state?.tab || 'login');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [showPass, setShowPass] = useState(false);
    const [currentUser, setCurrentUser] = useState(initialUser);

    const [form, setForm] = useState({
        name: '',
        email: '',
        phone: '',
        city: '',
        password: '',
        confirmPassword: '',
    });

    useEffect(() => {
        if (initialUser) setCurrentUser(initialUser);
    }, [initialUser]);

    const handleChange = (e) =>
        setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

    const switchTab = (t) => {
        setTab(t);
        setError('');
        setSuccess('');
        setForm({ name: '', email: '', phone: '', city: '', password: '', confirmPassword: '' });
    };

    const validatePassword = (password) => {
        const hasUpperCase = /[A-Z]/.test(password);
        const hasLowerCase = /[a-z]/.test(password);
        const hasNumbers = /\d/.test(password);
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
        const isValidLength = password.length >= 8;

        if (!isValidLength) return "Password must be at least 8 characters long.";
        if (!hasUpperCase) return "Password must contain at least one uppercase letter (A-Z).";
        if (!hasLowerCase) return "Password must contain at least one lowercase letter (a-z).";
        if (!hasNumbers) return "Password must contain at least one number (0-9).";
        if (!hasSpecialChar) return "Password must contain at least one special character (!@#$%^&* etc).";
        return null;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (tab === 'signup') {
            const passwordError = validatePassword(form.password);
            if (passwordError) {
                setError(passwordError);
                return;
            }

            if (form.password !== form.confirmPassword) {
                setError('Passwords do not match');
                return;
            }
        }

        setLoading(true);

        try {
            if (tab === 'login') {
                const userCredential = await signInWithEmailAndPassword(auth, form.email, form.password);
                const user = userCredential.user;
                // Fetch additional user details from Firestore
                const userDocRef = doc(db, 'users', user.uid);
                const userDoc = await getDoc(userDocRef);
                const userData = userDoc.exists() ? userDoc.data() : { email: user.email, name: user.email, role: 'user' };

                const userPayload = { uid: user.uid, ...userData };
                localStorage.setItem('pawsafe_token', await user.getIdToken());
                localStorage.setItem('pawsafe_user', JSON.stringify(userPayload));
                setCurrentUser(userPayload);

                if (onLoginSuccess) {
                    onLoginSuccess(userPayload);
                }
            } else {
                const userCredential = await createUserWithEmailAndPassword(auth, form.email, form.password);
                const user = userCredential.user;

                const newUserData = {
                    name: form.name,
                    email: form.email,
                    phone: form.phone,
                    city: form.city,
                    role: 'user', // default role
                    createdAt: new Date().toISOString()
                };

                // Save additional details to Firestore
                await setDoc(doc(db, 'users', user.uid), newUserData);

                const userPayload = { uid: user.uid, ...newUserData };
                localStorage.setItem('pawsafe_token', await user.getIdToken());
                localStorage.setItem('pawsafe_user', JSON.stringify(userPayload));
                setCurrentUser(userPayload);

                setSuccess('Account created! Welcome to PawSafe 🐾');

                if (onLoginSuccess) {
                    onLoginSuccess(userPayload);
                }
            }
        } catch (err) {
            console.error(err);
            if (err.code === 'auth/email-already-in-use') {
                setError('Email already in use.');
            } else if (err.code === 'auth/wrong-password' || err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential') {
                setError('Invalid email or password.');
            } else if (err.code === 'auth/weak-password') {
                setError('Password is too weak. Ensure it is at least 8 characters long and contains uppercase, lowercase, numbers, and special characters.');
            } else {
                setError(err.message || 'Authentication failed. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        try {
            await firebaseSignOut(auth);
        } catch (err) {
            console.error("Logout error", err);
        }
        localStorage.removeItem('pawsafe_token');
        localStorage.removeItem('pawsafe_user');
        setCurrentUser(null);
        setSuccess('');
        setError('');
        setForm({ name: '', email: '', phone: '', city: '', password: '', confirmPassword: '' });
        setTab('login');
    };

    return (
        <div className="login-page" onClick={(e) => e.target === e.currentTarget && onClose?.()}>
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
                    /* Logged-in state */
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
                        {/* Tabs */}
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

                        <div className="admin-login-note">
                            <p><strong>Administrator?</strong> Sign in with your staff credentials to access the management dashboard.</p>
                        </div>

                        {/* Form */}
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

                            <div className={tab === 'signup' ? 'form-group-row' : 'form-group'}>
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

                                {tab === 'signup' && (
                                    <div className="form-group">
                                        <label htmlFor="phone">Phone Number</label>
                                        <div className="input-wrapper">
                                            <span className="input-icon">📞</span>
                                            <input
                                                id="phone"
                                                name="phone"
                                                type="tel"
                                                placeholder="Your phone"
                                                value={form.phone}
                                                onChange={handleChange}
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>

                            {tab === 'signup' && (
                                <div className="form-group">
                                    <label htmlFor="city">City / Location</label>
                                    <div className="input-wrapper">
                                        <span className="input-icon">📍</span>
                                        <input
                                            id="city"
                                            name="city"
                                            type="text"
                                            placeholder="e.g. Mumbai, India"
                                            value={form.city}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>
                            )}

                            <div className={tab === 'signup' ? 'form-group-row' : 'form-group'}>
                                <div className="form-group">
                                    <label htmlFor="password">Password</label>
                                    <div className="input-wrapper">
                                        <span className="input-icon">🔒</span>
                                        <input
                                            id="password"
                                            name="password"
                                            type={showPass ? 'text' : 'password'}
                                            placeholder={tab === 'signup' ? "8+ chars, 1 uppercase, 1 number, 1 special" : "Your password"}
                                            value={form.password}
                                            onChange={handleChange}
                                            required
                                            minLength={8}
                                            autoComplete={tab === 'login' ? 'current-password' : 'new-password'}
                                        />
                                        <button
                                            type="button"
                                            className="toggle-password"
                                            onClick={() => setShowPass((v) => !v)}
                                        >
                                            {showPass ? '🙈' : '👁️'}
                                        </button>
                                    </div>
                                </div>

                                {tab === 'signup' && (
                                    <div className="form-group">
                                        <label htmlFor="confirmPassword">Confirm Password</label>
                                        <div className="input-wrapper">
                                            <span className="input-icon">🔒</span>
                                            <input
                                                id="confirmPassword"
                                                name="confirmPassword"
                                                type={showPass ? 'text' : 'password'}
                                                placeholder="Repeat password"
                                                value={form.confirmPassword}
                                                onChange={handleChange}
                                                required
                                                minLength={8}
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>

                            {tab === 'login' && (
                                <div className="login-extra">
                                    <label className="remember-me">
                                        <input type="checkbox" /> Remember me
                                    </label>
                                    <button type="button" className="forgot-password">
                                        Forgot password?
                                    </button>
                                </div>
                            )}

                            <button className="auth-submit" type="submit" disabled={loading}>
                                {loading ? (
                                    <><span className="spinner"></span> {tab === 'login' ? 'Signing in...' : 'Creating Account...'}</>
                                ) : (
                                    tab === 'login' ? '🔑 Sign In' : '🚀 Create Account'
                                )}
                            </button>

                            {error && (
                                <div className="auth-error" role="alert">⚠️ {error}</div>
                            )}
                            {success && (
                                <div className="auth-success" role="status">✅ {success}</div>
                            )}
                        </form>

                        <div className="login-footer">
                            <p>
                                {tab === 'login' ? "Don't have an account? " : 'Already have an account? '}
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
