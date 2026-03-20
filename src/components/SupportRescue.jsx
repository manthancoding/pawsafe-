import { useState } from 'react';
import { useTranslation } from '../utils/LanguageContext';
import PaymentGateway from './PaymentGateway';
import { incrementGlobalImpactStats } from '../utils/counterUtils';
import './SupportRescue.css';

const MOCK_CASES = [
    {
        id: 1,
        image: '/rescue_dog.png',
        name: 'Bruno',
        animal: '🐶 Dog',
        location: 'Mumbai, MH',
        story: 'Found on highway with severe leg fracture. Needs surgery and 3 weeks of post-op care.',
        required: 12000,
        raised: 7800,
        urgency: 'critical',
    },
    {
        id: 2,
        image: '/rescue_cat.png',
        name: 'Luna',
        animal: '🐱 Cat',
        location: 'Bengaluru, KA',
        story: 'Rescued from roadside with infected wounds and malnutrition. Requires antibiotics and nutrition treatment.',
        required: 6500,
        raised: 4100,
        urgency: 'moderate',
    },
    {
        id: 3,
        image: '/rescue_monkey.png',
        name: 'Chhotu',
        animal: '🐒 Monkey',
        location: 'Jaipur, RJ',
        story: 'Baby monkey separated from family with a fractured arm. Needs splinting and wildlife rehabilitation.',
        required: 9000,
        raised: 2300,
        urgency: 'urgent',
    },
];

function DonateModal({ animal, onClose, onPaymentSuccess, t }) {
    const [amount, setAmount] = useState('');
    const [showGateway, setShowGateway] = useState(false);
    const isValid = parseInt(amount) >= 1;

    if (showGateway) {
        return (
            <PaymentGateway
                amount={amount}
                causeLabel={animal.name}
                onSuccess={() => {
                    onPaymentSuccess(parseInt(amount));
                }}
                onClose={() => setShowGateway(false)}
            />
        );
    }

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-card" onClick={e => e.stopPropagation()}>
                <button className="modal-close" onClick={onClose} aria-label="Close">✕</button>
                <div className="modal-header">
                    <img src={animal.image} alt={animal.name} />
                    <div>
                        <h3>{t.support.donateFor} {animal.name}</h3>
                        <p className="modal-animal">{animal.animal} · {animal.location}</p>
                    </div>
                </div>
                <p className="modal-story">{animal.story}</p>
                <label className="amount-label">💰 Enter donation amount (min. ₹1)</label>
                <input
                    className="custom-amount"
                    type="number"
                    min="1"
                    placeholder="e.g. ₹250"
                    value={amount}
                    onChange={e => setAmount(e.target.value)}
                    autoFocus
                />
                {amount && !isValid && (
                    <p className="amount-error">Minimum donation is ₹1</p>
                )}
                <button
                    className="btn-donate-confirm"
                    disabled={!isValid}
                    onClick={() => setShowGateway(true)}
                >
                    💝 {t.support.donateNow} ₹{isValid ? parseInt(amount).toLocaleString('en-IN') : '—'}
                </button>
            </div>
        </div>
    );
}

function RescueCard({ animal, onDonate, t }) {
    const [showModal, setShowModal] = useState(false);
    const pct = Math.min(Math.round((animal.raised / animal.required) * 100), 100);
    const remaining = animal.required - animal.raised;

    const urgencyColors = {
        critical: { label: t.support.critical, color: '#e53935' },
        urgent: { label: t.support.urgent, color: '#f57c00' },
        moderate: { label: t.support.moderate, color: '#0d7377' },
    };
    const urgency = urgencyColors[animal.urgency];

    return (
        <>
            <div className="rescue-card">
                <div className="card-img-wrap">
                    <img src={animal.image} alt={animal.name} className="card-img" />
                    <span className="urgency-badge" style={{ background: urgency.color }}>{urgency.label}</span>
                    <span className="animal-type-badge">{animal.animal}</span>
                </div>

                <div className="card-body">
                    <div className="card-title-row">
                        <h3>{animal.name}</h3>
                        <span className="location">📍 {animal.location}</span>
                    </div>
                    <p className="card-story">{animal.story}</p>

                    <div className="fund-info">
                        <div className="fund-row">
                            <span className="fund-label">{t.support.required}</span>
                            <span className="fund-required">₹{animal.required.toLocaleString('en-IN')}</span>
                        </div>
                        <div className="fund-row">
                            <span className="fund-label">{t.support.raised}</span>
                            <span className="fund-raised">₹{animal.raised.toLocaleString('en-IN')}</span>
                        </div>
                    </div>

                    <div className="progress-wrap">
                        <div className="progress-bar-bg">
                            <div className="progress-bar-fill" style={{ width: `${pct}%`, background: urgency.color }} />
                        </div>
                        <div className="progress-labels">
                            <span className="pct-text">{pct}% {t.support.funded}</span>
                            <span className="remaining-text">₹{remaining.toLocaleString('en-IN')} {t.support.toGo}</span>
                        </div>
                    </div>

                    <button className="btn-donate" onClick={() => setShowModal(true)} style={{ '--accent': urgency.color }}>
                        💝 {t.support.donateNow}
                    </button>
                </div>
            </div>

            {showModal && <DonateModal
                animal={animal}
                onClose={() => setShowModal(false)}
                onPaymentSuccess={(amount) => {
                    setShowModal(false);
                    onDonate(animal.id, amount);
                }}
                t={t}
            />}
        </>
    );
}

export default function SupportRescue() {
    const t = useTranslation();
    const [cases, setCases] = useState(MOCK_CASES);

    const handleSuccessfulDonation = (animalId, currentAmount) => {
        // Update local card stat
        setCases(prev => prev.map(c =>
            c.id === animalId ? { ...c, raised: c.raised + currentAmount } : c
        ));

        // Update global stat offset
        incrementGlobalImpactStats(currentAmount);
    };

    return (
        <section className="support-rescue">
            <div className="container">
                <div className="section-header">
                    <span className="section-tag">🐾 {t.support.tag}</span>
                    <h2>{t.support.heading}</h2>
                    <p className="section-subtitle">{t.support.subtitle}</p>
                </div>
                <div className="rescue-cards-grid">
                    {cases.map(animal => (
                        <RescueCard key={animal.id} animal={animal} onDonate={handleSuccessfulDonation} t={t} />
                    ))}
                </div>
            </div>
        </section>
    );
}
