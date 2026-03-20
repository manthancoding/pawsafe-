import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import './LoginPage.css';

const API_BASE_URL = '/api';

export default function LoginPage({ onClose, onLoginSuccess, user: initialUser }) {
    const location = useLocation();
    const [tab, setTab] = useState(location.state?.tab || 'login');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [currentUser, setCurrentUser] = useState(initialUser);
    const [step, setStep] = useState(1); // 1: Collect Info, 2: OTP
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
    const [resendTimer, setResendTimer] = useState(0); // 60s cooldown
    const [form, setForm] = useState({
        name: '',
        email: '',
        location: '',
        password: '',
    });

    useEffect(() => {
        if (initialUser) setCurrentUser(initialUser);
    }, [initialUser]);

    // Timer for OTP expiration
    useEffect(() => {
        if (step === 2 && timeLeft > 0) {
            const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
            return () => clearInterval(timer);
        }
    }, [step, timeLeft]);

    // Timer for Resend Lockout
    useEffect(() => {
        if (resendTimer > 0) {
            const timer = setInterval(() => setResendTimer(prev => prev - 1), 1000);
            return () => clearInterval(timer);
        }
    }, [resendTimer]);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const handleOtpChange = (element, index) => {
        if (isNaN(element.value)) return false;

        const newOtp = [...otp];
        newOtp[index] = element.value;
        setOtp(newOtp);

        // Focus next input
        if (element.nextSibling && element.value !== "") {
            element.nextSibling.focus();
        }
    };

    const handleKeyDown = (e, index) => {
        if (e.key === 'Backspace' && !otp[index] && e.target.previousSibling) {
            e.target.previousSibling.focus();
        }
    };

    const handleResendOtp = async () => {
        if (resendTimer > 0) return;

        setError('');
        setSuccess('');
        setLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/auth/send-otp`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: form.email, type: tab })
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Failed to resend OTP');

            setSuccess('New OTP sent to your email!');
            setOtp(['', '', '', '', '', '']);
            setTimeLeft(300);
            setResendTimer(60);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) =>
        setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

    const switchTab = (t) => {
        setTab(t);
        setStep(1);
        setError('');
        setSuccess('');
        setOtp(['', '', '', '', '', '']);
        setForm({ name: '', email: '', location: '', password: '' });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (step === 1) {
            setLoading(true);
            try {
                if (tab === 'login') {
                    // Direct login with password
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

                    localStorage.setItem('pawsafe_token', data.token);
                    localStorage.setItem('pawsafe_user', JSON.stringify(data.user));
                    onLoginSuccess(data.user);
                    onClose();
                } else {
                    // Signup: Send OTP first
                    const response = await fetch(`${API_BASE_URL}/auth/send-otp`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            email: form.email,
                            type: tab
                        })
                    });

                    const data = await response.json();
                    if (!response.ok) throw new Error(data.message || 'Failed to send OTP');

                    setSuccess(data.message);
                    setStep(2);
                    setTimeLeft(300);
                    setResendTimer(60);
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        } else {
            // Step 2: Verify OTP
            const otpCode = otp.join('');
            if (otpCode.length !== 6) {
                setError('Please enter all 6 digits');
                return;
            }

            setLoading(true);
            try {
                const response = await fetch(`${API_BASE_URL}/auth/verify-otp`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        ...form,
                        otp: otpCode,
                        type: tab
                    })
                });

                const data = await response.json();
                if (!response.ok) throw new Error(data.message || 'Invalid OTP');

                localStorage.setItem('pawsafe_token', data.token);
                localStorage.setItem('pawsafe_user', JSON.stringify(data.user));
                setCurrentUser(data.user);

                if (onLoginSuccess) onLoginSuccess(data.user);
                setSuccess(tab === 'login' ? 'Welcome back! 🐾' : 'Account created! Welcome to PawSafe 🐾');
                setTimeout(() => onClose?.(), 2000);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('pawsafe_token');
        localStorage.removeItem('pawsafe_user');
        setCurrentUser(null);
        setSuccess('');
        setError('');
        setForm({ name: '', email: '', location: '', password: '' });
        setTab('login');
        setStep(1);
        setOtp(['', '', '', '', '', '']);
    };

    return (
        <div className="login-page" onClick={(e) => e.target === e.currentTarget && onClose?.()}>
            <span className="login-paw-deco">🐾</span>
            <span className="login-paw-deco">🐾</span>
            <span className="login-paw-deco">🐾</span>
            <span className="login-paw-deco">🐾</span>

            <div className="login-card">
                <div className="login-brand">
                    <div className="login-logo">🐾</div>
                    <h1> {step === 1 ? 'PawSafe' : (tab === 'login' ? 'Login' : 'Verify Email')}</h1>
                    <p>{step === 1 ? 'Protecting animals, one paw at a time.' : 'Enter the 6-digit code sent to your email'}</p>
                </div>

                {currentUser ? (
                    <div className="logged-in-banner">
                        <div className="user-avatar-circle">
                            {currentUser.name ? currentUser.name[0].toUpperCase() : 'U'}
                        </div>
                        <h2>Welcome, {currentUser.name || 'User'}!</h2>
                        <p>{currentUser.email}</p>
                        <button className="logout-btn" onClick={handleLogout}>
                            🚪 Logout Account
                        </button>
                    </div>
                ) : (
                    <>
                        {step === 1 && (
                            <div className="auth-tabs">
                                <button
                                    className={`auth-tab ${tab === 'login' ? 'active' : ''}`}
                                    onClick={() => switchTab('login')}
                                >Login</button>
                                <button
                                    className={`auth-tab ${tab === 'signup' ? 'active' : ''}`}
                                    onClick={() => switchTab('signup')}
                                >Create Account</button>
                            </div>
                        )}

                        <form className="auth-form" onSubmit={handleSubmit}>
                            {error && (
                                <div className="auth-error">
                                    ⚠️ {error}
                                    {error.includes('already registered') && (
                                        <button
                                            type="button"
                                            className="error-action-link"
                                            onClick={() => switchTab('login')}
                                        >
                                            Sign in instead
                                        </button>
                                    )}
                                </div>
                            )}
                            {success && <div className="auth-success">✅ {success}</div>}

                            {step === 1 ? (
                                <>
                                    {tab === 'signup' && (
                                        <>
                                            <div className="form-group">
                                                <label>Full Name</label>
                                                <div className="input-wrapper">
                                                    <span className="input-icon">👤</span>
                                                    <input
                                                        name="name"
                                                        type="text"
                                                        placeholder="Enter your name"
                                                        value={form.name}
                                                        onChange={handleChange}
                                                        required
                                                    />
                                                </div>
                                            </div>
                                            <div className="form-group">
                                                <label>Location</label>
                                                <div className="input-wrapper">
                                                    <span className="input-icon">📍</span>
                                                    <input
                                                        name="location"
                                                        type="text"
                                                        placeholder="City, Area"
                                                        value={form.location}
                                                        onChange={handleChange}
                                                        required
                                                    />
                                                </div>
                                            </div>
                                        </>
                                    )}

                                    <div className="form-group">
                                        <label>Email Address</label>
                                        <div className="input-wrapper">
                                            <span className="input-icon">📧</span>
                                            <input
                                                name="email"
                                                type="email"
                                                placeholder="name@example.com"
                                                value={form.email}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="form-group">
                                        <label>Password</label>
                                        <div className="input-wrapper">
                                            <span className="input-icon">🔒</span>
                                            <input
                                                name="password"
                                                type={showPassword ? "text" : "password"}
                                                placeholder="••••••••"
                                                value={form.password}
                                                onChange={handleChange}
                                                required
                                            />
                                            <button
                                                type="button"
                                                className="toggle-password"
                                                onClick={() => setShowPassword(!showPassword)}
                                                tabIndex="-1"
                                            >
                                                {showPassword ? '👁️‍🗨️' : '👁️'}
                                            </button>
                                        </div>
                                    </div>

                                    <button className="auth-submit" type="submit" disabled={loading}>
                                        {loading ? <span className="spin" /> : (tab === 'login' ? 'Login' : 'Send OTP')}
                                    </button>
                                </>
                            ) : (
                                <div className="form-group">
                                    <label>Verification Code</label>
                                    <p className="otp-help">We've sent a 6-digit code to <strong>{form.email}</strong></p>

                                    <div className="otp-boxes-container">
                                        {otp.map((data, index) => (
                                            <input
                                                key={index}
                                                type="text"
                                                name="otp"
                                                maxLength="1"
                                                className="otp-box"
                                                value={data}
                                                onChange={e => handleOtpChange(e.target, index)}
                                                onKeyDown={e => handleKeyDown(e, index)}
                                                onFocus={e => e.target.select()}
                                                autoFocus={index === 0}
                                            />
                                        ))}
                                    </div>

                                    <div className="otp-status-row">
                                        <div className={`otp-timer ${timeLeft < 60 ? 'warning' : ''}`}>
                                            ⏱️ {formatTime(timeLeft)}
                                        </div>
                                        {timeLeft === 0 && (
                                            <span className="otp-expired-msg">Code expired</span>
                                        )}
                                    </div>

                                    <div className="resend-container">
                                        <button
                                            type="button"
                                            className="resend-otp-btn"
                                            onClick={handleResendOtp}
                                            disabled={resendTimer > 0 || loading}
                                        >
                                            {resendTimer > 0
                                                ? `Resend available in ${resendTimer}s`
                                                : " Didn't get the code? Resend OTP"}
                                        </button>
                                    </div>

                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                        <button className="auth-submit" type="submit" disabled={loading || timeLeft === 0}>
                                            {loading ? <span className="spin" /> : 'Verify & Log In'}
                                        </button>

                                        <button
                                            type="button"
                                            className="edit-email-btn"
                                            onClick={() => setStep(1)}
                                        >
                                            ✏️ Edit details
                                        </button>
                                    </div>
                                </div>
                            )}
                        </form>
                    </>
                )}
            </div>


        </div>
    );
}
