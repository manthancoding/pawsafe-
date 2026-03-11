import { useNavigate, NavLink } from 'react-router-dom';
import './AdminLayout.css';

const SIDEBAR_ITEMS = [
    { label: 'Dashboard', icon: '📊', path: '/admin' },
    { label: 'Animals', icon: '🐾', path: '/admin/animals' },
    { label: 'Adoptions', icon: '🏡', path: '/admin/adoptions' },
    { label: 'Rescue Reports', icon: '🚨', path: '/admin/reports' },
    { label: 'Volunteers', icon: '🙋', path: '/admin/volunteers' },
    { label: 'Donations', icon: '💰', path: '/admin/donations' },
    { label: 'Settings', icon: '⚙️', path: '/admin/settings' },
];

export default function AdminLayout({ children, onLogout, user }) {
    const navigate = useNavigate();

    const handleLogoutClick = () => {
        onLogout();
        navigate('/');
    };

    return (
        <div className="admin-layout">
            <aside className="admin-sidebar">
                <div className="admin-logo" onClick={() => navigate('/')}>
                    <span className="logo-icon">🐾</span>
                    <span className="logo-text">PawSafe Admin</span>
                </div>

                <nav className="admin-nav">
                    {SIDEBAR_ITEMS.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            end={item.path === '/admin'}
                            className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}
                        >
                            <span className="nav-icon">{item.icon}</span>
                            <span className="nav-label">{item.label}</span>
                        </NavLink>
                    ))}
                </nav>

                <div className="admin-sidebar-footer">
                    <div className="admin-user-info">
                        <div className="admin-avatar">{user?.name?.[0]?.toUpperCase() ?? 'A'}</div>
                        <div className="admin-details">
                            <p className="admin-name">{user?.name ?? 'Admin'}</p>
                            <p className="admin-role">Super Admin</p>
                        </div>
                    </div>
                    <button className="admin-logout-btn" onClick={handleLogoutClick}>
                        🚪 Logout
                    </button>
                </div>
            </aside>

            <main className="admin-main">
                <header className="admin-header">
                    <div className="header-info">
                        <h1>Admin Panel</h1>
                        <p>Managing the safety of our furry friends</p>
                    </div>
                    <div className="header-actions">
                        <button className="btn-circle" title="Notifications">🔔</button>
                        <button className="btn-circle" title="Help">❓</button>
                    </div>
                </header>
                <div className="admin-content-inner">
                    {children}
                </div>
            </main>
        </div>
    );
}
