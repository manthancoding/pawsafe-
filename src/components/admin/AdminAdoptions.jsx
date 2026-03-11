import { useState, useEffect } from 'react';

export default function AdminAdoptions() {
    const [adoptions, setAdoptions] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchAdoptions = async () => {
        try {
            const token = localStorage.getItem('pawsafe_token');
            const res = await fetch('http://localhost:5000/api/adoptions', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.success) {
                setAdoptions(data.data);
            }
        } catch (err) {
            console.error('Failed to fetch adoptions', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAdoptions();
    }, []);

    const handleStatusUpdate = async (id, status) => {
        try {
            const token = localStorage.getItem('pawsafe_token');
            const res = await fetch(`http://localhost:5000/api/adoptions/${id}/status`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ status })
            });
            const result = await res.json();
            if (result.success) {
                fetchAdoptions();
            }
        } catch (err) {
            alert('Failed to update status');
        }
    };

    return (
        <div className="admin-adoptions-page">
            <div className="admin-table-header">
                <h2>Adoption Requests</h2>
            </div>

            <div className="admin-table-wrapper">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Applicant</th>
                            <th>Animal</th>
                            <th>Contact</th>
                            <th>Status</th>
                            <th>Date</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan="6" className="table-loader">Loading requests...</td></tr>
                        ) : adoptions.length === 0 ? (
                            <tr><td colSpan="6" className="table-empty">No adoption requests found</td></tr>
                        ) : (
                            adoptions.map((req) => (
                                <tr key={req._id}>
                                    <td>
                                        <div className="applicant-cell">
                                            <p className="admin-name">{req.applicantName}</p>
                                            <p className="admin-role">{req.email}</p>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="animal-cell">
                                            <span className="animal-name-table">{req.animal?.name ?? 'N/A'}</span>
                                            <span className="animal-role">({req.animal?.species ?? 'unknown'})</span>
                                        </div>
                                    </td>
                                    <td>{req.phone}</td>
                                    <td>
                                        <span className={`status-badge ${req.status}`}>
                                            {req.status}
                                        </span>
                                    </td>
                                    <td>{new Date(req.createdAt).toLocaleDateString()}</td>
                                    <td>
                                        <div className="table-actions">
                                            {req.status === 'pending' && (
                                                <>
                                                    <button
                                                        className="btn-icon-table edit"
                                                        title="Approve"
                                                        onClick={() => handleStatusUpdate(req._id, 'approved')}
                                                    >
                                                        ✅
                                                    </button>
                                                    <button
                                                        className="btn-icon-table delete"
                                                        title="Reject"
                                                        onClick={() => handleStatusUpdate(req._id, 'rejected')}
                                                    >
                                                        ❌
                                                    </button>
                                                </>
                                            )}
                                        </div>
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
