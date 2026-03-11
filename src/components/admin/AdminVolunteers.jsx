import { useState, useEffect } from 'react';
import { db } from '../../firebase';
import { collection, getDocs, updateDoc, doc, query, where } from 'firebase/firestore';

export default function AdminVolunteers() {
    const [volunteers, setVolunteers] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchVolunteers = async () => {
        try {
            const q = query(collection(db, 'users'), where('role', '==', 'volunteer'));
            const snap = await getDocs(q);
            const data = snap.docs.map(d => ({ _id: d.id, ...d.data() }));
            setVolunteers(data);
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
            await updateDoc(doc(db, 'users', id), { isActive: !currentStatus });
            fetchVolunteers();
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
