import { useState, useEffect } from 'react';
import { Routes, Route, NavLink, useNavigate, Navigate } from 'react-router-dom';
import RecoveryTracker from '../RecoveryTracker';
import RescueProgressMap from '../RescueProgressMap';
import { db } from '../../firebase';
import { doc, onSnapshot } from 'firebase/firestore';
import { emergencyApi } from '../../utils/api';
import './UserDashboard.css';

export default function UserDashboard({ user, onLogout, onUpdateUser }) {
    const navigate = useNavigate();
    const [stats, setStats] = useState({
        adoptions: 0,
        reports: 0,
        favorites: 0,
        donations: 0
    });
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState({
        adoptions: [],
        reports: [],
        favorites: [],
        donations: [],
        volunteer: null,
        cases: [],
        acceptedCases: []
    });
    const [trackingReport, setTrackingReport] = useState(null);

    useEffect(() => {
        if (!user) return;

        const fetchData = async () => {
            setLoading(true);
            const token = localStorage.getItem('pawsafe_token');
            const headers = { 'Authorization': `Bearer ${token}` };

            try {
                const safeFetch = async (url, options) => {
                    try {
                        const res = await fetch(url, options);
                        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
                        return await res.json();
                    } catch (e) {
                        console.warn(`Fetch failed for ${url}:`, e);
                        return { success: false, data: [] };
                    }
                };

                const [adoptionsRes, reportsRes, favoritesRes, donationsRes, volunteerRes, casesRes] = await Promise.all([
                    safeFetch('/api/users/me/adoptions', { headers }),
                    safeFetch('/api/users/me/reports', { headers }),
                    safeFetch('/api/users/me/favorites', { headers }),
                    safeFetch('/api/users/me/donations', { headers }),
                    safeFetch('/api/users/me/volunteer', { headers }),
                    emergencyApi.getAll().catch(() => [])
                ]);

                const volunteerData = (volunteerRes.success && Array.isArray(volunteerRes.data)) ? volunteerRes.data[0] : null;
                let mappedCases = [];
                if (volunteerData?.isActive) {
                    mappedCases = (casesRes || []).map(e => ({
                        id: e._id,
                        animal: { dog: '🐶', cat: '🐱', bird: '🦅', rabbit: '🐰', other: '🦁' }[e.animalType] || '🐾',
                        type: e.animalType.charAt(0).toUpperCase() + e.animalType.slice(1),
                        status: e.status,
                        title: `${e.issueType.charAt(0).toUpperCase() + e.issueType.slice(1)} ${e.animalType} – ${e.location || 'Unknown location'}`,
                        location: e.location || 'Location not provided',
                        distance: 'Calculating...',
                        time: new Date(e.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
                        urgency: e.urgency,
                        reporter: e.name,
                        description: e.details,
                        coords: { lat: e.latitude || 0, lng: e.longitude || 0 },
                    }));
                }

                const newData = {
                    adoptions: adoptionsRes.success ? adoptionsRes.data : [],
                    reports: reportsRes.success ? reportsRes.data : [],
                    favorites: favoritesRes.success ? favoritesRes.data : [],
                    donations: donationsRes.success ? donationsRes.data : [],
                    volunteer: volunteerData,
                    cases: mappedCases,
                    acceptedCases: mappedCases.filter(c => c.status === 'accepted')
                };

                setData(newData);
                setStats({
                    adoptions: newData.adoptions.length,
                    reports: newData.reports.length,
                    favorites: newData.favorites.length,
                    donations: newData.donations.length
                });
            } catch (err) {
                console.error('Error fetching dashboard data:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [user]);

    const handleAcceptRescue = async (c) => {
        try {
            await emergencyApi.updateStatus(c.id, 'accepted');
            setData(prev => ({
                ...prev,
                cases: prev.cases.map(x => x.id === c.id ? { ...x, status: 'accepted' } : x),
                acceptedCases: [...prev.acceptedCases, { ...c, status: 'accepted' }]
            }));
        } catch (err) {
            console.error('Error accepting rescue:', err);
        }
    };

    const handleDeclineRescue = async (id) => {
        try {
            await emergencyApi.updateStatus(id, 'declined');
            setData(prev => ({
                ...prev,
                cases: prev.cases.map(x => x.id === id ? { ...x, status: 'declined' } : x),
            }));
        } catch (err) {
            console.error('Error declining rescue:', err);
        }
    };

    if (!user) return <Navigate to="/login" replace />;

    return (
        <div className="user-dashboard">
            <aside className="dashboard-sidebar">
                <div className="sidebar-header">
                    <div className="user-profile-brief">
                        <div className="avatar-mini">
                            {user.avatar ? <img src={user.avatar} alt={user.name} /> : (user.name?.[0] || 'U').toUpperCase()}
                        </div>
                        <div className="user-info">
                            <h3>{user.name}</h3>
                            <p>{user.email}</p>
                        </div>
                    </div>
                </div>

                <nav className="sidebar-nav">
                    <NavLink to="/dashboard" end className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
                        <span className="icon">👤</span> My Profile
                    </NavLink>
                    <NavLink to="/dashboard/adoptions" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
                        <span className="icon">🏡</span> Adoptions
                        {stats.adoptions > 0 && <span className="nav-badge">{stats.adoptions}</span>}
                    </NavLink>
                    <NavLink to="/dashboard/reports" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
                        <span className="icon">🚨</span> My Reports
                        {stats.reports > 0 && <span className="nav-badge">{stats.reports}</span>}
                    </NavLink>
                    <NavLink to="/dashboard/favorites" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
                        <span className="icon">❤️</span> Favorites
                        {stats.favorites > 0 && <span className="nav-badge">{stats.favorites}</span>}
                    </NavLink>
                    <NavLink to="/dashboard/donations" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
                        <span className="icon">💸</span> Donations
                    </NavLink>
                    <NavLink to="/dashboard/volunteer" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
                        <span className="icon">🙋</span> Volunteer
                    </NavLink>
                    <NavLink to="/dashboard/settings" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
                        <span className="icon">⚙️</span> Settings
                    </NavLink>

                    {data.volunteer?.isActive && (
                        <>
                            <div className="nav-divider">Rescuer Panel</div>
                            <NavLink to="/dashboard/active-cases" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
                                <span className="icon">🚨</span> My Active Cases
                                {data.acceptedCases.length > 0 && <span className="nav-badge">{data.acceptedCases.length}</span>}
                            </NavLink>
                            <NavLink to="/dashboard/alerts" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
                                <span className="icon">🔔</span> Nearby Alerts
                                {data.cases.filter(c => c.status === 'active').length > 0 &&
                                    <span className="nav-badge">{data.cases.filter(c => c.status === 'active').length}</span>}
                            </NavLink>
                            <NavLink to="/dashboard/recovery-tracker" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
                                <span className="icon">🐾</span> Recovery Tracker
                            </NavLink>
                            <NavLink to="/dashboard/completed-rescues" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
                                <span className="icon">✅</span> Completed Rescues
                            </NavLink>
                        </>
                    )}
                </nav>

                <div className="sidebar-footer">
                    <button onClick={onLogout} className="nav-item logout">
                        <span className="icon">🚪</span> Logout
                    </button>
                </div>
            </aside>

            <main className="dashboard-content">
                {loading ? (
                    <div className="dashboard-loading">
                        <div className="spinner"></div>
                        <p>Loading your dashboard...</p>
                    </div>
                ) : (
                    <Routes>
                        <Route index element={<ProfileSection user={user} stats={stats} volunteer={data.volunteer} onUpdateUser={onUpdateUser} />} />
                        <Route path="adoptions" element={<AdoptionsSection adoptions={data.adoptions} />} />
                        <Route path="reports" element={<ReportsSection reports={data.reports} onTrack={setTrackingReport} />} />
                        <Route path="favorites" element={<FavoritesSection favorites={data.favorites} />} />
                        <Route path="donations" element={<DonationsSection donations={data.donations} />} />
                        <Route path="volunteer" element={<VolunteerSection volunteer={data.volunteer} />} />
                        <Route path="settings" element={<SettingsSection />} />

                        {/* Volunteer Specific Routes */}
                        {data.volunteer?.isActive && (
                            <>
                                <Route path="active-cases" element={<ActiveCasesSection cases={data.acceptedCases} />} />
                                <Route path="alerts" element={<NearbyAlertsSection cases={data.cases} onAccept={handleAcceptRescue} onDecline={handleDeclineRescue} />} />
                                <Route path="recovery-tracker" element={<div className="recovery-tracker-container"><RecoveryTracker /></div>} />
                                <Route path="completed-rescues" element={<CompletedRescuesSection />} />
                            </>
                        )}
                    </Routes>
                )}
            </main>

            {trackingReport && (
                <RescueTrackingModal
                    report={trackingReport}
                    onClose={() => setTrackingReport(null)}
                />
            )}
        </div>
    );
}

// ── Sub-components ──

function ProfileSection({ user, stats, volunteer, onUpdateUser }) {
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: user.name || '',
        phone: user.phone || '',
        city: user.city || user.location || ''
    });
    const [isSaving, setIsSaving] = useState(false);

    const handleEdit = () => {
        setFormData({
            name: user.name || '',
            phone: user.phone || '',
            city: user.city || user.location || ''
        });
        setIsEditing(true);
    };

    const handleCancel = () => {
        setIsEditing(false);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const token = localStorage.getItem('pawsafe_token');
            const res = await fetch('/api/users/me/profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });
            const result = await res.json();
            if (result.success) {
                if (onUpdateUser) onUpdateUser(result.data);
                setIsEditing(false);
            } else {
                alert(result.message || 'Failed to update profile');
            }
        } catch (err) {
            console.error('Error updating profile:', err);
            alert('Failed to update profile. Please try again.');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="dashboard-section profile-section">
            <header className="section-header">
                <h2>My Profile</h2>
                <p>Manage your account information and preferences</p>
            </header>

            <div className="profile-grid">
                <div className="profile-card basic-info">
                    <div className="card-title-group">
                        <h3><span className="icon">📋</span> Basic Information</h3>
                        {!isEditing ? (
                            <button className="btn-edit-inline" onClick={handleEdit}>Edit</button>
                        ) : (
                            <div className="edit-actions">
                                <button className="btn-cancel" onClick={handleCancel} disabled={isSaving}>Cancel</button>
                                <button className="btn-save" onClick={handleSave} disabled={isSaving}>
                                    {isSaving ? 'Saving...' : 'Save Changes'}
                                </button>
                            </div>
                        )}
                    </div>
                    <div className="info-list">
                        <div className="info-group">
                            <label>Full Name</label>
                            {isEditing ? (
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="edit-input"
                                    placeholder="Enter your full name"
                                />
                            ) : (
                                <p>{user.name}</p>
                            )}
                        </div>
                        <div className="info-group">
                            <label>Email Address</label>
                            <p className="field-disabled">{user.email}</p>
                            {isEditing && <span className="field-note">Email cannot be changed</span>}
                        </div>
                        <div className="info-group">
                            <label>Phone Number</label>
                            {isEditing ? (
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    className="edit-input"
                                    placeholder="Enter phone number"
                                />
                            ) : (
                                <p>{user.phone || 'Not provided'}</p>
                            )}
                        </div>
                        <div className="info-group">
                            <label>City / Location</label>
                            {isEditing ? (
                                <input
                                    type="text"
                                    name="city"
                                    value={formData.city}
                                    onChange={handleChange}
                                    className="edit-input"
                                    placeholder="Enter city or location"
                                />
                            ) : (
                                <p>{user.city || user.location || 'Not provided'}</p>
                            )}
                        </div>
                    </div>
                </div>

                <div className="profile-card account-stats">
                    <h3><span className="icon">📈</span> Activity Overview</h3>
                    <div className="stats-list">
                        {volunteer?.isActive && (
                            <div className="stat-card rescuer-stat">
                                <div className="stat-icon-wrap adoptions">🦸</div>
                                <div className="stat-info">
                                    <span className="stat-value">{volunteer.totalRescues || 0}</span>
                                    <span className="stat-label">Total Rescues</span>
                                </div>
                            </div>
                        )}
                        <div className="stat-card">
                            <div className="stat-icon-wrap adoptions">🏡</div>
                            <div className="stat-info">
                                <span className="stat-value">{stats.adoptions}</span>
                                <span className="stat-label">Adoptions</span>
                            </div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-icon-wrap reports">🚨</div>
                            <div className="stat-info">
                                <span className="stat-value">{stats.reports}</span>
                                <span className="stat-label">Reports</span>
                            </div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-icon-wrap donations">💸</div>
                            <div className="stat-info">
                                <span className="stat-value">{stats.donations}</span>
                                <span className="stat-label">Donations</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// ── Rescuer Sections ──

const URGENCY_META = {
    critical: { color: '#e53935', label: '🔴 Critical' },
    urgent: { color: '#f57c00', label: '🟠 Urgent' },
    moderate: { color: '#0d7377', label: '🟢 Moderate' },
};

function CaseCard({ c, onSelect, isSelected }) {
    const u = URGENCY_META[c.urgency] || URGENCY_META.moderate;
    return (
        <div
            className={`data-card case-card ${isSelected ? 'selected' : ''} ${c.urgency}`}
            onClick={() => onSelect(c)}
        >
            <div className="card-badge" style={{ background: u.color, color: 'white' }}>{u.label}</div>
            <div className="card-main">
                <span className="card-emoji" style={{ fontSize: '2rem', display: 'block', marginBottom: '10px' }}>{c.animal}</span>
                <h4>{c.title}</h4>
                <p className="card-meta">📍 {c.location}</p>
                <p className="card-meta">🕐 {c.time}</p>
            </div>
            <div className="card-footer" style={{ marginTop: '15px', paddingTop: '10px', borderTop: '1px solid #eee' }}>
                <span className={`status-tag status-${c.status}`} style={{ fontWeight: 'bold', textTransform: 'uppercase', fontSize: '0.8rem' }}>{c.status}</span>
            </div>
        </div>
    );
}

function ActiveCasesSection({ cases }) {
    const [selectedCase, setSelectedCase] = useState(null);

    return (
        <div className="dashboard-section">
            <header className="section-header">
                <h2>🚨 My Active Cases</h2>
                <p>Manage rescues you have currently accepted.</p>
            </header>
            {cases.length === 0 ? (
                <div className="empty-state">
                    <span className="empty-icon">📭</span>
                    <p>No active cases yet. Accept a rescue from Nearby Alerts.</p>
                </div>
            ) : (
                <div className="cases-split-view">
                    <div className="data-grid cases-list">
                        {cases.map(c => (
                            <CaseCard key={c.id} c={c} onSelect={setSelectedCase} isSelected={selectedCase?.id === c.id} />
                        ))}
                    </div>
                    {selectedCase && (
                        <div className="case-details-panel">
                            <h3>Case Details</h3>
                            <div className="detail-row"><strong>Animal:</strong> {selectedCase.animal} {selectedCase.type}</div>
                            <div className="detail-row"><strong>Location:</strong> {selectedCase.location}</div>
                            <div className="detail-row"><strong>Reporter:</strong> {selectedCase.reporter}</div>
                            <p className="detail-desc" style={{ margin: '15px 0', padding: '15px', background: '#f9f9f9', borderRadius: '10px' }}>{selectedCase.description}</p>
                            <a
                                href={`https://maps.google.com/?q=${selectedCase.coords.lat},${selectedCase.coords.lng}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn-primary btn-navigate"
                                style={{ display: 'inline-block', textDecoration: 'none', textAlign: 'center' }}
                            >
                                🧭 Navigate to Location
                            </a>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

function NearbyAlertsSection({ cases, onAccept, onDecline }) {
    const [selectedCase, setSelectedCase] = useState(null);
    const activeAlerts = cases.filter(c => c.status === 'active');

    const handleAction = async (id, status, c) => {
        if (status === 'accepted') {
            await onAccept(c);
        } else {
            await onDecline(id);
        }
        setSelectedCase(null);
    };

    return (
        <div className="dashboard-section">
            <header className="section-header">
                <h2>🔔 Nearby Alerts</h2>
                <p>Live emergencies in your area that need help.</p>
            </header>

            {activeAlerts.length === 0 ? (
                <div className="empty-state">
                    <span className="empty-icon">✨</span>
                    <p>All quiet! No active emergencies nearby at the moment.</p>
                </div>
            ) : (
                <div className="cases-split-view">
                    <div className="data-grid alerts-list">
                        {activeAlerts.map(c => (
                            <CaseCard key={c.id} c={c} onSelect={setSelectedCase} isSelected={selectedCase?.id === c.id} />
                        ))}
                    </div>
                    {selectedCase && selectedCase.status === 'active' && (
                        <div className="case-details-panel">
                            <h3>Rescue Call</h3>
                            <div className="detail-row"><strong>Animal:</strong> {selectedCase.animal} {selectedCase.type}</div>
                            <div className="detail-row"><strong>Location:</strong> {selectedCase.location}</div>
                            <div className="detail-row"><strong>Urgency:</strong> {selectedCase.urgency}</div>
                            <p className="detail-desc" style={{ margin: '15px 0', padding: '15px', background: '#f9f9f9', borderRadius: '10px' }}>{selectedCase.description}</p>

                            <div className="case-actions-inline" style={{ display: 'flex', gap: '10px' }}>
                                <button className="btn-secondary" style={{ flex: 1, borderColor: '#ff8a8a', color: '#ff5c5c' }} onClick={() => handleAction(selectedCase.id, 'declined')}>✗ Decline</button>
                                <button className="btn-primary" style={{ flex: 1 }} onClick={() => handleAction(selectedCase.id, 'accepted', selectedCase)}>✔ Accept Rescue</button>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

function CompletedRescuesSection() {
    const completed = [
        { id: 101, animal: '🐶', title: 'Street dog rescue – Dadar', date: '01 Mar 2026', outcome: 'Treated & Released' },
        { id: 102, animal: '🐄', title: 'Cow leg injury – Malad', date: '28 Feb 2026', outcome: 'Handed to NGO' },
        { id: 103, animal: '🐒', title: 'Baby monkey – Goregaon', date: '25 Feb 2026', outcome: 'Wildlife Centre' },
    ];

    return (
        <div className="dashboard-section">
            <header className="section-header">
                <h2>✅ Completed Rescues</h2>
                <p>Your history of helping animals in need.</p>
            </header>
            <div className="table-responsive">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Animal</th>
                            <th>Incident</th>
                            <th>Date</th>
                            <th>Outcome</th>
                        </tr>
                    </thead>
                    <tbody>
                        {completed.map(r => (
                            <tr key={r.id}>
                                <td style={{ fontSize: '1.5rem' }}>{r.animal}</td>
                                <td>{r.title}</td>
                                <td>{r.date}</td>
                                <td><span className="card-badge" data-status="approved">{r.outcome}</span></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

function AdoptionsSection({ adoptions }) {
    const navigate = useNavigate();
    if (adoptions.length === 0) {
        return (
            <div className="dashboard-section">
                <header className="section-header">
                    <h2>Adoption Requests</h2>
                    <p>Track the status of your pet adoption applications</p>
                </header>
                <div className="empty-state">
                    <span className="empty-icon">🐾</span>
                    <p>You haven't submitted any adoption requests yet.</p>
                    <button className="btn-primary" onClick={() => navigate('/animals')}>Browse Animals</button>
                </div>
            </div>
        );
    }

    return (
        <div className="dashboard-section">
            <header className="section-header">
                <h2>Adoption Requests</h2>
                <p>Track the status of your pet adoption applications</p>
            </header>
            <div className="data-grid adoptions-list">
                {adoptions.map(req => (
                    <div key={req.id} className="data-card adoption-card">
                        <div className="card-badge" data-status={req.status}>{req.status}</div>
                        <div className="card-main">
                            <h4>{req.animalName || 'Unknown Animal'}</h4>
                            <p className="card-meta">Submitted on: {req.createdAt ? new Date(req.createdAt).toLocaleDateString() : 'Pending'}</p>
                        </div>
                        <div className="card-actions">
                            <button className="btn-text">View Details</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

function ReportsSection({ reports, onTrack }) {
    const navigate = useNavigate();
    if (reports.length === 0) {
        return (
            <div className="dashboard-section">
                <header className="section-header">
                    <h2>My Rescue Reports</h2>
                    <p>View and manage the animal emergencies you've reported</p>
                </header>
                <div className="empty-state">
                    <span className="empty-icon">🚨</span>
                    <p>No rescue reports found.</p>
                    <button className="btn-primary" onClick={() => navigate('/report')}>Report Emergency</button>
                </div>
            </div>
        );
    }

    return (
        <div className="dashboard-section">
            <header className="section-header">
                <h2>My Rescue Reports</h2>
                <p>View and manage the animal emergencies you've reported</p>
            </header>
            <div className="data-grid reports-list">
                {reports.map(report => (
                    <div key={report.id} className="data-card report-card">
                        <div className="card-img">
                            {report.photoUrl ? <img src={report.photoUrl} alt="Report" /> : <div className="img-placeholder">🐾</div>}
                        </div>
                        <div className="card-content">
                            <div className="card-badge" data-status={report.status}>{report.status}</div>
                            <h4>{report.animalType} - {report.issueType}</h4>
                            <p className="card-location">📍 {report.location || 'Unknown Location'}</p>
                            <p className="card-meta">{new Date(report.createdAt?.seconds * 1000).toLocaleDateString()}</p>
                        </div>
                        <div className="card-actions">
                            <button className="btn-text" onClick={() => onTrack(report)}>Track Progress</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

function FavoritesSection({ favorites }) {
    const navigate = useNavigate();
    if (favorites.length === 0) {
        return (
            <div className="dashboard-section">
                <header className="section-header">
                    <h2>Favorite Animals</h2>
                    <p>Animals you've bookmarked for adoption or support</p>
                </header>
                <div className="empty-state">
                    <span className="empty-icon">❤️</span>
                    <p>Your favorites list is empty.</p>
                    <button className="btn-primary" onClick={() => navigate('/animals')}>Find Animals</button>
                </div>
            </div>
        );
    }

    return (
        <div className="dashboard-section">
            <header className="section-header">
                <h2>Favorite Animals</h2>
                <p>Animals you've bookmarked for adoption or support</p>
            </header>
            <div className="data-grid favorites-grid">
                {favorites.map(animal => (
                    <div key={animal.id} className="animal-stat-card">
                        <div className="animal-img">
                            {animal.photoUrl ? <img src={animal.photoUrl} alt={animal.name} /> : <div className="img-placeholder">🐕</div>}
                        </div>
                        <div className="animal-info">
                            <h4>{animal.name}</h4>
                            <p>{animal.breed} • {animal.age}</p>
                            <div className="animal-tags">
                                <span className="tag">{animal.status}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

function DonationsSection({ donations }) {
    const navigate = useNavigate();
    if (donations.length === 0) {
        return (
            <div className="dashboard-section">
                <header className="section-header">
                    <h2>Donation History</h2>
                    <p>Your contributions to animal welfare</p>
                </header>
                <div className="empty-state">
                    <span className="empty-icon">💸</span>
                    <p>No donation history found.</p>
                    <button className="btn-primary" onClick={() => navigate('/donate')}>Make a Donation</button>
                </div>
            </div>
        );
    }

    return (
        <div className="dashboard-section">
            <header className="section-header">
                <h2>Donation History</h2>
                <p>Your contributions to animal welfare</p>
            </header>
            <div className="table-responsive">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Amount</th>
                            <th>Purpose</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {donations.map(donation => (
                            <tr key={donation.id}>
                                <td>{donation.createdAt ? new Date(donation.createdAt).toLocaleString('en-IN', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'Pending'}</td>
                                <td className="amount">₹{donation.amount}</td>
                                <td>{donation.cause || donation.purpose || 'General Support'}</td>
                                <td><span className="status-dot success"></span> Completed</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

function VolunteerSection({ volunteer }) {
    const navigate = useNavigate();
    if (!volunteer) {
        return (
            <div className="dashboard-section">
                <header className="section-header">
                    <h2>Volunteer Status</h2>
                    <p>Manage your applications to help animals in need</p>
                </header>
                <div className="empty-state">
                    <span className="empty-icon">🙋</span>
                    <p>You haven't applied to volunteer yet.</p>
                    <button className="btn-primary" onClick={() => navigate('/become-volunteer')}>Become a Volunteer</button>
                </div>
            </div>
        );
    }

    return (
        <div className="dashboard-section">
            <header className="section-header">
                <h2>Volunteer Status</h2>
                <p>Manage your applications to help animals in need</p>
            </header>
            <div className="volunteer-status-card">
                <div className="status-header">
                    <div className="status-label">Current Status</div>
                    <div className="status-value active">{volunteer.isActive ? 'Active Member' : 'Under Review'}</div>
                </div>
                <div className="volunteer-stats">
                    <div className="v-stat">
                        <span className="v-label">Total Rescues</span>
                        <span className="v-value">{volunteer.totalRescues || 0}</span>
                    </div>
                    <div className="v-stat">
                        <span className="v-label">Member Since</span>
                        <span className="v-value">{new Date(volunteer.createdAt?.seconds * 1000).toLocaleDateString()}</span>
                    </div>
                </div>
                <div className="v-badge-section">
                    <h4>Earned Badges</h4>
                    <div className="badge-list">
                        <span className="v-badge">🎖️ Lifesaver</span>
                        <span className="v-badge">🐾 Paw Guardian</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

function SettingsSection() {
    return (
        <div className="dashboard-section">
            <header className="section-header">
                <h2>Account Settings</h2>
                <p>Security and notification preferences</p>
            </header>
            <div className="settings-card">
                <h3>Security</h3>
                <div className="setting-item">
                    <div className="setting-info">
                        <h4>Change Password</h4>
                        <p>Ensure your account is using a long, random password to stay secure.</p>
                    </div>
                    <button className="btn-secondary">Update Password</button>
                </div>
                <div className="setting-item">
                    <div className="setting-info">
                        <h4>Two-Factor Authentication</h4>
                        <p>Secure your account with 2FA verification codes.</p>
                    </div>
                    <button className="btn-secondary">Configure</button>
                </div>
                <div className="setting-item">
                    <div className="setting-info">
                        <h4>Email Verification</h4>
                        <p>Verified: <strong>Yes</strong></p>
                    </div>
                </div>
            </div>
        </div>
    );
}

function RescueTrackingModal({ report, onClose }) {
    const [volunteerLoc, setVolunteerLoc] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!report.acceptedBy) {
            setLoading(false);
            return;
        }

        // Listen to volunteer's live location
        const unsub = onSnapshot(doc(db, 'volunteers', report.acceptedBy), (docSnap) => {
            if (docSnap.exists()) {
                const data = docSnap.data();
                if (data.latitude && data.longitude) {
                    setVolunteerLoc({ lat: data.latitude, lng: data.longitude });
                }
            }
            setLoading(false);
        }, (err) => {
            console.error('Error tracking volunteer:', err);
            setLoading(false);
        });

        return () => unsub();
    }, [report.acceptedBy]);

    const rescueLoc = { lat: report.latitude, lng: report.longitude };

    return (
        <div className="vd-overlay" style={{ zIndex: 9000 }}>
            <div className="vd-shell" style={{ maxWidth: '600px', height: 'auto', maxHeight: '90vh', flexDirection: 'column' }}>
                <div className="panel-header" style={{ padding: '1.5rem', borderBottom: '1px solid #eee' }}>
                    <h2 style={{ fontSize: '1.2rem' }}>Rescue Tracking</h2>
                    <button className="vd-close-btn" style={{ marginTop: 0 }} onClick={onClose}>✕ Close</button>
                </div>

                <div style={{ padding: '1.5rem', flex: 1, overflowY: 'auto' }}>
                    <div className="detail-header" style={{ marginBottom: '1rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
                        <span className="detail-animal" style={{ fontSize: '2rem' }}>{report.animalType === 'dog' ? '🐶' : report.animalType === 'cat' ? '🐱' : '🐾'}</span>
                        <div>
                            <h3 style={{ fontSize: '1rem', margin: 0 }}>{report.animalType} - {report.issueType}</h3>
                            <p className="detail-meta" style={{ fontSize: '0.8rem', margin: '2px 0 0' }}>Status: <span style={{ color: '#0d7377', fontWeight: '700' }}>{report.status.toUpperCase()}</span></p>
                        </div>
                    </div>

                    {loading ? (
                        <div style={{ height: '350px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f7fafc', borderRadius: '12px' }}>
                            <div className="spinner"></div>
                        </div>
                    ) : (
                        <RescueProgressMap
                            volunteerLoc={volunteerLoc}
                            rescueLoc={rescueLoc}
                            height="350px"
                        />
                    )}

                    <div style={{ marginTop: '1.5rem', background: '#f7fafc', padding: '1.25rem', borderRadius: '12px', border: '1px solid #edf2f7' }}>
                        <p style={{ fontSize: '0.9rem', margin: 0, color: '#2d3748' }}>
                            <strong>Location:</strong> {report.location}
                        </p>
                        {report.status === 'accepted' ? (
                            <div style={{ marginTop: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <span style={{ fontSize: '1.2rem' }}>✨</span>
                                <p style={{ fontSize: '0.88rem', color: '#2c7a7b', margin: 0, fontWeight: '600' }}>
                                    A volunteer is on the way to help!
                                </p>
                            </div>
                        ) : (
                            <div style={{ marginTop: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <span style={{ fontSize: '1.2rem' }}>⏳</span>
                                <p style={{ fontSize: '0.88rem', color: '#718096', margin: 0 }}>
                                    Waiting for a nearby volunteer to accept this rescue request.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
