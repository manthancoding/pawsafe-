import { useState } from 'react';
import './RecoveryTracker.css';

// ── Mock rescued animal data ────────────────────────────────
const RESCUED_ANIMALS = [
    {
        id: 1,
        name: 'Bruno',
        emoji: '🐶',
        species: 'Indian Pariah Dog',
        age: '~3 years',
        gender: 'Male',
        rescueDate: '01 Mar 2026',
        rescueLocation: 'Andheri West, Mumbai',
        injury: 'Hit by vehicle — fracture in right hind leg, road rash on flank',
        rescuedBy: 'Arjun Mehta',
        ngo: 'Mumbai Animal Aid',
        vet: 'Dr. Priya Desai',
        vetPhone: '+91 98200 11234',
        status: 'Treatment Ongoing',
        statusColor: '#f57c00',
        stage: 2, // 0-4 (Rescued → Examined → Treatment → Recovery → Released)
        vitals: [
            { label: 'Weight', value: '14.2 kg', icon: '⚖️', trend: 'stable' },
            { label: 'Appetite', value: 'Moderate', icon: '🍖', trend: 'improving' },
            { label: 'Mobility', value: 'Limited', icon: '🦴', trend: 'improving' },
            { label: 'Pain Level', value: '3 / 10', icon: '💊', trend: 'improving' },
        ],
        timeline: [
            { date: '01 Mar 2026', time: '8:30 PM', title: 'Rescued from highway', note: 'Animal found on NH-48. Immobilised and transported to care centre.', done: true },
            { date: '01 Mar 2026', time: '9:15 PM', title: 'Initial vet examination', note: 'X-ray confirmed hairline fracture, right hind leg. Rabies & distemper check done.', done: true },
            { date: '02 Mar 2026', time: '10:00 AM', title: 'Surgery — fracture fixation', note: 'External fixator applied under general anaesthesia. Surgery successful. Now under observation.', done: true },
            { date: '03 Mar 2026', time: '9:00 AM', title: 'Post-op check & dressing', note: 'Wound healing well. Antibiotics and pain medication prescribed.', done: false, current: true },
            { date: '10 Mar 2026', time: '', title: 'Follow-up X-ray', note: 'Scheduled to check bone healing progress.', done: false },
            { date: '25 Mar 2026', time: '', title: 'Fixator removal (if healed)', note: 'Target discharge and adoption placement.', done: false },
        ],
        medications: [
            { name: 'Meloxicam 7.5mg', type: 'Pain relief', frequency: 'Once daily after food' },
            { name: 'Amoxicillin 500mg', type: 'Antibiotic', frequency: 'Twice daily for 7 days' },
            { name: 'Rabies vaccine', type: 'Vaccination', frequency: 'Completed on Day 0' },
        ],
        photos: ['🐕', '🩺', '💉'],
        nextAppointment: '03 Mar 2026, 9:00 AM',
        adoptionReady: false,
    },
    {
        id: 2,
        name: 'Mitthu',
        emoji: '🐱',
        species: 'Domestic Shorthair Cat',
        age: '~6 months',
        gender: 'Female',
        rescueDate: '28 Feb 2026',
        rescueLocation: 'Borivali East, Mumbai',
        injury: 'Trapped in drain — dehydrated, minor cuts on paws',
        rescuedBy: 'Arjun Mehta',
        ngo: 'Paws Mumbai',
        vet: 'Dr. Sameer Kulkarni',
        vetPhone: '+91 98190 44321',
        status: 'In Recovery',
        statusColor: '#2e7d32',
        stage: 3,
        vitals: [
            { label: 'Weight', value: '1.8 kg', icon: '⚖️', trend: 'improving' },
            { label: 'Appetite', value: 'Good', icon: '🍖', trend: 'stable' },
            { label: 'Mobility', value: 'Normal', icon: '🦴', trend: 'stable' },
            { label: 'Pain Level', value: '1 / 10', icon: '💊', trend: 'stable' },
        ],
        timeline: [
            { date: '28 Feb 2026', time: '6:00 PM', title: 'Rescued from open drain', note: 'Kitten found in storm drain, dehydrated and scared. Transported safely.', done: true },
            { date: '28 Feb 2026', time: '7:30 PM', title: 'Emergency vet care', note: 'IV fluids administered. Paw wounds cleaned and dressed.', done: true },
            { date: '01 Mar 2026', time: '9:00 AM', title: 'Observation & feeding', note: 'Eating well. Wounds healing. Vaccines administered.', done: true },
            { date: '02 Mar 2026', time: '', title: 'Recovery check', note: 'Fully active and playful. Cleared for foster home.', done: true },
            { date: '07 Mar 2026', time: '', title: 'Final health clearance', note: 'Spay surgery scheduled before adoption.', done: false, current: true },
        ],
        medications: [
            { name: 'Oral Rehydration Salts', type: 'Hydration', frequency: 'As needed' },
            { name: 'Neocort Cream', type: 'Wound care', frequency: 'Apply twice daily' },
        ],
        photos: ['🐱', '💊', '🏥'],
        nextAppointment: '07 Mar 2026',
        adoptionReady: true,
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
    const [selectedId, setSelectedId] = useState(RESCUED_ANIMALS[0].id);
    const selected = RESCUED_ANIMALS.find(a => a.id === selectedId);

    return (
        <div className="recovery-tracker">
            {/* Left: animal list */}
            <div className="ra-list">
                <p className="ra-list-heading">My Rescued Animals</p>
                {RESCUED_ANIMALS.map(a => (
                    <AnimalCard
                        key={a.id}
                        animal={a}
                        isSelected={selectedId === a.id}
                        onClick={() => setSelectedId(a.id)}
                    />
                ))}
            </div>

            {/* Right: detail panel */}
            <div className="ra-detail-wrap">
                {selected ? <RecoveryDetail animal={selected} /> : (
                    <div className="rd-empty">
                        <span>🐾</span>
                        <p>Select an animal to view recovery details</p>
                    </div>
                )}
            </div>
        </div>
    );
}
