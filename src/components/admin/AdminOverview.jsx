import { useState, useEffect } from 'react';
import { statsApi } from '../../utils/api';

export default function AdminOverview() {
    const [stats, setStats] = useState({
        totalRescued: 0,
        pendingRescue: 0,
        adoptedCount: 0,
        totalDonations: 0,
        volunteerCount: 0,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const data = await statsApi.get();
                setStats(data);
            } catch (err) {
                console.error('Failed to fetch admin stats', err);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    const statItems = [
        { label: 'Total Rescued', value: stats.totalRescued, icon: '🐾', color: 'mint' },
        { label: 'Animals Adopted', value: stats.adoptedCount, icon: '🏡', color: 'orange' },
        { label: 'Pending Cases', value: stats.pendingRescue, icon: '🚨', color: 'red' },
        { label: 'Total Donations', value: `₹${stats.totalDonations.toLocaleString()}`, icon: '💰', color: 'green' },
        { label: 'Active Volunteers', value: stats.volunteerCount, icon: '🙋', color: 'blue' },
    ];

    if (loading) return <div className="loading-state">Loading dashboard stats...</div>;

    return (
        <div className="admin-overview">
            <div className="stats-grid">
                {statItems.map((item, i) => (
                    <div className="stat-card" key={i}>
                        <div className={`stat-icon ${item.color}`}>
                            {item.icon}
                        </div>
                        <div className="stat-info">
                            <h3>{item.label}</h3>
                            <p className="stat-value">{item.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="admin-welcome-card">
                <h2>Welcome back, Admin! 🐾</h2>
                <p>Everything looks great today. You have <b>{stats.pendingRescue}</b> pending rescue reports that need your attention.</p>
                <button className="btn-primary" style={{ marginTop: '1rem', width: 'auto' }}>
                    View Emergency Reports
                </button>
            </div>

            <style>{`
                .admin-welcome-card {
                    background: linear-gradient(135deg, var(--admin-green-primary), var(--admin-green-dark));
                    color: white;
                    padding: 2.5rem;
                    border-radius: 20px;
                    box-shadow: 0 10px 30px rgba(27, 67, 50, 0.15);
                }
                .admin-welcome-card h2 { color: white; margin-bottom: 0.5rem; }
                .admin-welcome-card p { opacity: 0.9; font-size: 1.1rem; }
                .stat-icon.mint { background-color: #d8f3dc; color: #2d6a4f; }
                .stat-icon.orange { background-color: #ffe8d6; color: #ff7043; }
                .stat-icon.red { background-color: #ffe5ec; color: #e53935; }
                .stat-icon.green { background-color: #e8f5e9; color: #1b5e20; }
                .stat-icon.blue { background-color: #e3f2fd; color: #1565c0; }
                .loading-state { padding: 4rem; text-align: center; font-weight: 600; color: #666; }
            `}</style>
        </div>
    );
}
