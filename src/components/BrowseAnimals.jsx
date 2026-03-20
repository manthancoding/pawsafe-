import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PaymentGateway from './PaymentGateway';
import './BrowseAnimals.css';

export default function BrowseAnimals() {
    const [animals, setAnimals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [selectedAnimal, setSelectedAnimal] = useState(null);
    const [adoptingAnimal, setAdoptingAnimal] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAnimals = async () => {
            try {
                const res = await fetch('/api/animals');
                const result = await res.json();
                if (result.success) {
                    setAnimals(result.data);
                }
            } catch (err) {
                console.error('Error fetching animals:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchAnimals();
    }, []);

    const handleAdoptionSuccess = async () => {
        try {
            const token = localStorage.getItem('pawsafe_token');
            const user = JSON.parse(localStorage.getItem('pawsafe_user') || '{}');

            // Record the adoption request
            const res = await fetch('/api/adoptions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    animal: adoptingAnimal.id || adoptingAnimal._id,
                    animalName: adoptingAnimal.name,
                    userId: user.uid || user.id || user._id,
                    userName: user.name,
                    userEmail: user.email,
                    amount: 5000, // Standard adoption fee / donation
                })
            });

            const result = await res.json();
            if (result.success) {
                // Update local state to hide it
                setAnimals(prev => prev.map(a =>
                    (a.id === adoptingAnimal.id || a._id === adoptingAnimal._id)
                        ? { ...a, status: 'adopted' }
                        : a
                ));

                setSuccessMessage(`Success! Your adoption request for ${adoptingAnimal.name} has been submitted.`);
                setAdoptingAnimal(null);
            }
        } catch (err) {
            console.error('Error submitting adoption:', err);
            // Fallback for demo if API fails
            setSuccessMessage(`Awesome! You've started the journey to adopt ${adoptingAnimal.name}.`);
            setAdoptingAnimal(null);
        }
    };

    const filteredAnimals = animals.filter(a => {
        const isNotAdopted = a.status !== 'adopted';
        const matchesType = filter === 'all' || a.species === filter;
        return isNotAdopted && matchesType;
    });

    if (loading) {
        return (
            <div className="browse-loading">
                <div className="spinner"></div>
                <p>Loading animals...</p>
            </div>
        );
    }

    return (
        <div className="browse-animals-page">
            <header className="browse-header">
                <div className="container">
                    <h1>Find Your New Friend</h1>
                    <p>Browse animals in our care waiting for a home or recovery.</p>

                    <div className="filter-bar">
                        <button className={`filter-btn ${filter === 'all' ? 'active' : ''}`} onClick={() => setFilter('all')}>All</button>
                        <button className={`filter-btn ${filter === 'dog' ? 'active' : ''}`} onClick={() => setFilter('dog')}>Dogs</button>
                        <button className={`filter-btn ${filter === 'cat' ? 'active' : ''}`} onClick={() => setFilter('cat')}>Cats</button>
                        <button className={`filter-btn ${filter === 'rabbit' ? 'active' : ''}`} onClick={() => setFilter('rabbit')}>Rabbits</button>
                        <button className={`filter-btn ${filter === 'bird' ? 'active' : ''}`} onClick={() => setFilter('bird')}>Birds</button>
                    </div>
                </div>
            </header>

            <main className="container">
                {successMessage && (
                    <div className="success-toast" onClick={() => setSuccessMessage('')}>
                        <p>✅ {successMessage}</p>
                    </div>
                )}

                <div className="animals-grid">
                    {filteredAnimals.length === 0 ? (
                        <div className="empty-browse">
                            <span className="empty-icon">🐾</span>
                            <p>No animals found matching this category.</p>
                        </div>
                    ) : (
                        filteredAnimals.map(animal => (
                            <div key={animal.id || animal._id} className="animal-card-premium">
                                <div className="animal-img-wrap">
                                    <img src={animal.photoUrl || '/placeholder-animal.jpg'} alt={animal.name} />
                                    <div className="status-badge" data-status={animal.status}>{animal.status}</div>
                                </div>
                                <div className="animal-card-content">
                                    <div className="animal-card-header">
                                        <h3>{animal.emoji} {animal.name}</h3>
                                        <span className="species-tag">{animal.species}</span>
                                    </div>
                                    <p className="animal-desc">{animal.description?.substring(0, 100)}...</p>
                                    <div className="animal-meta">
                                        <span>📍 {animal.location}</span>
                                    </div>
                                    <div className="animal-card-actions">
                                        <button className="btn-secondary-outline" onClick={() => setSelectedAnimal(animal)}>View Details</button>
                                        <button
                                            className="btn-primary-small"
                                            onClick={() => setAdoptingAnimal(animal)}
                                            disabled={animal.status === 'adopted'}
                                        >
                                            {animal.status === 'adopted' ? 'ADOPTED' : 'ADOPT ME'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </main>

            {/* Animal Details Modal */}
            {selectedAnimal && (
                <div className="animal-modal-overlay" onClick={() => setSelectedAnimal(null)}>
                    <div className="animal-modal-card" onClick={e => e.stopPropagation()}>
                        <button className="modal-close" onClick={() => setSelectedAnimal(null)}>&times;</button>
                        <div className="modal-body">
                            <div className="modal-img-sidebar">
                                <img src={selectedAnimal.photoUrl || '/placeholder-animal.jpg'} alt={selectedAnimal.name} />
                                <div className="modal-badge-group">
                                    <span className="status-badge" data-status={selectedAnimal.status}>{selectedAnimal.status}</span>
                                    <span className="species-tag">{selectedAnimal.species}</span>
                                </div>
                            </div>
                            <div className="modal-info-content">
                                <h2>{selectedAnimal.emoji} {selectedAnimal.name}</h2>
                                <p className="modal-location">📍 {selectedAnimal.location}</p>

                                <div className="modal-scroll-area">
                                    <h3>About {selectedAnimal.name}</h3>
                                    <p>{selectedAnimal.description}</p>

                                    {selectedAnimal.milestones && selectedAnimal.milestones.length > 0 && (
                                        <div className="milestones-section">
                                            <h4>Recovery Milestones</h4>
                                            <div className="milestone-timeline">
                                                {selectedAnimal.milestones.map((m, i) => (
                                                    <div key={i} className={`milestone-item ${m.completed ? 'completed' : ''}`}>
                                                        <div className="m-circle"></div>
                                                        <div className="m-info">
                                                            <span className="m-label">{m.label}</span>
                                                            <span className="m-date">{m.date}</span>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {selectedAnimal.notes && selectedAnimal.notes.length > 0 && (
                                        <div className="notes-section">
                                            <h4>Vet & Rescuer Notes</h4>
                                            {selectedAnimal.notes.map((n, i) => (
                                                <div key={i} className="note-card">
                                                    <div className="note-header">
                                                        <strong>{n.author}</strong>
                                                        <span>{n.date}</span>
                                                    </div>
                                                    <p>{n.content}</p>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                <div className="modal-actions">
                                    <button
                                        className="btn-primary"
                                        onClick={() => {
                                            setAdoptingAnimal(selectedAnimal);
                                            setSelectedAnimal(null);
                                        }}
                                        disabled={selectedAnimal.status === 'adopted'}
                                    >
                                        Adopt {selectedAnimal.name}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Payment Gateway Modal */}
            {adoptingAnimal && (
                <PaymentGateway
                    amount={5000}
                    causeLabel={`Adoption of ${adoptingAnimal.name}`}
                    onSuccess={handleAdoptionSuccess}
                    onClose={() => setAdoptingAnimal(null)}
                />
            )}
        </div>
    );
}
