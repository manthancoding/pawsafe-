import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from '../utils/LanguageContext';
import './ReadyToHelp.css';

// ── Animated counter hook ──────────────────────────────────
function useCountUp(target, duration = 1800) {
    const [count, setCount] = useState(0);
    const ref = useRef(false);
    useEffect(() => {
        if (ref.current) return;
        ref.current = true;
        let start = 0;
        const step = Math.ceil(target / (duration / 16));
        const timer = setInterval(() => {
            start += step;
            if (start >= target) { setCount(target); clearInterval(timer); }
            else setCount(start);
        }, 16);
        return () => clearInterval(timer);
    }, [target, duration]);
    return count;
}

// ── Sub-components ─────────────────────────────────────────
function StatCounter({ stat }) {
    const count = useCountUp(stat.value);
    return (
        <div className="rth-stat">
            <span className="rth-stat-icon">{stat.icon}</span>
            <strong>{count.toLocaleString('en-IN')}{stat.suffix}</strong>
            <small>{stat.label}</small>
        </div>
    );
}

function UpgradeVolunteerForm({ user, onLoginSuccess, onClose }) {
    const t = useTranslation();
    const rt = t.readyToHelp;
    const tf = rt.form;

    const [form, setForm] = useState({
        name: user?.name || '',
        phone: user?.phone || '',
        availability: '',
        latitude: 0,
        longitude: 0
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handle = (k, v) => setForm(f => ({ ...f, [k]: v }));

    const submit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const token = localStorage.getItem('pawsafe_token');
            const response = await fetch('/api/users/become-volunteer', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(form)
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Failed to upgrade account');

            localStorage.setItem('pawsafe_user', JSON.stringify(data.user));
            if (onLoginSuccess) onLoginSuccess(data.user);
            setSuccess(true);
            // Redirect immediately after a short delay for success toast to be felt
            setTimeout(() => {
                window.location.href = 'http://localhost:5174';
            }, 1500);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="form-success">
                <div className="success-icon">🎉</div>
                <h3>Upgrade Successful!</h3>
                <p>Welcome to the team! Redirecting you to the Volunteer Portal...</p>
            </div>
        );
    }

    return (
        <form className="signup-form" onSubmit={submit}>
            <h3 className="form-heading">Complete Volunteer Profile</h3>
            <p className="form-subtext">Add a few more details to start helping as a volunteer.</p>

            {error && <div className="auth-error" style={{ marginBottom: '1rem', color: '#c62828' }}>⚠️ {error}</div>}

            <div className="form-field">
                <label>Full Name</label>
                <input placeholder="Arjun Mehta" value={form.name} onChange={e => handle('name', e.target.value)} required />
            </div>

            <div className="form-field">
                <label>Phone Number</label>
                <input type="tel" placeholder="+91 98XXX XXXXX" value={form.phone} onChange={e => handle('phone', e.target.value)} required />
            </div>

            <div className="form-field">
                <label>Availability</label>
                <div className="avail-options">
                    {rt.availability.map(a => (
                        <button
                            key={a}
                            type="button"
                            className={`avail-btn ${form.availability === a ? 'active' : ''}`}
                            onClick={() => handle('availability', a)}
                        >
                            {a}
                        </button>
                    ))}
                </div>
            </div>

            <button type="submit" className="btn-submit-form" disabled={loading}>
                {loading ? 'Processing...' : 'Become a Volunteer 🐾'}
            </button>
            <button type="button" className="btn-role-form" style={{ marginTop: '10px', width: '100%', background: 'transparent', border: 'none', color: '#666' }} onClick={onClose}>
                Cancel
            </button>
        </form>
    );
}

// ── Main Section ───────────────────────────────────────────
export default function ReadyToHelp({ onVolunteer, onDonate, onEmergency, user, onLoginSuccess }) {
    const t = useTranslation();
    const rt = t.readyToHelp;
    const [activeRole, setActiveRole] = useState(null);
    const [showUpgradeForm, setShowUpgradeForm] = useState(false);
    const navigate = useNavigate();

    const ROLES = [
        {
            id: 'volunteer',
            icon: '🦸',
            color: '#0d7377',
            title: rt.roles[0].title,
            desc: rt.roles[0].desc,
            perks: rt.roles[0].perks,
            cta: rt.roles[0].cta,
        },
        {
            id: 'donor',
            icon: '💝',
            color: '#7b1fa2',
            title: rt.roles[1].title,
            desc: rt.roles[1].desc,
            perks: rt.roles[1].perks,
            cta: rt.roles[1].cta,
        },
        {
            id: 'reporter',
            icon: '📢',
            color: '#c62828',
            title: rt.roles[2].title,
            desc: rt.roles[2].desc,
            perks: rt.roles[2].perks,
            cta: rt.roles[2].cta,
        },
    ];

    const TESTIMONIALS = rt.testimonials.items.map((item, i) => ({
        ...item,
        emoji: i === 1 ? '👨' : (i === 2 ? '👩‍💼' : '👩')
    }));

    const STATS = [
        { value: 12400, label: rt.stats.volunteers, icon: '🦸', suffix: '+' },
        { value: 3800, label: rt.stats.rescues, icon: '🐾', suffix: '+' },
        { value: 540, label: rt.stats.partners, icon: '🏥', suffix: '+' },
        { value: 28, label: rt.stats.states, icon: '🗺️', suffix: '' },
    ];

    const handleRoleCTA = (roleId) => {
        if (roleId === 'volunteer') {
            const roles = user?.roles || (user?.role ? [user.role] : []);
            if (user && roles.includes('volunteer')) {
                onVolunteer?.();
            } else if (user) {
                navigate('/become-volunteer');
            } else {
                navigate('/volunteer/login', { state: { tab: 'signup', role: 'volunteer' } });
            }
        }
        else if (roleId === 'donor') { onDonate?.(); }
        else if (roleId === 'reporter') { onEmergency?.(); }
    };

    return (
        <section className="rth-section">
            <div className="container">

                {/* Header */}
                <div className="section-header">
                    <span className="section-tag">{rt.tag}</span>
                    <h2>{rt.heading}</h2>
                    <p className="section-subtitle">{rt.subtitle}</p>
                </div>

                {/* Live stats counters */}
                <div className="rth-stats">
                    {STATS.map((s, i) => <StatCounter key={i} stat={s} />)}
                </div>

                {/* Upgrade Modal Backdrop */}
                {showUpgradeForm && (
                    <div className="upgrade-modal-backdrop" onClick={() => setShowUpgradeForm(false)}>
                        <div className="upgrade-modal-content" onClick={e => e.stopPropagation()}>
                            <UpgradeVolunteerForm
                                user={user}
                                onLoginSuccess={onLoginSuccess}
                                onClose={() => setShowUpgradeForm(false)}
                            />
                        </div>
                    </div>
                )}

                {/* 3 Role cards */}
                <div className="roles-grid">
                    {ROLES.map(role => (
                        <div
                            key={role.id}
                            className={`role-card ${activeRole === role.id ? 'expanded' : ''}`}
                            style={{ '--rc': role.color }}
                            onMouseEnter={() => setActiveRole(role.id)}
                            onMouseLeave={() => setActiveRole(null)}
                        >
                            <div className="role-icon-wrap">
                                <span className="role-icon">{role.icon}</span>
                            </div>
                            <h3 className="role-title">{role.title}</h3>
                            <p className="role-desc">{role.desc}</p>
                            <ul className="role-perks">
                                {role.perks.map((p, i) => <li key={i}>✓ {p}</li>)}
                            </ul>
                            <div className="role-actions">
                                <button
                                    className="btn-role-cta"
                                    style={{ background: role.color }}
                                    onClick={() => handleRoleCTA(role.id)}
                                >
                                    {role.cta}
                                </button>
                                <button className="btn-role-form" onClick={() => navigate(role.id === 'volunteer' ? '/volunteer/login' : '/login', { state: { tab: 'signup' } })}>
                                    {t.language === 'en' ? 'or Sign Up →' : (t.language === 'hi' ? 'या साइन अप करें →' : '...')}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Sign-up CTA Banner */}
                <div className="cta-banner">
                    <div className="cta-banner-content">
                        <span className="cta-banner-icon">🐾</span>
                        <div>
                            <strong>{rt.banner.title}</strong>
                            <p>{rt.banner.desc}</p>
                        </div>
                    </div>
                    <button className="btn-open-form" onClick={() => navigate('/login', { state: { tab: 'signup' } })}>
                        {rt.banner.cta}
                    </button>
                </div>

                {/* Testimonials */}
                <div className="testimonials">
                    <p className="testimonials-heading">{rt.testimonials.heading}</p>
                    <div className="testimonials-grid">
                        {TESTIMONIALS.map((t, i) => (
                            <div key={i} className="testimonial-card">
                                <div className="t-avatar">{t.emoji}</div>
                                <p className="t-quote">"{t.quote}"</p>
                                <div className="t-meta">
                                    <strong>{t.name}</strong> · {t.city}
                                    <span className="t-role">{t.role}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </section>
    );
}
