import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from '../utils/LanguageContext';
import './ReadyToHelp.css';

export default function BecomeVolunteerPage({ user, onUpdateUser }) {
    const t = useTranslation();
    const rt = t.readyToHelp;
    const navigate = useNavigate();

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
        if (!user) {
            navigate('/login', { state: { from: '/become-volunteer' } });
            return;
        }

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
            if (onUpdateUser) onUpdateUser(data.user);
            setSuccess(true);

            setTimeout(() => {
                window.location.href = 'http://localhost:5174';
            }, 2000);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="become-volunteer-page success-view">
                <div className="container">
                    <div className="status-card">
                        <div className="success-icon">🎉</div>
                        <h2>Upgrade Successful!</h2>
                        <p>Welcome to the PawSafe volunteer team! You are being redirected to your new dashboard...</p>
                        <div className="loader-line"></div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="become-volunteer-page">
            <div className="volunteer-hero">
                <div className="container">
                    <h1>Become a Life-Saver</h1>
                    <p>Join our network of dedicated volunteers and help animals in distress.</p>
                </div>
            </div>

            <div className="container content-container">
                <div className="form-card">
                    <div className="form-intro">
                        <h3>Volunteer Application</h3>
                        <p>Please provide a few more details to complete your rescuer profile. As a volunteer, you'll receive real-time alerts for animals in your area.</p>
                    </div>

                    <form className="upgrade-form" onSubmit={submit}>
                        {error && <div className="auth-error">⚠️ {error}</div>}

                        <div className="form-grid">
                            <div className="form-group">
                                <label>Full Name</label>
                                <input
                                    placeholder="e.g. Rahul Sharma"
                                    value={form.name}
                                    onChange={e => handle('name', e.target.value)}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Phone Number</label>
                                <input
                                    type="tel"
                                    placeholder="+91 9XXXX XXXXX"
                                    value={form.phone}
                                    onChange={e => handle('phone', e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label>General Availability</label>
                            <div className="avail-options">
                                {['Weekdays', 'Weekends', 'Evenings', '24/7 On-Call'].map(a => (
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

                        <div className="volunteer-agreement">
                            <p>By clicking below, you agree to respond to rescues to the best of your ability and follow our safety guidelines.</p>
                        </div>

                        <button type="submit" className="btn-submit-upgrade" disabled={loading}>
                            {loading ? 'Processing...' : 'Complete Registration 🐾'}
                        </button>
                    </form>
                </div>

                <div className="perks-sidebar">
                    <h4>Why Volunteer?</h4>
                    <ul className="perks-list">
                        <li>
                            <span className="perk-icon">🚨</span>
                            <strong>Real-time Alerts</strong>
                            <p>Get notified about animals near you that need help.</p>
                        </li>
                        <li>
                            <span className="perk-icon">🏥</span>
                            <strong>NGO Network</strong>
                            <p>Direct access to verified animal hospitals and NGOs.</p>
                        </li>
                        <li>
                            <span className="perk-icon">🎖️</span>
                            <strong>Earn Badges</strong>
                            <p>Get recognized for your life-saving contributions.</p>
                        </li>
                    </ul>
                </div>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                .become-volunteer-page {
                    min-height: 100vh;
                    background: #f8fbfa;
                    padding-bottom: 5rem;
                }
                .volunteer-hero {
                    background: linear-gradient(135deg, #0d7377 0%, #14b1ab 100%);
                    color: white;
                    padding: 6rem 1rem;
                    text-align: center;
                    clip-path: ellipse(150% 100% at 50% 0%);
                }
                .volunteer-hero h1 { font-size: 3rem; margin-bottom: 1rem; }
                @media (max-width: 600px) {
                    .volunteer-hero h1 { font-size: 2rem; }
                    .volunteer-hero p { font-size: 1rem; }
                }
                .volunteer-hero p { font-size: 1.2rem; opacity: 0.9; max-width: 600px; margin: 0 auto; }

                .content-container {
                    display: grid;
                    grid-template-columns: 1fr 350px;
                    gap: 2rem;
                    margin-top: -4rem;
                    position: relative;
                }

                .form-card {
                    background: white;
                    padding: 2.5rem;
                    border-radius: 20px;
                    box-shadow: 0 15px 40px rgba(0,0,0,0.08);
                }
                .form-intro { margin-bottom: 2rem; }
                .form-intro h3 { font-size: 1.8rem; color: #333; margin-bottom: 0.5rem; }
                
                .form-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 1.5rem;
                    margin-bottom: 1.5rem;
                }
                .form-group { margin-bottom: 1.5rem; }
                .form-group label { display: block; margin-bottom: 0.5rem; font-weight: 600; color: #555; }
                .form-group input { 
                    width: 100%; 
                    padding: 0.8rem 1rem; 
                    border: 2px solid #eee; 
                    border-radius: 10px; 
                    font-size: 1rem;
                    transition: border-color 0.2s;
                }
                .form-group input:focus { border-color: #0d7377; outline: none; }

                .avail-options { display: flex; flex-wrap: wrap; gap: 10px; }
                .avail-btn {
                    padding: 0.6rem 1.2rem;
                    border: 2px solid #eee;
                    border-radius: 30px;
                    background: white;
                    cursor: pointer;
                    font-weight: 500;
                    transition: all 0.2s;
                }
                .avail-btn.active { background: #0d7377; color: white; border-color: #0d7377; }

                .volunteer-agreement {
                    background: #f0f7f7;
                    padding: 1rem;
                    border-radius: 10px;
                    margin: 2rem 0;
                    font-size: 0.9rem;
                    color: #666;
                }

                .btn-submit-upgrade {
                    width: 100%;
                    padding: 1.2rem;
                    background: #0d7377;
                    color: white;
                    border: none;
                    border-radius: 12px;
                    font-size: 1.1rem;
                    font-weight: bold;
                    cursor: pointer;
                    box-shadow: 0 5px 15px rgba(13, 115, 119, 0.3);
                    transition: transform 0.2s;
                }
                .btn-submit-upgrade:hover { transform: translateY(-2px); }

                .perks-sidebar {
                    background: white;
                    padding: 2rem;
                    border-radius: 20px;
                    box-shadow: 0 10px 30px rgba(0,0,0,0.05);
                    height: fit-content;
                }
                .perks-sidebar h4 { font-size: 1.3rem; margin-bottom: 1.5rem; }
                .perks-list { list-style: none; padding: 0; }
                .perks-list li { margin-bottom: 1.5rem; position: relative; padding-left: 3rem; }
                .perk-icon { position: absolute; left: 0; top: 0; font-size: 1.8rem; }
                .perks-list li strong { display: block; margin-bottom: 0.2rem; }
                .perks-list li p { font-size: 0.9rem; color: #777; line-height: 1.4; }

                .status-card {
                    background: white;
                    padding: 4rem;
                    border-radius: 24px;
                    text-align: center;
                    max-width: 500px;
                    margin: 4rem auto;
                    box-shadow: 0 20px 50px rgba(0,0,0,0.1);
                }
                .success-icon { font-size: 4rem; margin-bottom: 1.5rem; }
                .loader-line {
                    height: 4px;
                    background: #0d7377;
                    width: 0;
                    margin-top: 2rem;
                    animation: fill 2s linear forwards;
                }
                @keyframes fill { to { width: 100%; } }

                @media (max-width: 900px) {
                    .content-container { grid-template-columns: 1fr; }
                    .form-grid { grid-template-columns: 1fr; }
                }
            `}} />
        </div>
    );
}
