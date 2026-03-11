import { useState, useEffect } from 'react';
import { Routes, Route, NavLink, useNavigate, Navigate } from 'react-router-dom';
import './UserDashboard.css';

export default function UserDashboard({ user, onLogout }) {
    const navigate = useNavigate();
    const [stats, setStats] = useState({
        adoptions: 0,
        reports: 0,
        favorites: 0,
        donations: 0
    });

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
                    </NavLink>
                    <NavLink to="/dashboard/reports" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
                        <span className="icon">🚨</span> My Reports
                    </NavLink>
                    <NavLink to="/dashboard/favorites" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
                        <span className="icon">❤️</span> Favorites
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
                </nav>

                <div className="sidebar-footer">
                    <button onClick={onLogout} className="nav-item logout">
                        <span className="icon">🚪</span> Logout
                    </button>
                </div>
            </aside>

            <main className="dashboard-content">
                <Routes>
                    <Route index element={<ProfileSection user={user} />} />
                    <Route path="adoptions" element={<AdoptionsSection />} />
                    <Route path="reports" element={<ReportsSection />} />
                    <Route path="favorites" element={<FavoritesSection />} />
                    <Route path="donations" element={<DonationsSection />} />
                    <Route path="volunteer" element={<VolunteerSection />} />
                    <Route path="settings" element={<SettingsSection />} />
                </Routes>
            </main>
        </div>
    );
}

// ── Sub-components ──

function ProfileSection({ user }) {
    return (
        <div className="dashboard-section profile-section">
            <header className="section-header">
                <h2>My Profile</h2>
                <p>Manage your account information and preferences</p>
            </header>

            <div className="profile-grid">
                <div className="profile-card basic-info">
                    <h3>Basic Information</h3>
                    <div className="info-group">
                        <label>Full Name</label>
                        <p>{user.name}</p>
                    </div>
                    <div className="info-group">
                        <label>Email Address</label>
                        <p>{user.email}</p>
                    </div>
                    <div className="info-group">
                        <label>Phone Number</label>
                        <p>{user.phone || 'Not provided'}</p>
                    </div>
                    <div className="info-group">
                        <label>City / Location</label>
                        <p>{user.city || 'Not provided'}</p>
                    </div>
                    <button className="btn-edit">Edit Profile</button>
                </div>

                <div className="profile-card account-stats">
                    <h3>Activity Overview</h3>
                    <div className="stats-grid">
                        <div className="stat-item">
                            <span className="stat-value">0</span>
                            <span className="stat-label">Adoptions</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-value">0</span>
                            <span className="stat-label">Reports</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-value">0</span>
                            <span className="stat-label">Donations</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function AdoptionsSection() {
    return (
        <div className="dashboard-section">
            <header className="section-header">
                <h2>Adoption Requests</h2>
                <p>Track the status of your pet adoption applications</p>
            </header>
            <div className="empty-state">
                <span className="empty-icon">🐾</span>
                <p>You haven't submitted any adoption requests yet.</p>
                <button className="btn-primary" onClick={() => window.location.href = '/'}>Browse Animals</button>
            </div>
        </div>
    );
}

function ReportsSection() {
    return (
        <div className="dashboard-section">
            <header className="section-header">
                <h2>My Rescue Reports</h2>
                <p>View and manage the animal emergencies you've reported</p>
            </header>
            <div className="empty-state">
                <span className="empty-icon">🚨</span>
                <p>No rescue reports found.</p>
                <button className="btn-primary" onClick={() => window.location.href = '/report'}>Report Emergency</button>
            </div>
        </div>
    );
}

function FavoritesSection() {
    return (
        <div className="dashboard-section">
            <header className="section-header">
                <h2>Favorite Animals</h2>
                <p>Animals you've bookmarked for adoption or support</p>
            </header>
            <div className="empty-state">
                <span className="empty-icon">❤️</span>
                <p>Your favorites list is empty.</p>
            </div>
        </div>
    );
}

function DonationsSection() {
    return (
        <div className="dashboard-section">
            <header className="section-header">
                <h2>Donation History</h2>
                <p>Your contributions to animal welfare</p>
            </header>
            <div className="empty-state">
                <span className="empty-icon">💸</span>
                <p>No donation history found.</p>
            </div>
        </div>
    );
}

function VolunteerSection() {
    return (
        <div className="dashboard-section">
            <header className="section-header">
                <h2>Volunteer Applications</h2>
                <p>Manage your applications to help animals in need</p>
            </header>
            <div className="empty-state">
                <span className="empty-icon">🙋</span>
                <p>You haven't applied to volunteer yet.</p>
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
                        <h4>Email Verification</h4>
                        <p>Verified: <strong>Yes</strong></p>
                    </div>
                </div>
            </div>
        </div>
    );
}
