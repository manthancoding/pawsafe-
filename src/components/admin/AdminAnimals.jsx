import { useState, useEffect } from 'react';
import { db } from '../../firebase';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import './AdminAnimals.css';

export default function AdminAnimals() {
    const [animals, setAnimals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    const fetchAnimals = async () => {
        try {
            const snap = await getDocs(collection(db, 'animals'));
            const data = snap.docs.map(d => ({ _id: d.id, ...d.data() }));
            setAnimals(data);
        } catch (err) {
            console.error('Failed to fetch animals', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAnimals();
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this animal record?')) return;
        try {
            await deleteDoc(doc(db, 'animals', id));
            fetchAnimals();
        } catch (err) {
            alert('Failed to delete animal');
        }
    };

    const filteredAnimals = animals.filter(a =>
        a.name.toLowerCase().includes(search.toLowerCase()) ||
        a.species.toLowerCase().includes(search.toLowerCase()) ||
        a.location.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="admin-animals-page">
            <div className="admin-table-header">
                <h2>Animal Management</h2>
                <div className="admin-actions">
                    <div className="search-bar">
                        <span className="search-icon">🔍</span>
                        <input
                            type="text"
                            placeholder="Search by name, species or location..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <button className="btn-add-animal">➕ Add New Animal</button>
                </div>
            </div>

            <div className="admin-table-wrapper">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Animal</th>
                            <th>Species</th>
                            <th>Status</th>
                            <th>Rescue Location</th>
                            <th>Date</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan="6" className="table-loader">Loading animals...</td></tr>
                        ) : filteredAnimals.length === 0 ? (
                            <tr><td colSpan="6" className="table-empty">No animals found</td></tr>
                        ) : (
                            filteredAnimals.map((animal) => (
                                <tr key={animal._id}>
                                    <td>
                                        <div className="animal-cell">
                                            <span className="animal-emoji">{animal.emoji}</span>
                                            <span className="animal-name-table">{animal.name}</span>
                                        </div>
                                    </td>
                                    <td>{animal.species}</td>
                                    <td>
                                        <span className={`status-badge ${animal.status}`}>
                                            {animal.status}
                                        </span>
                                    </td>
                                    <td>{animal.location}</td>
                                    <td>{new Date(animal.createdAt).toLocaleDateString()}</td>
                                    <td>
                                        <div className="table-actions">
                                            <button className="btn-icon-table edit" title="Edit">✏️</button>
                                            <button
                                                className="btn-icon-table delete"
                                                title="Delete"
                                                onClick={() => handleDelete(animal._id)}
                                            >
                                                🗑️
                                            </button>
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
