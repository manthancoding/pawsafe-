import { useState, useEffect } from 'react';

export default function AdminVolunteers() {
    const [volunteers, setVolunteers] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchVolunteers = async () => {
        try {
            const token = localStorage.getItem('pawsafe_token');
            const res = await fetch('http://localhost:5000/api/volunteers', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.success) {
                setVolunteers(data.data);
            }
        } catch (err) {
            console.error('Failed to fetch volunteers', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchVolunteers();
    }, []);

    const toggleStatus = async (id, currentStatus) => {
        try {
            const token = localStorage.getItem('pawsafe_token');
            const res = await fetch(`http://localhost:5000/api/volunteers/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ isActive: !currentStatus })
            });
            const result = await res.json();
            if (result.success) {
                fetchVolunteers();
            }
        } catch (err) {
            alert('Failed to update volunteer status');
        }
    };

    return (
        <div className="admin-volunteers-page">
            <div className="admin-table-header">
                <h2>Volunteer Management</h2>
            </div>

            <div className="admin-table-wrapper">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Volunteer</th>
                            <th>Contact</th>
                            <th>Experience</th>
                            <th>Tasks Today</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan="6" className="table-loader">Loading volunteers...</td></tr>
                        ) : volunteers.length === 0 ? (
                            <tr><td colSpan="6" className="table-empty">No volunteers found</td></tr>
                        ) : (
                            volunteers.map((v) => (
                                <tr key={v._id}>
                                    <td><strong>{v.name}</strong></td>
                                    <td>
                                        <p style={{ fontSize: '0.85rem' }}>{v.email}</p>
                                        <p style={{ fontSize: '0.85rem' }}>{v.phone}</p>
                                    </td>
                                    <td>{v.experience ? `${v.experience} years` : 'Newbie'}</td>
                                    <td>{v.assignedTasks?.length || 0} tasks</td>
                                    <td>
                                        <span className={`status-badge ${v.isActive ? 'released' : 'critical'}`}>
                                            {v.isActive ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                    <td>
                                        <button
                                            className="btn-icon-table edit"
                                            onClick={() => toggleStatus(v._id, v.isActive)}
                                            title={v.isActive ? "Deactivate" : "Activate"}
                                        >
                                            {v.isActive ? '⏸️' : '▶️'}
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
