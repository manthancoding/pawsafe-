import { useState, useEffect } from 'react';
import { emergencyApi } from '../../utils/api';

export default function AdminReports() {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchReports = async () => {
        try {
            const data = await emergencyApi.getAll();
            // Optional: sort newest first
            data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            setReports(data);
        } catch (err) {
            console.error('Failed to fetch reports', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReports();
    }, []);

    const handleStatusUpdate = async (id, status) => {
        try {
            await emergencyApi.updateStatus(id, status);
            fetchReports();
        } catch (err) {
            alert('Failed to update report status');
        }
    };

    return (
        <div className="admin-reports-page">
            <div className="admin-table-header">
                <h2>Emergency Rescue Reports</h2>
            </div>

            <div className="admin-table-wrapper">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Animal & Issue</th>
                            <th>Reporter</th>
                            <th>Location</th>
                            <th>Urgency</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan="6" className="table-loader">Loading reports...</td></tr>
                        ) : reports.length === 0 ? (
                            <tr><td colSpan="6" className="table-empty">No rescue reports found</td></tr>
                        ) : (
                            reports.map((report) => (
                                <tr key={report._id}>
                                    <td>
                                        <div className="report-cell">
                                            <p className="admin-name">{report.animalType}</p>
                                            <p className="admin-role">{report.issueType}</p>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="reporter-cell">
                                            <p className="admin-name">{report.name}</p>
                                            <p className="admin-role">{report.phone}</p>
                                        </div>
                                    </td>
                                    <td>{report.location}</td>
                                    <td>
                                        <span className={`urgency-badge ${report.urgency}`}>
                                            {report.urgency}
                                        </span>
                                    </td>
                                    <td>
                                        <span className={`status-badge ${report.status}`}>
                                            {report.status}
                                        </span>
                                    </td>
                                    <td>
                                        <div className="table-actions">
                                            {report.status !== 'resolved' && (
                                                <button
                                                    className="btn-icon-table edit"
                                                    title="Mark Rescued"
                                                    onClick={() => handleStatusUpdate(report._id, 'resolved')}
                                                >
                                                    🚑
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
            <style>{`
                .urgency-badge {
                    font-size: 0.75rem;
                    font-weight: 800;
                    text-transform: uppercase;
                    padding: 2px 6px;
                    border-radius: 4px;
                }
                .urgency-badge.critical { background: #fee2e2; color: #dc2626; border: 1px solid #f87171; }
                .urgency-badge.urgent { background: #fff7ed; color: #ea580c; border: 1px solid #fb923c; }
                .urgency-badge.standard { background: #f0fdf4; color: #16a34a; border: 1px solid #4ade80; }
            `}</style>
        </div>
    );
}
