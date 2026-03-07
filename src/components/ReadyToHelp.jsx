import { useState, useEffect, useRef } from 'react';
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

// ── Data ───────────────────────────────────────────────────
const ROLES = [
    {
        id: 'volunteer',
        icon: '🦸',
        color: '#0d7377',
        title: 'Volunteer Rescuer',
        desc: 'Accept nearby emergency cases, help transport injured animals, and assist NGOs on ground.',
        perks: ['Get real-time rescue alerts', 'Navigate to emergency locations', 'Track animals you\'ve helped'],
        cta: 'Join as Volunteer',
    },
    {
        id: 'donor',
        icon: '💝',
        color: '#7b1fa2',
        title: 'Donor',
        desc: 'Fund food, medical treatment, shelter, and emergency care for rescued animals across India.',
        perks: ['One-time or monthly options', 'Choose your cause', 'Get impact reports'],
        cta: 'Start Donating',
    },
    {
        id: 'reporter',
        icon: '📢',
        color: '#c62828',
        title: 'Field Reporter',
        desc: 'Spot injured or distressed animals on the street? Report them instantly so rescue teams can respond.',
        perks: ['File reports in 60 seconds', 'Share live location & photos', 'Get status updates'],
        cta: 'Report an Emergency',
    },
];

const SKILLS = [
    { id: 'transport', label: '🚗 Can Transport', desc: 'Have a vehicle to move animals' },
    { id: 'firstaid', label: '🩺 First Aid', desc: 'Know basic animal first aid' },
    { id: 'foster', label: '🏠 Can Foster', desc: 'Temporarily home an animal' },
    { id: 'document', label: '📸 Can Document', desc: 'Photo/video evidence at scene' },
    { id: 'vet', label: '👨‍⚕️ Vet / Para-vet', desc: 'Medical background' },
    { id: 'fundraise', label: '💰 Fundraiser', desc: 'Spread awareness & raise funds' },
];

const AVAILABILITY = ['Weekends Only', 'Weekday Evenings', 'Anytime', 'On-Call Emergencies Only'];

const TESTIMONIALS = [
    { name: 'Divya R.', city: 'Bengaluru', role: 'Volunteer Rescuer', emoji: '👩', quote: 'I rescued my first injured dog in 20 minutes using PawSafe. The step-by-step guidance made it so easy.' },
    { name: 'Karan M.', city: 'Mumbai', role: 'Monthly Donor', emoji: '👨', quote: 'Seeing Bruno\'s recovery tracker update every few days is the best feeling. Worth every rupee.' },
    { name: 'Sunita P.', city: 'Chennai', role: 'Field Reporter', emoji: '👩‍💼', quote: 'I reported a snake-bite case near my office. Rescue team arrived in 15 mins. Amazing platform!' },
];

const STATS = [
    { value: 12400, label: 'Volunteers', icon: '🦸', suffix: '+' },
    { value: 3800, label: 'Rescues', icon: '🐾', suffix: '+' },
    { value: 540, label: 'NGO Partners', icon: '🏥', suffix: '+' },
    { value: 28, label: 'States', icon: '🗺️', suffix: '' },
];

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

function SignUpForm({ onClose }) {
    const [form, setForm] = useState({ name: '', city: '', phone: '', availability: '', role: 'volunteer' });
    const [skills, setSkills] = useState([]);
    const [submitted, setSubmitted] = useState(false);

    const toggleSkill = (id) =>
        setSkills(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id]);

    const handle = (k, v) => setForm(f => ({ ...f, [k]: v }));

    const submit = (e) => {
        e.preventDefault();
        if (!form.name || !form.city || !form.phone) return;
        setSubmitted(true);
    };

    if (submitted) {
        return (
            <div className="form-success">
                <div className="success-icon">🎉</div>
                <h3>Welcome to the PawSafe family!</h3>
                <p>Hi <strong>{form.name}</strong>! Your registration is confirmed. We'll reach out to you in <strong>{form.city}</strong> when there's a rescue near you.</p>
                <p className="success-note">📱 Download our app (coming soon) to get live alerts.</p>
                <button className="btn-success-close" onClick={onClose}>Done</button>
            </div>
        );
    }

    return (
        <form className="signup-form" onSubmit={submit}>
            <h3 className="form-heading">🐾 Join PawSafe</h3>
            <p className="form-subtext">Quick 60-second sign-up. No experience needed.</p>

            {/* Role selector */}
            <div className="form-role-selector">
                {ROLES.map(r => (
                    <button
                        type="button"
                        key={r.id}
                        className={`form-role-btn ${form.role === r.id ? 'active' : ''}`}
                        style={{ '--rc': r.color }}
                        onClick={() => handle('role', r.id)}
                    >
                        {r.icon} {r.title}
                    </button>
                ))}
            </div>

            <div className="form-row">
                <div className="form-field">
                    <label>Full Name *</label>
                    <input placeholder="Arjun Mehta" value={form.name} onChange={e => handle('name', e.target.value)} required />
                </div>
                <div className="form-field">
                    <label>City *</label>
                    <input placeholder="Mumbai" value={form.city} onChange={e => handle('city', e.target.value)} required />
                </div>
            </div>

            <div className="form-field">
                <label>Phone *</label>
                <input type="tel" placeholder="+91 98XXX XXXXX" value={form.phone} onChange={e => handle('phone', e.target.value)} required />
            </div>

            {/* Availability */}
            <div className="form-field">
                <label>Availability</label>
                <div className="avail-options">
                    {AVAILABILITY.map(a => (
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

            {/* Skills */}
            <div className="form-field">
                <label>What can you do? <span className="optional">(select all that apply)</span></label>
                <div className="skill-chips">
                    {SKILLS.map(s => (
                        <button
                            key={s.id}
                            type="button"
                            className={`skill-chip ${skills.includes(s.id) ? 'active' : ''}`}
                            title={s.desc}
                            onClick={() => toggleSkill(s.id)}
                        >
                            {s.label}
                        </button>
                    ))}
                </div>
            </div>

            <button type="submit" className="btn-submit-form">
                🐾 Register Now — It's Free
            </button>
        </form>
    );
}

// ── Main Section ───────────────────────────────────────────
export default function ReadyToHelp({ onVolunteer, onDonate, onEmergency }) {
    const [showForm, setShowForm] = useState(false);
    const [activeRole, setActiveRole] = useState(null);

    const handleRoleCTA = (roleId) => {
        if (roleId === 'volunteer') { onVolunteer?.(); }
        else if (roleId === 'donor') { onDonate?.(); }
        else if (roleId === 'reporter') { onEmergency?.(); }
    };

    return (
        <section className="rth-section">
            <div className="container">

                {/* Header */}
                <div className="section-header">
                    <span className="section-tag">🤝 Get Involved</span>
                    <h2>Ready to Help? 🐾</h2>
                    <p className="section-subtitle">Join 12,400+ Indians protecting animals — as a rescuer, donor, or field reporter</p>
                </div>

                {/* Live stats counters */}
                <div className="rth-stats">
                    {STATS.map((s, i) => <StatCounter key={i} stat={s} />)}
                </div>

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
                                <button className="btn-role-form" onClick={() => setShowForm(true)}>
                                    or Sign Up →
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Sign-up form (inline toggle) */}
                {showForm ? (
                    <div className="form-panel">
                        <SignUpForm onClose={() => setShowForm(false)} />
                    </div>
                ) : (
                    <div className="cta-banner">
                        <div className="cta-banner-content">
                            <span className="cta-banner-icon">🐾</span>
                            <div>
                                <strong>Not sure where to start?</strong>
                                <p>Register in 60 seconds — we'll match you with the right role based on your skills and availability.</p>
                            </div>
                        </div>
                        <button className="btn-open-form" onClick={() => setShowForm(true)}>
                            ✍️ Quick Registration
                        </button>
                    </div>
                )}

                {/* Testimonials */}
                <div className="testimonials">
                    <p className="testimonials-heading">💬 What our community says</p>
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
