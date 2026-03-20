import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css'; // Reusing existing styles for consistency

const API_BASE_URL = '/api';

export default function VolunteerLoginPage({ onLoginSuccess }) {
    const navigate = useNavigate();
    const [tab, setTab] = useState('login');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [step, setStep] = useState(1); // 1: Collect Info, 2: OTP
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [timeLeft, setTimeLeft] = useState(300);
    const [resendTimer, setResendTimer] = useState(0);
    const [form, setForm] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
        availability: 'available',
    });

    useEffect(() => {
        if (step === 2 && timeLeft > 0) {
            const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
            return () => clearInterval(timer);
        }
    }, [step, timeLeft]);

    useEffect(() => {
        if (resendTimer > 0) {
            const timer = setInterval(() => setResendTimer(prev => prev - 1), 1000);
            return () => clearInterval(timer);
        }
    }, [resendTimer]);

    const handleOtpChange = (element, index) => {
        if (isNaN(element.value)) return false;
        const newOtp = [...otp];
        newOtp[index] = element.value;
        setOtp(newOtp);
        if (element.nextSibling && element.value !== "") element.nextSibling.focus();
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
            setSuccess('New OTP sent!');
            setOtp(['', '', '', '', '', '']);
            setTimeLeft(300);
            setResendTimer(60);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (step === 1) {
            setLoading(true);
            try {
                if (tab === 'login') {
                    // Direct login
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
                    if (onLoginSuccess) onLoginSuccess(data.user);
                    setSuccess('Welcome back, Volunteer! 🐾');
                    setTimeout(() => navigate('/volunteer/dashboard'), 1500);
                } else {
                    // Signup: Send OTP
                    const response = await fetch(`${API_BASE_URL}/auth/send-otp`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ email: form.email, type: tab })
                    });
                    const data = await response.json();
                    if (!response.ok) throw new Error(data.message || 'Failed to send OTP');
                    setStep(2);
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        } else {
            const otpCode = otp.join('');
            if (otpCode.length !== 6) return setError('Enter 6-digit code');
            setLoading(true);
            try {
                const response = await fetch(`${API_BASE_URL}/auth/verify-otp`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        ...form,
                        otp: otpCode,
                        type: tab,
                        role: 'volunteer'
                    })
                });
                const data = await response.json();
                if (!response.ok) throw new Error(data.message || 'Invalid OTP');

                localStorage.setItem('pawsafe_token', data.token);
                localStorage.setItem('pawsafe_user', JSON.stringify(data.user));
                if (onLoginSuccess) onLoginSuccess(data.user);
                setSuccess('Welcome, Volunteer! 🐾');
                setTimeout(() => navigate('/volunteer/dashboard'), 1500);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }
    };

    return (
        <div className="login-page">
            <div className="login-card">
                <div className="login-brand">
                    <div className="login-logo">🧑‍🚒</div>
                    <h1>Volunteer {step === 1 ? (tab === 'login' ? 'Login' : 'Join Us') : 'Verify'}</h1>
                    <p>{step === 1 ? 'Help us protect every paw.' : 'Check your email for the code'}</p>
                </div>

                {step === 1 && (
                    <div className="auth-tabs">
                        <button className={`auth-tab ${tab === 'login' ? 'active' : ''}`} onClick={() => setTab('login')}>Login</button>
                        <button className={`auth-tab ${tab === 'signup' ? 'active' : ''}`} onClick={() => setTab('signup')}>Apply</button>
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
                                    onClick={() => {
                                        setTab('login');
                                        setError('');
                                        setForm({ ...form, password: '' });
                                    }}
                                >
                                    Login instead
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
                                            <input type="text" placeholder="Your Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label>Phone Number</label>
                                        <div className="input-wrapper">
                                            <span className="input-icon">📞</span>
                                            <input type="tel" placeholder="+91..." value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} required />
                                        </div>
                                    </div>
                                </>
                            )}
                            <div className="form-group">
                                <label>Email Address</label>
                                <div className="input-wrapper">
                                    <span className="input-icon">📧</span>
                                    <input type="email" placeholder="volunteer@example.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Password</label>
                                <div className="input-wrapper">
                                    <span className="input-icon">🔒</span>
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        placeholder="••••••••"
                                        value={form.password}
                                        onChange={e => setForm({ ...form, password: e.target.value })}
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
                                {loading ? 'Processing...' : (tab === 'login' ? 'Login' : 'Continue')}
                            </button>
                        </>
                    ) : (
                        <>
                            <div className="otp-boxes-container">
                                {otp.map((d, i) => (
                                    <input key={i} type="text" maxLength="1" className="otp-box" value={d} onChange={e => handleOtpChange(e.target, i)} onKeyDown={e => handleKeyDown(e, i)} autoFocus={i === 0} />
                                ))}
                            </div>
                            <button className="auth-submit" type="submit" disabled={loading}>
                                {loading ? 'Verifying...' : 'Verify & Enter Dashboard'}
                            </button>
                            <button type="button" className="resend-otp-btn" onClick={handleResendOtp} disabled={resendTimer > 0}>
                                {resendTimer > 0 ? `Resend in ${resendTimer}s` : "Resend OTP"}
                            </button>
                        </>
                    )}
                </form>
            </div>
        </div>
    );
}
