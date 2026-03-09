import { useState, useEffect } from 'react';
import { emergencyApi } from '../utils/api';
import RecoveryTracker from './RecoveryTracker';
import './VolunteerDashboard.css';

// ── Mock Data ──────────────────────────────────────────────
const MOCK_VOLUNTEER = {
    name: 'Arjun Mehta',
    city: 'Mumbai',
    avatar: '🧑‍🚒',
    rating: 4.8,
    totalRescues: 47,
    badge: 'Gold Rescuer',
};

const INITIAL_CASES = [
    {
        id: '__placeholder__',
        animal: '🐶', type: 'Dog', status: 'active',
        title: 'Loading emergencies…',
        location: 'Please wait', distance: '', time: '',
        urgency: 'moderate', reporter: '',
        description: 'Fetching live cases from server.',
        coords: { lat: 0, lng: 0 },
    },
];

const COMPLETED = [
    { id: 101, animal: '🐶', title: 'Street dog rescue – Dadar', date: '01 Mar 2026', outcome: 'Treated & Released' },
    { id: 102, animal: '🐄', title: 'Cow leg injury – Malad', date: '28 Feb 2026', outcome: 'Handed to NGO' },
    { id: 103, animal: '🐒', title: 'Baby monkey – Goregaon', date: '25 Feb 2026', outcome: 'Wildlife Centre' },
];

const URGENCY_META = {
    critical: { color: '#e53935', label: '🔴 Critical' },
    urgent: { color: '#f57c00', label: '🟠 Urgent' },
    moderate: { color: '#0d7377', label: '🟢 Moderate' },
};

// ── Sub-components ─────────────────────────────────────────
function CaseCard({ c, onSelect, isSelected }) {
    const u = URGENCY_META[c.urgency];
    return (
        <div
            className={`case-card ${isSelected ? 'selected' : ''} ${c.urgency}`}
            onClick={() => onSelect(c)}
        >
            <div className="case-card-top">
                <span className="case-animal">{c.animal}</span>
                <div className="case-card-info">
                    <p className="case-title">{c.title}</p>
                    <p className="case-location">📍 {c.location} · {c.distance}</p>
                </div>
                <span className="case-time">{c.time}</span>
            </div>
            <div className="case-card-bottom">
                <span className="urgency-pill" style={{ background: u.color }}>{u.label}</span>
                <span className={`status-badge status-${c.status}`}>{c.status}</span>
            </div>
        </div>
    );
}

function MainPanel({ activeCase, cases, onAccept, onDecline, onClearSelected }) {
    const [notifPulse, setNotifPulse] = useState(true);

    // pulse effect every 5s
    useEffect(() => {
        const t = setInterval(() => setNotifPulse(p => !p), 5000);
        return () => clearInterval(t);
    }, []);

    if (!activeCase) {
        return (
            <div className="main-panel">
                <div className="panel-header">
                    <h2>📋 Live Case Feed</h2>
                    <span className={`live-indicator ${notifPulse ? 'pulse' : ''}`}>🔴 LIVE</span>
                </div>

                <div className="notification-banner">
                    <span className="notif-icon">🔔</span>
                    <div>
                        <strong>{cases.filter(c => c.status === 'active').length} active emergencies</strong> near you
                        <p>Select a case from the sidebar or below to see details.</p>
                    </div>
                </div>

                <div className="cases-feed">
                    {cases.map(c => (
                        <CaseCard key={c.id} c={c} onSelect={onAccept} isSelected={false} />
                    ))}
                </div>
            </div>
        );
    }

    const u = URGENCY_META[activeCase.urgency];

    return (
        <div className="main-panel">
            <div className="panel-header">
                <button className="back-btn" onClick={onClearSelected}>← Back</button>
                <h2>Case Details</h2>
                <span className="urgency-pill-lg" style={{ background: u.color }}>{u.label}</span>
            </div>

            {/* Case Detail Card */}
            <div className="case-detail-card">
                <div className="detail-header">
                    <span className="detail-animal">{activeCase.animal}</span>
                    <div>
                        <h3>{activeCase.title}</h3>
                        <p className="detail-meta">📍 {activeCase.location} &nbsp;·&nbsp; 🕐 {activeCase.time}</p>
                        <p className="detail-meta">👤 Reported by: <strong>{activeCase.reporter}</strong></p>
                    </div>
                </div>
                <p className="detail-description">{activeCase.description}</p>

                <div className="detail-stats">
                    <div className="dstat"><span>📏</span><strong>{activeCase.distance}</strong><small>Distance</small></div>
                    <div className="dstat"><span>🐾</span><strong>{activeCase.type}</strong><small>Animal</small></div>
                    <div className="dstat"><span>⚠️</span><strong>{activeCase.urgency}</strong><small>Urgency</small></div>
                </div>
            </div>

            {/* Map placeholder */}
            <div className="map-placeholder">
                <span>🗺️</span>
                <div>
                    <strong>Live Location</strong>
                    <p>Lat: {activeCase.coords.lat} · Lng: {activeCase.coords.lng}</p>
                </div>
                <a
                    href={`https://maps.google.com/?q=${activeCase.coords.lat},${activeCase.coords.lng}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-navigate"
                >
                    🧭 Navigate
                </a>
            </div>

            {/* Actions */}
            <div className="case-actions">
                <button className="btn-decline" onClick={() => onDecline(activeCase.id)}>
                    ✗ Decline
                </button>
                <button className="btn-accept" onClick={() => onAccept(activeCase)}>
                    ✔ Accept Rescue
                </button>
            </div>
        </div>
    );
}

// ── Main Dashboard ─────────────────────────────────────────
export default function VolunteerDashboard({ onClose }) {
    const [activeTab, setActiveTab] = useState('alerts');
    const [cases, setCases] = useState([]);
    const [selectedCase, setSelectedCase] = useState(null);
    const [accepted, setAccepted] = useState([]);
    const [toast, setToast] = useState(null);

    // Load live emergencies from backend
    useEffect(() => {
        emergencyApi.getAll()
            .then((data) => {
                // Map DB docs to the shape the UI expects
                const mapped = data.map((e) => ({
                    id: e._id,
                    animal: { dog: '🐶', cat: '🐱', bird: '🦅', rabbit: '🐰', other: '🦁' }[e.animalType] || '🐾',
                    type: e.animalType.charAt(0).toUpperCase() + e.animalType.slice(1),
                    status: e.status,
                    title: `${e.issueType.charAt(0).toUpperCase() + e.issueType.slice(1)} ${e.animalType} – ${e.location || 'Unknown location'}`,
                    location: e.location || 'Location not provided',
                    distance: '',
                    time: new Date(e.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
                    urgency: e.urgency,
                    reporter: e.name,
                    description: e.details,
                    coords: { lat: e.latitude || 0, lng: e.longitude || 0 },
                }));
                setCases(mapped);
            })
            .catch(() => {
                // Fallback to hardcoded data if backend unavailable
                setCases([
                    { id: 1, animal: '🐶', type: 'Dog', status: 'active', title: 'Injured stray dog – Highway NH48', location: 'Andheri West, Mumbai', distance: '1.3 km', time: '2 min ago', urgency: 'critical', reporter: 'Priya Sharma', description: 'Large dog hit by vehicle. Bleeding from hind leg.', coords: { lat: 19.119, lng: 72.847 } },
                    { id: 2, animal: '🐱', type: 'Cat', status: 'active', title: 'Kitten trapped in drain', location: 'Borivali East, Mumbai', distance: '3.1 km', time: '8 min ago', urgency: 'urgent', reporter: 'Rahul Nair', description: 'Small kitten stuck in open drain.', coords: { lat: 19.233, lng: 72.856 } },
                ]);
            });
    }, []);

    const showToast = (msg, type = 'success') => {
        setToast({ msg, type });
        setTimeout(() => setToast(null), 3000);
    };

    const handleAccept = (c) => {
        setAccepted(prev => [...prev.filter(a => a.id !== c.id), { ...c, status: 'accepted' }]);
        setCases(prev => prev.map(x => x.id === c.id ? { ...x, status: 'accepted' } : x));
        setSelectedCase(null);
        showToast(`✅ Rescue accepted for ${c.type} at ${c.location}`);
        // Persist status to backend
        emergencyApi.updateStatus(c.id, 'accepted').catch(console.error);
    };

    const handleDecline = (id) => {
        setCases(prev => prev.map(x => x.id === id ? { ...x, status: 'declined' } : x));
        setSelectedCase(null);
        showToast('❌ Case declined', 'error');
        // Persist status to backend
        emergencyApi.updateStatus(id, 'declined').catch(console.error);
    };

    const navItems = [
        { key: 'cases', icon: '🚨', label: 'My Active Cases', badge: accepted.length || null },
        { key: 'alerts', icon: '🔔', label: 'Nearby Alerts', badge: cases.filter(c => c.status === 'active').length },
        { key: 'recovery', icon: '🐾', label: 'Recovery Tracker', badge: null },
        { key: 'completed', icon: '✅', label: 'Completed Rescues', badge: COMPLETED.length },
        { key: 'profile', icon: '👤', label: 'Profile', badge: null },
        { key: 'settings', icon: '⚙️', label: 'Settings', badge: null },
    ];

    return (
        <div className="vd-overlay">
            <div className="vd-shell">

                {/* Toast */}
                {toast && (
                    <div className={`vd-toast ${toast.type}`}>{toast.msg}</div>
                )}

                {/* ── Sidebar ── */}
                <aside className="vd-sidebar">
                    <div className="vd-sidebar-header">
                        <span className="vd-avatar">{MOCK_VOLUNTEER.avatar}</span>
                        <div>
                            <p className="vd-name">{MOCK_VOLUNTEER.name}</p>
                            <p className="vd-badge">🏅 {MOCK_VOLUNTEER.badge}</p>
                        </div>
                    </div>

                    <div className="vd-stats-row">
                        <div className="vd-stat"><strong>{MOCK_VOLUNTEER.totalRescues}</strong><small>Rescues</small></div>
                        <div className="vd-stat"><strong>{MOCK_VOLUNTEER.rating}⭐</strong><small>Rating</small></div>
                        <div className="vd-stat"><strong>{accepted.length}</strong><small>Active</small></div>
                    </div>

                    <nav className="vd-nav">
                        {navItems.map(item => (
                            <button
                                key={item.key}
                                className={`vd-nav-item ${activeTab === item.key ? 'active' : ''}`}
                                onClick={() => { setActiveTab(item.key); setSelectedCase(null); }}
                            >
                                <span className="nav-icon">{item.icon}</span>
                                <span className="nav-label">{item.label}</span>
                                {item.badge ? <span className="nav-badge">{item.badge}</span> : null}
                            </button>
                        ))}
                    </nav>

                    <button className="vd-close-btn" onClick={onClose}>✕ Exit Dashboard</button>
                </aside>

                {/* ── Main Panel ── */}
                <main className="vd-main">
                    {/* Nearby Alerts / case feed */}
                    {activeTab === 'alerts' && (
                        <MainPanel
                            activeCase={selectedCase}
                            cases={cases}
                            onAccept={(c) => setSelectedCase(c)}
                            onDecline={handleDecline}
                            onClearSelected={() => setSelectedCase(null)}
                        />
                    )}

                    {activeTab === 'cases' && (
                        <div className="main-panel">
                            <div className="panel-header"><h2>🚨 My Active Cases</h2></div>
                            {accepted.length === 0 ? (
                                <div className="empty-state">
                                    <span>📭</span><p>No active cases yet. Accept a rescue from Nearby Alerts.</p>
                                </div>
                            ) : (
                                <div className="cases-feed">
                                    {accepted.map(c => (
                                        <CaseCard key={c.id} c={c} onSelect={setSelectedCase} isSelected={selectedCase?.id === c.id} />
                                    ))}
                                </div>
                            )}
                            {selectedCase && activeTab === 'cases' && (
                                <div className="map-placeholder" style={{ marginTop: '1.5rem' }}>
                                    <span>🗺️</span>
                                    <div>
                                        <strong>{selectedCase.location}</strong>
                                        <p>Lat: {selectedCase.coords.lat} · Lng: {selectedCase.coords.lng}</p>
                                    </div>
                                    <a
                                        href={`https://maps.google.com/?q=${selectedCase.coords.lat},${selectedCase.coords.lng}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="btn-navigate"
                                    >
                                        🧭 Navigate
                                    </a>
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'recovery' && (
                        <div className="main-panel" style={{ padding: 0, flex: 1 }}>
                            <RecoveryTracker />
                        </div>
                    )}

                    {activeTab === 'completed' && (
                        <div className="main-panel">
                            <div className="panel-header"><h2>✅ Completed Rescues</h2></div>
                            <div className="completed-list">
                                {COMPLETED.map(r => (
                                    <div key={r.id} className="completed-item">
                                        <span className="completed-icon">{r.animal}</span>
                                        <div className="completed-info">
                                            <p className="completed-title">{r.title}</p>
                                            <p className="completed-meta">{r.date} · <strong>{r.outcome}</strong></p>
                                        </div>
                                        <span className="completed-check">✅</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {activeTab === 'profile' && (
                        <div className="main-panel">
                            <div className="panel-header"><h2>👤 My Profile</h2></div>
                            <div className="profile-card">
                                <div className="profile-avatar-lg">{MOCK_VOLUNTEER.avatar}</div>
                                <h3>{MOCK_VOLUNTEER.name}</h3>
                                <p className="profile-city">📍 {MOCK_VOLUNTEER.city}</p>
                                <p className="profile-badge">🏅 {MOCK_VOLUNTEER.badge}</p>
                                <div className="profile-stats">
                                    <div className="pstat"><strong>{MOCK_VOLUNTEER.totalRescues}</strong><small>Total Rescues</small></div>
                                    <div className="pstat"><strong>{MOCK_VOLUNTEER.rating}</strong><small>Rating</small></div>
                                    <div className="pstat"><strong>3</strong><small>Years Active</small></div>
                                </div>
                                <button className="btn-edit-profile">✏️ Edit Profile</button>
                            </div>
                        </div>
                    )}

                    {activeTab === 'settings' && (
                        <div className="main-panel">
                            <div className="panel-header"><h2>⚙️ Settings</h2></div>
                            <div className="settings-list">
                                {[
                                    { label: 'Push Notifications', desc: 'Get alerts for nearby emergencies', on: true },
                                    { label: 'Location Sharing', desc: 'Share your location with rescue coordinators', on: true },
                                    { label: 'Night Mode Alerts', desc: 'Receive alerts between 10PM–6AM', on: false },
                                    { label: 'Email Summaries', desc: 'Weekly rescue activity report', on: true },
                                ].map((s, i) => (
                                    <div key={i} className="setting-item">
                                        <div>
                                            <p className="setting-label">{s.label}</p>
                                            <p className="setting-desc">{s.desc}</p>
                                        </div>
                                        <div className={`toggle-switch ${s.on ? 'on' : ''}`}>
                                            <div className="toggle-thumb" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}
