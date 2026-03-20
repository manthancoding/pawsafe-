import { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, query, where, onSnapshot, doc } from 'firebase/firestore';
import { emergencyApi, volunteerApi, chatApi } from '../utils/api';
import RecoveryTracker from './RecoveryTracker';
import './VolunteerDashboard.css';

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

// ── Sub-components ──
function CaseCard({ c, onSelect, isSelected }) {
    const u = URGENCY_META[c.urgency] || URGENCY_META.moderate;
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

function MainPanel({ activeCase, cases, onSelect, onAccept, onDecline, onClearSelected }) {
    const [notifPulse, setNotifPulse] = useState(true);

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
                        <strong>{cases.length} active emergencies</strong> near you
                        <p>Select a case from the sidebar or below to see details.</p>
                    </div>
                </div>

                <div className="cases-feed">
                    {cases.map(c => (
                        <CaseCard key={c.id} c={c} onSelect={onSelect} isSelected={false} />
                    ))}
                </div>
            </div>
        );
    }

    const u = URGENCY_META[activeCase.urgency] || URGENCY_META.moderate;

    return (
        <div className="main-panel">
            <div className="panel-header">
                <button className="back-btn" onClick={onClearSelected}>← Back</button>
                <h2>Case Details</h2>
                <span className="urgency-pill-lg" style={{ background: u.color }}>{u.label}</span>
            </div>

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

            <div className="map-placeholder" style={{ marginTop: '1.5rem' }}>
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

            <div className="case-actions" style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem' }}>
                <button className="btn-decline" onClick={() => onDecline(activeCase.id)}>✗ Decline</button>
                <button className="btn-accept" onClick={() => onAccept(activeCase)}>✔ Accept Rescue</button>
            </div>
        </div>
    );
}

// ── Main Dashboard ──
export default function VolunteerDashboard({ onLogout }) {
    const user = JSON.parse(localStorage.getItem('pawsafe_user')) || {};
    const [activeTab, setActiveTab] = useState('alerts');
    const [cases, setCases] = useState([]);
    const [selectedCase, setSelectedCase] = useState(null);
    const [accepted, setAccepted] = useState([]);
    const [toast, setToast] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [volunteerLoc, setVolunteerLoc] = useState(user.coords || { lat: 19.076, lng: 72.877 });
    const [liveSession, setLiveSession] = useState(null);

    // Haversine Distance
    const calculateDistance = (lat1, lon1, lat2, lon2) => {
        const R = 6371;
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    };

    // 1. Nearby Alerts Listener
    useEffect(() => {
        const q = query(collection(db, 'rescueRequests'), where('status', '==', 'pending'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const mapped = snapshot.docs.map((doc) => {
                const e = doc.data();
                const dist = calculateDistance(volunteerLoc.lat, volunteerLoc.lng, e.latitude || 0, e.longitude || 0).toFixed(1);
                return {
                    id: doc.id,
                    animal: { dog: '🐶', cat: '🐱', bird: '🦅', rabbit: '🐰', other: '🐾' }[e.animalType] || '🐾',
                    type: e.animalType,
                    status: e.status,
                    title: `${e.issueType} ${e.animalType} – ${e.location}`,
                    location: e.location,
                    distance: `${dist} km`,
                    time: e.createdAt?.toDate ? e.createdAt.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Now',
                    urgency: e.priority || 'moderate',
                    reporter: e.name,
                    description: e.details,
                    coords: { lat: e.latitude || 0, lng: e.longitude || 0 },
                };
            });
            setCases(mapped.filter(c => parseFloat(c.distance) <= 10));
        });
        return () => unsubscribe();
    }, [volunteerLoc]);

    // 2. Tracking + Live Session Status
    useEffect(() => {
        if (!navigator.geolocation) return;
        const watchId = navigator.geolocation.watchPosition(
            (pos) => {
                const newLoc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
                setVolunteerLoc(newLoc);
                volunteerApi.updateLocation(user.uid, newLoc.lat, newLoc.lng).catch(console.error);
                if (liveSession) {
                    emergencyApi.updateLiveLocation(liveSession.rescueId, newLoc.lat, newLoc.lng).catch(console.error);
                }
            },
            (err) => console.error("GPS Error:", err),
            { enableHighAccuracy: true, timeout: 10000 }
        );
        return () => navigator.geolocation.clearWatch(watchId);
    }, [liveSession, user.uid]);

    // 2.1 Sync Live Session Data
    useEffect(() => {
        if (accepted.length > 0) {
            const activeId = accepted[0].id;
            const unsubscribe = onSnapshot(doc(db, 'activeRescues', activeId), (snapshot) => {
                if (snapshot.exists()) setLiveSession(snapshot.data());
                else setLiveSession(null);
            });
            return () => unsubscribe();
        } else {
            setLiveSession(null);
        }
    }, [accepted]);

    // 3. Chat Listener
    useEffect(() => {
        if (selectedCase && activeTab === 'cases') {
            const q = query(collection(db, 'rescueChats'), where('rescueId', '==', selectedCase.id));
            const unsubscribe = onSnapshot(q, (snapshot) => {
                const msgs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
                    .sort((a, b) => (a.timestamp?.seconds || 0) - (b.timestamp?.seconds || 0));
                setMessages(msgs);
            });
            return () => unsubscribe();
        }
    }, [selectedCase, activeTab]);

    const showToast = (msg, type = 'success') => {
        setToast({ msg, type });
        setTimeout(() => setToast(null), 3000);
    };

    const handleAccept = async (c) => {
        try {
            await emergencyApi.updateStatus(c.id, 'accepted', user.uid);
            setAccepted(prev => [...prev.filter(a => a.id !== c.id), { ...c, status: 'accepted' }]);
            setSelectedCase(null);
            showToast(`✅ Rescue accepted! Navigate now.`);
        } catch (err) {
            showToast(`❌ Error: ${err.message}`, 'error');
        }
    };

    const handleDecline = (id) => {
        setSelectedCase(null);
        showToast('✗ Case removed from feed', 'error');
    };

    const handleSessionStatus = async (status) => {
        if (!selectedCase) return;
        try {
            if (status === 'completed') {
                await emergencyApi.updateStatus(selectedCase.id, 'completed', user.uid);
                setAccepted(prev => prev.filter(c => c.id !== selectedCase.id));
                setSelectedCase(null);
                showToast('✅ Rescue marked as completed!');
            } else {
                await emergencyApi.updateSessionStatus(selectedCase.id, status);
                showToast(`Status updated: ${status.replace('_', ' ')}`);
            }
        } catch (err) {
            console.error('Status update failed:', err);
            showToast('Failed to update status', 'error');
        }
    };

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !selectedCase) return;
        chatApi.send(selectedCase.id, user.uid, newMessage).catch(console.error);
        setNewMessage('');
    };

    const navItems = [
        { key: 'cases', icon: '🚨', label: 'My Active Cases', badge: accepted.length || null },
        { key: 'alerts', icon: '🔔', label: 'Nearby Alerts', badge: cases.length },
        { key: 'recovery', icon: '🐾', label: 'Recovery Tracker', badge: null },
        { key: 'completed', icon: '✅', label: 'Completed Rescues', badge: COMPLETED.length },
        { key: 'profile', icon: '👤', label: 'Profile', badge: null },
        { key: 'settings', icon: '⚙️', label: 'Settings', badge: null },
    ];

    return (
        <div className="vd-overlay">
            <div className="vd-shell">
                {toast && <div className={`vd-toast ${toast.type}`}>{toast.msg}</div>}

                <aside className="vd-sidebar">
                    <div className="vd-sidebar-header">
                        <span className="vd-avatar">🧑‍🚒</span>
                        <div>
                            <p className="vd-name">{user.name}</p>
                            <p className="vd-badge">🏅 Volunteer</p>
                        </div>
                    </div>
                    <div className="vd-stats-row">
                        <div className="vd-stat"><strong>{user.totalRescues || 0}</strong><small>Rescues</small></div>
                        <div className="vd-stat"><strong>{user.rating || 5.0}⭐</strong><small>Rating</small></div>
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
                    <button className="vd-close-btn" onClick={() => window.location.href = '/'}>✕ Exit Dashboard</button>
                    <button className="vd-logout-btn" onClick={onLogout} style={{ marginTop: 'auto' }}>🚪 Logout</button>
                </aside>

                <main className="vd-main">
                    {activeTab === 'alerts' && (
                        <MainPanel
                            activeCase={selectedCase}
                            cases={cases}
                            onSelect={(c) => setSelectedCase(c)}
                            onAccept={handleAccept}
                            onDecline={handleDecline}
                            onClearSelected={() => setSelectedCase(null)}
                        />
                    )}

                    {activeTab === 'cases' && (
                        <div className="main-panel">
                            <div className="panel-header"><h2>🚨 My Active Cases</h2></div>
                            {accepted.length === 0 ? (
                                <div className="empty-state"><span>📭</span><p>No active cases. Check Nearby Alerts.</p></div>
                            ) : (
                                <div className="cases-feed">
                                    {accepted.map(c => <CaseCard key={c.id} c={c} onSelect={setSelectedCase} isSelected={selectedCase?.id === c.id} />)}
                                </div>
                            )}

                            {selectedCase && (
                                <div className="active-case-details" style={{ marginTop: '1.5rem' }}>
                                    <div className="live-session-card">
                                        <div className="live-session-header">
                                            <h3>🚨 Live Rescue Mode</h3>
                                            <span className={`session-status-badge ${liveSession?.status || 'on_the_way'}`}>
                                                {(liveSession?.status || 'On the way').replace('_', ' ').toUpperCase()}
                                            </span>
                                        </div>
                                        <div className="live-map-compact">
                                            <div className="map-info-overlay">
                                                <div className="info-box"><span className="info-label">Distance</span><span className="info-value">{selectedCase.distance}</span></div>
                                                <div className="info-box">
                                                    <span className="info-label">ETA</span>
                                                    <span className="info-value">
                                                        {liveSession?.status === 'on_the_way' || !liveSession ? `${((parseFloat(selectedCase.distance) / 20) * 60).toFixed(0)} mins` : 'Arrived'}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="map-placeholder-mini">
                                                <span>🗺️</span>
                                                <p>Volunteer: {volunteerLoc.lat.toFixed(4)}, {volunteerLoc.lng.toFixed(4)}</p>
                                                <p>Rescue: {selectedCase.coords.lat.toFixed(4)}, {selectedCase.coords.lng.toFixed(4)}</p>
                                            </div>
                                        </div>
                                        <div className="session-controls">
                                            <a href={`https://www.google.com/maps?q=${selectedCase.coords.lat},${selectedCase.coords.lng}`} target="_blank" rel="noopener noreferrer" className="session-btn navigate">🧭 Navigation</a>
                                            {(!liveSession || liveSession.status === 'on_the_way') && (
                                                <button className="session-btn reached" onClick={() => handleSessionStatus('reached')}>🚩 Reached</button>
                                            )}
                                            {liveSession?.status === 'reached' && (
                                                <button className="session-btn complete" onClick={() => handleSessionStatus('completed')}>✅ Handled</button>
                                            )}
                                        </div>
                                    </div>

                                    <div className="chat-section">
                                        <div className="chat-header"><h3>💬 Rescue Coordination Chat</h3></div>
                                        <div className="chat-messages">
                                            {messages.length === 0 && <p className="empty-chat">Coordinate here.</p>}
                                            {messages.map(m => (
                                                <div key={m.id} className={`chat-message ${m.senderId === user.uid ? 'sent' : 'received'}`}>
                                                    <span className="sender-name">{m.senderId === user.uid ? 'You' : 'User'}</span>
                                                    <p className="msg-text">{m.message}</p>
                                                </div>
                                            ))}
                                        </div>
                                        <form className="chat-input-row" onSubmit={handleSendMessage}>
                                            <input type="text" placeholder="Type..." value={newMessage} onChange={(e) => setNewMessage(e.target.value)} />
                                            <button type="submit">Send</button>
                                        </form>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'recovery' && <div className="main-panel" style={{ padding: 0, flex: 1 }}><RecoveryTracker /></div>}
                    {activeTab === 'completed' && (
                        <div className="main-panel">
                            <div className="panel-header"><h2>✅ Completed Rescues</h2></div>
                            <div className="completed-list">
                                {COMPLETED.map(r => (
                                    <div key={r.id} className="completed-item">
                                        <span className="completed-icon">{r.animal}</span>
                                        <div className="completed-info"><p className="completed-title">{r.title}</p><p className="completed-meta">{r.date}</p></div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                    {activeTab === 'profile' && (
                        <div className="main-panel">
                            <div className="panel-header"><h2>👤 My Profile</h2></div>
                            <div className="profile-card">
                                <div className="profile-avatar-lg">🧑‍🚒</div>
                                <h3>{user.name}</h3><p className="profile-city">📍 {user.location}</p>
                                <div className="profile-stats">
                                    <div className="pstat"><strong>{user.totalRescues || 0}</strong><small>Rescues</small></div>
                                    <div className="pstat"><strong>{user.rating || 5.0}</strong><small>Rating</small></div>
                                </div>
                            </div>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}
