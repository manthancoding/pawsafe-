import { useState, useEffect } from 'react';

export default function AdminDonations() {
    const [donations, setDonations] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDonations = async () => {
            try {
                const token = localStorage.getItem('pawsafe_token');
                const res = await fetch('http://localhost:5000/api/donations', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const data = await res.json();
                if (data.success) {
                    setDonations(data.data);
                }
            } catch (err) {
                console.error('Failed to fetch donations', err);
            } finally {
                setLoading(false);
            }
        };

        fetchDonations();
    }, []);

    const totalAmount = donations.reduce((sum, d) => sum + d.amount, 0);

    return (
        <div className="admin-donations-page">
            <div className="admin-table-header">
                <h2>Donation Tracking</h2>
                <div className="total-donation-summary">
                    <span>Total Raised:</span>
                    <strong>₹{totalAmount.toLocaleString()}</strong>
                </div>
            </div>

            <div className="admin-table-wrapper">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Donor Name</th>
                            <th>Email</th>
                            <th>Amount</th>
                            <th>Status</th>
                            <th>Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan="5" className="table-loader">Loading donations...</td></tr>
                        ) : donations.length === 0 ? (
                            <tr><td colSpan="5" className="table-empty">No donations found</td></tr>
                        ) : (
                            donations.map((d) => (
                                <tr key={d._id}>
                                    <td><strong>{d.name}</strong></td>
                                    <td>{d.email}</td>
                                    <td><span className="donation-amt">₹{d.amount.toLocaleString()}</span></td>
                                    <td>
                                        <span className="status-badge stable">Completed</span>
                                    </td>
                                    <td>{new Date(d.createdAt).toLocaleDateString()}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
            <style>{`
                .total-donation-summary {
                    background: var(--admin-mint);
                    padding: 0.75rem 1.5rem;
                    border-radius: 12px;
                    display: flex;
                    gap: 1rem;
                    align-items: center;
                }
                .total-donation-summary strong {
                    font-size: 1.25rem;
                    color: var(--admin-green-primary);
                }
                .donation-amt {
                    font-weight: 700;
                    color: var(--admin-green-primary);
                }
            `}</style>
        </div>
    );
}
