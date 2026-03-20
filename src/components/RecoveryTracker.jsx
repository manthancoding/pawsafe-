import { useState, useEffect } from 'react';
import { animalsApi } from '../utils/api';
import './RecoveryTracker.css';

// Status → UI config map
const STATUS_META = {
    critical: { label: 'Critical', color: '#e53935', stage: 1 },
    stable: { label: 'Stable', color: '#1565c0', stage: 2 },
    recovering: { label: 'Recovering', color: '#f57c00', stage: 3 },
    released: { label: 'Released', color: '#2e7d32', stage: 4 },
    adopted: { label: 'Adopted', color: '#2e7d32', stage: 4 },
};

// Static fallback animals used when backend is offline
const FALLBACK_ANIMALS = [
    {
        _id: '1', name: 'Bruno', emoji: '🐶', species: 'Dog',
        status: 'recovering', rescuedBy: 'Arjun Mehta',
        rescueDate: '01 Mar 2026', vet: 'Dr. Sunita Rao',
        location: 'Andheri West, Mumbai',
        description: 'Street dog rescued after being hit by a car.',
        notes: [
            { date: '01 Mar 2026', author: 'Dr. Sunita Rao', content: 'X-ray shows clean fracture on right hind leg. Cast applied.' },
            { date: '04 Mar 2026', author: 'Dr. Sunita Rao', content: 'Eating well. No infection signs.' },
        ],
        milestones: [
            { date: '01 Mar', label: 'Rescued & Admitted', completed: true },
            { date: '02 Mar', label: 'Surgery / Treatment', completed: true },
            { date: '05 Mar', label: 'Stable Condition', completed: true },
            { date: '15 Mar', label: 'Cast Removal', completed: false },
            { date: '22 Mar', label: 'Ready for Adoption', completed: false },
        ],
    },
    {
        _id: '2', name: 'Luna', emoji: '🐱', species: 'Cat',
        status: 'stable', rescuedBy: 'Priya Sharma',
        rescueDate: '28 Feb 2026', vet: 'Dr. Anil Kumar',
        location: 'Borivali, Mumbai',
        description: 'Kitten rescued from a drain. Malnourished on arrival.',
        notes: [
            { date: '28 Feb 2026', author: 'Dr. Anil Kumar', content: 'Severely dehydrated. IV fluids started.' },
        ],
        milestones: [
            { date: '28 Feb', label: 'Rescued & Admitted', completed: true },
            { date: '01 Mar', label: 'IV Fluids & Nutrition', completed: true },
            { date: '05 Mar', label: 'Eating Independently', completed: false },
        ],
    },
];

const STAGES = ['🚨 Rescued', '🩺 Examined', '💉 Treatment', '🔄 Recovery', '🏡 Released'];

function TrendBadge({ trend }) {
    const map = {
        improving: { label: '↑ Improving', color: '#2e7d32', bg: 'rgba(46,125,50,0.1)' },
        stable: { label: '→ Stable', color: '#1565c0', bg: 'rgba(21,101,192,0.1)' },
        declining: { label: '↓ Declining', color: '#c62828', bg: 'rgba(198,40,40,0.1)' },
    };
    const t = map[trend] || map.stable;
    return (
        <span className="trend-badge" style={{ color: t.color, background: t.bg }}>
            {t.label}
        </span>
    );
}

function AnimalCard({ animal, isSelected, onClick }) {
    return (
        <div className={`ra-card ${isSelected ? 'selected' : ''}`} onClick={onClick}>
            <span className="ra-emoji">{animal.emoji}</span>
            <div className="ra-card-info">
                <p className="ra-name">{animal.name}</p>
                <p className="ra-species">{animal.species}</p>
                <span className="ra-status-pill" style={{ background: animal.statusColor }}>
                    {animal.status}
                </span>
            </div>
            {animal.adoptionReady && <span className="adoption-ready">🏡 Adoption Ready</span>}
        </div>
    );
}

function RecoveryDetail({ animal }) {
    const [activeTab, setActiveTab] = useState('timeline');

    return (
        <div className="recovery-detail">
            {/* Header */}
            <div className="rd-header">
                <span className="rd-emoji">{animal.emoji}</span>
                <div className="rd-header-info">
                    <div className="rd-name-row">
                        <h3>{animal.name}</h3>
                        <span className="rd-status" style={{ background: animal.statusColor }}>
                            {animal.status}
                        </span>
                    </div>
                    <p className="rd-meta">{animal.species} · {animal.age} · {animal.gender}</p>
                    <p className="rd-meta">📍 Rescued from {animal.rescueLocation} on {animal.rescueDate}</p>
                    <p className="rd-injury">⚠️ {animal.injury}</p>
                </div>
            </div>

            {/* Stage progress bar */}
            <div className="stage-bar">
                {STAGES.map((s, i) => (
                    <div key={i} className={`stage-step ${i <= animal.stage ? 'done' : ''} ${i === animal.stage ? 'current' : ''}`}>
                        <div className="stage-dot" />
                        <span className="stage-label">{s}</span>
                        {i < STAGES.length - 1 && <div className={`stage-line ${i < animal.stage ? 'done' : ''}`} />}
                    </div>
                ))}
            </div>

            {/* Sub-tabs */}
            <div className="rd-tabs">
                {['timeline', 'vitals', 'meds', 'info'].map(t => (
                    <button
                        key={t}
                        className={`rd-tab ${activeTab === t ? 'active' : ''}`}
                        onClick={() => setActiveTab(t)}
                    >
                        {{ timeline: '📅 Timeline', vitals: '📊 Vitals', meds: '💊 Meds', info: 'ℹ️ Info' }[t]}
                    </button>
                ))}
            </div>

            {/* Timeline */}
            {activeTab === 'timeline' && (
                <div className="timeline">
                    {animal.timeline.map((e, i) => (
                        <div key={i} className={`timeline-item ${e.done ? 'done' : ''} ${e.current ? 'current' : ''}`}>
                            <div className="tl-dot-wrap">
                                <div className="tl-dot">{e.done ? '✓' : e.current ? '●' : '○'}</div>
                                {i < animal.timeline.length - 1 && <div className="tl-line" />}
                            </div>
                            <div className="tl-content">
                                <div className="tl-header">
                                    <p className="tl-title">{e.title}</p>
                                    <span className="tl-date">{e.date}{e.time ? ` · ${e.time}` : ' (Scheduled)'}</span>
                                </div>
                                <p className="tl-note">{e.note}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Vitals */}
            {activeTab === 'vitals' && (
                <div className="vitals-grid">
                    {animal.vitals.map((v, i) => (
                        <div key={i} className="vital-card">
                            <span className="vital-icon">{v.icon}</span>
                            <p className="vital-label">{v.label}</p>
                            <p className="vital-value">{v.value}</p>
                            <TrendBadge trend={v.trend} />
                        </div>
                    ))}
                    {animal.nextAppointment && (
                        <div className="next-appt">
                            📅 <strong>Next Appointment:</strong> {animal.nextAppointment}
                        </div>
                    )}
                </div>
            )}

            {/* Medications */}
            {activeTab === 'meds' && (
                <div className="meds-list">
                    {animal.medications.map((m, i) => (
                        <div key={i} className="med-item">
                            <span className="med-icon">💊</span>
                            <div className="med-info">
                                <p className="med-name">{m.name}</p>
                                <p className="med-type">{m.type}</p>
                                <p className="med-freq">🕐 {m.frequency}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Info */}
            {activeTab === 'info' && (
                <div className="info-grid">
                    {[
                        { label: 'NGO / Shelter', value: animal.ngo, icon: '🏥' },
                        { label: 'Attending Vet', value: animal.vet, icon: '👨‍⚕️' },
                        { label: 'Vet Contact', value: animal.vetPhone, icon: '📞' },
                        { label: 'Rescued By', value: animal.rescuedBy, icon: '🦸' },
                        { label: 'Rescue Date', value: animal.rescueDate, icon: '📅' },
                        { label: 'Location', value: animal.rescueLocation, icon: '📍' },
                    ].map((item, i) => (
                        <div key={i} className="info-item">
                            <span>{item.icon}</span>
                            <div>
                                <p className="info-label">{item.label}</p>
                                <p className="info-value">{item.value}</p>
                            </div>
                        </div>
                    ))}
                    {animal.adoptionReady && (
                        <div className="adoption-banner">
                            🏡 <strong>{animal.name} is ready for adoption!</strong>
                            <p>Contact the NGO to find a loving home.</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default function RecoveryTracker() {
    const [animals, setAnimals] = useState(FALLBACK_ANIMALS);
    const [selectedId, setSelectedId] = useState(null);

    useEffect(() => {
        animalsApi.getAll()
            .then((data) => {
                if (data && data.length > 0) {
                    setAnimals(data);
                    setSelectedId(data[0]._id);
                } else {
                    setSelectedId(FALLBACK_ANIMALS[0]._id);
                }
            })
            .catch(() => {
                setSelectedId(FALLBACK_ANIMALS[0]._id);
            });
    }, []);

    const selected = animals.find(a => a._id === selectedId) || animals[0];

    // Convert DB animal doc to the shape RecoveryDetail expects
    function toUiAnimal(a) {
        const meta = STATUS_META[a.status] || STATUS_META.stable;
        return {
            ...a,
            id: a._id,
            status: meta.label,
            statusColor: meta.color,
            stage: meta.stage,
            rescueLocation: a.location || '',
            injury: a.description || '',
            ngo: '',
            vetPhone: '',
            age: '',
            gender: '',
            adoptionReady: a.status === 'released' || a.status === 'adopted',
            // Map DB notes to UI timeline format
            timeline: (a.milestones || []).map((m, i) => ({
                date: m.date,
                time: '',
                title: m.label,
                note: (a.notes?.[i] || {}).content || '',
                done: m.completed,
                current: !m.completed && (a.milestones?.[i - 1] || {}).completed,
            })),
            // Placeholder vitals (actual vet vitals not stored in DB yet)
            vitals: [
                { label: 'Status', value: meta.label, icon: '📊', trend: a.status === 'recovering' ? 'improving' : 'stable' },
                { label: 'Vet', value: a.vet || 'Assigned', icon: '👨‍⚕️', trend: 'stable' },
                { label: 'Rescue By', value: a.rescuedBy || '—', icon: '🦸', trend: 'stable' },
                { label: 'Date', value: a.rescueDate || '—', icon: '📅', trend: 'stable' },
            ],
            medications: [],
        };
    }

    const uiAnimal = selected ? toUiAnimal(selected) : null;

    return (
        <div className="recovery-tracker">
            {/* Left: animal list */}
            <div className="ra-list">
                <p className="ra-list-heading">My Rescued Animals</p>
                {animals.map(a => (
                    <AnimalCard
                        key={a._id}
                        animal={toUiAnimal(a)}
                        isSelected={selectedId === a._id}
                        onClick={() => setSelectedId(a._id)}
                    />
                ))}
            </div>

            {/* Right: detail panel */}
            <div className="ra-detail-wrap">
                {uiAnimal ? <RecoveryDetail animal={uiAnimal} /> : (
                    <div className="rd-empty">
                        <span>🐾</span>
                        <p>Select an animal to view recovery details</p>
                    </div>
                )}
            </div>
        </div>
    );
}
