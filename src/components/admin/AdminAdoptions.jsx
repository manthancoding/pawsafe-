import { useState, useEffect } from 'react';
import { db } from '../../firebase';
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';

export default function AdminAdoptions() {
    const [adoptions, setAdoptions] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchAdoptions = async () => {
        try {
            const snap = await getDocs(collection(db, 'adoptions'));
            const data = snap.docs.map(d => ({ _id: d.id, ...d.data() }));
            // sort descending
            data.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
            setAdoptions(data);
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
            await updateDoc(doc(db, 'adoptions', id), { status });
            fetchAdoptions();
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
