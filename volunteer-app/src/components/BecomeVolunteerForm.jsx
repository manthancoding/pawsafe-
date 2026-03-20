import { useState } from 'react';
import './LoginPage.css';

export default function BecomeVolunteerForm({ user, onUpgrade }) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [form, setForm] = useState({
        name: user?.name || '',
        phone: '',
        availability: 'available',
        latitude: 0,
        longitude: 0
    });

    const handleSubmit = async (e) => {
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
            if (!response.ok) throw new Error(data.message || 'Failed to upgrade profile');

            // Update local storage with new roles
            const updatedUser = { ...user, roles: data.user.roles };
            localStorage.setItem('pawsafe_user', JSON.stringify(updatedUser));

            setSuccess(true);
            if (onUpgrade) onUpgrade(updatedUser);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="login-page">
                <div className="login-card" style={{ textAlign: 'center' }}>
                    <div className="login-logo">🎉</div>
                    <h1 style={{ color: '#fff', marginTop: '1rem' }}>Profile Updated!</h1>
                    <p style={{ color: 'rgba(255,255,255,0.8)', margin: '1rem 0' }}>
                        Welcome to the volunteer team. You now have access to the dashboard.
                    </p>
                    <button
                        className="auth-submit"
                        onClick={() => window.location.reload()}
                    >
                        Enter Dashboard
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="login-page">
            <div className="login-card">
                <div className="login-brand">
                    <div className="login-logo">🧑‍🚒</div>
                    <h1>Complete Profile</h1>
                    <p>Add a few details to start helping as a volunteer.</p>
                </div>

                <form className="auth-form" onSubmit={handleSubmit}>
                    {error && <div className="auth-error">⚠️ {error}</div>}

                    <div className="form-group">
                        <label>Full Name</label>
                        <div className="input-wrapper">
                            <span className="input-icon">👤</span>
                            <input
                                type="text"
                                value={form.name}
                                onChange={e => setForm({ ...form, name: e.target.value })}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Phone Number</label>
                        <div className="input-wrapper">
                            <span className="input-icon">📞</span>
                            <input
                                type="tel"
                                placeholder="+91 98XXX XXXXX"
                                value={form.phone}
                                onChange={e => setForm({ ...form, phone: e.target.value })}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Availability</label>
                        <select
                            style={{
                                width: '100%',
                                padding: '12px 15px',
                                background: 'rgba(255,255,255,0.1)',
                                border: '1.5px solid rgba(255,255,255,0.2)',
                                borderRadius: '10px',
                                color: '#fff',
                                outline: 'none'
                            }}
                            value={form.availability}
                            onChange={e => setForm({ ...form, availability: e.target.value })}
                        >
                            <option value="available" style={{ background: '#0d7377' }}>Available Anytime</option>
                            <option value="weekends" style={{ background: '#0d7377' }}>Weekends Only</option>
                            <option value="evenings" style={{ background: '#0d7377' }}>Weekday Evenings</option>
                            <option value="on-call" style={{ background: '#0d7377' }}>On-Call Emergencies</option>
                        </select>
                    </div>

                    <button className="auth-submit" type="submit" disabled={loading}>
                        {loading ? 'Updating...' : 'Become a Volunteer 🐾'}
                    </button>
                </form>
            </div>
        </div>
    );
}
