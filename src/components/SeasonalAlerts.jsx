import { useState } from 'react';
import './SeasonalAlerts.css';

// Auto-detect active season by current month
const getActiveAlert = () => {
    const m = new Date().getMonth() + 1; // 1-12
    if (m >= 3 && m <= 6) return 'heatwave';  // Mar-Jun
    if (m === 11) return 'diwali';    // Nov (Diwali)
    if (m === 3) return 'holi';      // Mar (Holi)
    return 'heatwave'; // default for demo
};

const ALERTS = [
    {
        id: 'heatwave',
        emoji: '☀️',
        color: '#e65100',
        bg: 'linear-gradient(135deg,#fff3e0,#fff8f0)',
        border: '#ffcc80',
        severity: 'HIGH',
        severityColor: '#e65100',
        title: 'Summer Heatwave Alert',
        subtitle: 'Apr – Jun · Animals at risk of heatstroke',
        description: 'Extreme temperatures (40–48°C) across India cause rapid dehydration and heatstroke in stray animals. Street dogs and cattle are most vulnerable.',
        tips: [
            { icon: '💧', title: 'Water Stations', body: 'Place large bowls of fresh water outside your home, office, or shop. Refill every 2 hours.' },
            { icon: '🏠', title: 'Shade Access', body: 'Animals seek shade desperately. Keep garage doors or gates slightly open. Cover parked vehicles to avoid hot metal burns.' },
            { icon: '❄️', title: 'Cool Wet Cloth', body: 'Apply a wet cloth to paws, belly and neck of an affected animal. Never give ice-cold water — it can cause shock.' },
            { icon: '🚨', title: 'Heatstroke Signs', body: 'Heavy panting, drooling, glazed eyes, stumbling, collapse. Move the animal to shade and call a rescue centre immediately.' },
            { icon: '🐾', title: 'Paw Protection', body: 'Asphalt reaches 70°C on hot days — burning paws in seconds. Check by placing your hand on the surface for 5 seconds.' },
        ],
        doList: ['Provide water in the morning & evening', 'Report collapsed animals immediately', 'Keep pets indoors between 11am–4pm'],
        dontList: ['Don\'t leave animals in parked cars', 'Don\'t use ice directly on the animal', 'Don\'t muzzle a panting dog'],
    },
    {
        id: 'diwali',
        emoji: '🎆',
        color: '#6a1b9a',
        bg: 'linear-gradient(135deg,#f3e5f5,#faf0ff)',
        border: '#ce93d8',
        severity: 'CRITICAL',
        severityColor: '#c62828',
        title: 'Diwali Firecracker Alert',
        subtitle: 'Oct – Nov · Noise & burn injuries',
        description: 'Firecrackers cause severe anxiety, burns, and hearing damage in animals. Dogs have 4× more sensitive hearing. Thousands of animals flee traffic in panic every Diwali.',
        tips: [
            { icon: '🏠', title: 'Create a Safe Room', body: 'Keep pets in an inner room with familiar smells, muffled sound, and their favourite toys. Use curtains to block flashes.' },
            { icon: '👂', title: 'Sound Desensitisation', body: 'Play calming music or white noise to mask explosions. Start a week before Diwali at low volume and gradually increase.' },
            { icon: '🩹', title: 'Burn First Aid', body: 'Cool burns with room-temperature water for 10 mins. Cover with clean cloth. Never apply butter or toothpaste. Rush to a vet.' },
            { icon: '📍', title: 'ID Tags', body: 'Ensure pets have ID tags and microchips before Diwali. Thousands of pets go missing due to panic. Take a recent photo.' },
            { icon: '🐕', title: 'Street Dogs', body: 'Identify your local strays. Leave doors or passages open for them to shelter. Report any injured animal on the road.' },
        ],
        doList: ['Keep pets indoors from 6pm–midnight', 'Have vet contact ready', 'Check under cars before starting them'],
        dontList: ['Don\'t burst crackers near animals', 'Don\'t leave pets alone outdoors', 'Don\'t scold a scared/panting animal'],
    },
    {
        id: 'holi',
        emoji: '🎨',
        color: '#1565c0',
        bg: 'linear-gradient(135deg,#e3f2fd,#f0f9ff)',
        border: '#90caf9',
        severity: 'MODERATE',
        severityColor: '#f57c00',
        title: 'Holi Chemical Exposure Alert',
        subtitle: 'Mar · Toxic colour ingestion & skin burns',
        description: 'Synthetic Holi colours contain lead, mercury, chromium and strong alkalis. Animals that walk through puddles or lick colour from their fur can suffer chemical burns, organ damage or blindness.',
        tips: [
            { icon: '🚿', title: 'Immediate Washing', body: 'If colour lands on an animal, rinse with plain water for 15–20 mins. Keep the animal calm. Apply coconut oil before washing for easier removal.' },
            { icon: '👁️', title: 'Eye Exposure', body: 'Flush eyes with clean water for 10+ mins. Hold lids open gently. Seek vet care if redness or cloudiness appears.' },
            { icon: '🤢', title: 'Ingestion Signs', body: 'Excessive drooling, vomiting, lethargy, or seizures after colour contact means the animal has ingested toxins. Rush to a vet immediately.' },
            { icon: '🛡️', title: 'Prevention', body: 'Keep pets indoors on Holi day. Avoid routes with standing coloured water. Use natural colours (turmeric, flowers) if celebrating near animals.' },
            { icon: '🐄', title: 'Cattle & Strays', body: 'Cattle and street animals are often targeted with colour pellets. Report intentional abuse to local police and animal welfare board.' },
        ],
        doList: ['Use organic/natural colours', 'Keep stray water bowls covered', 'Watch for signs of skin irritation'],
        dontList: ['Don\'t apply colour on animals', 'Don\'t let animals drink dyed water', 'Don\'t leave coloured pooling water unblocked'],
    },
];

function CareGuide({ alert }) {
    const [activeTip, setActiveTip] = useState(0);
    const tip = alert.tips[activeTip];

    return (
        <div className="care-guide">
            <h4 className="guide-heading">🩺 Care Guide</h4>
            <div className="tip-tabs">
                {alert.tips.map((t, i) => (
                    <button
                        key={i}
                        className={`tip-tab ${activeTip === i ? 'active' : ''}`}
                        style={{ '--ac': alert.color }}
                        onClick={() => setActiveTip(i)}
                    >
                        {t.icon}
                    </button>
                ))}
            </div>
            <div className="tip-body">
                <p className="tip-title">{tip.icon} {tip.title}</p>
                <p className="tip-text">{tip.body}</p>
            </div>

            <div className="do-dont">
                <div className="do-list">
                    <p className="dd-heading" style={{ color: '#2e7d32' }}>✅ Do</p>
                    {alert.doList.map((d, i) => <p key={i} className="dd-item">• {d}</p>)}
                </div>
                <div className="dont-list">
                    <p className="dd-heading" style={{ color: '#c62828' }}>❌ Don't</p>
                    {alert.dontList.map((d, i) => <p key={i} className="dd-item">• {d}</p>)}
                </div>
            </div>
        </div>
    );
}

export default function SeasonalAlerts() {
    const defaultActive = getActiveAlert();
    const [activeId, setActiveId] = useState(defaultActive);
    const [subscribed, setSubscribed] = useState(false);
    const [expandedGuide, setExpandedGuide] = useState(false);

    const alert = ALERTS.find(a => a.id === activeId);

    return (
        <section className="seasonal-alerts" style={{ background: alert.bg }}>
            <div className="container">

                {/* Header */}
                <div className="section-header">
                    <span className="section-tag" style={{ color: alert.color, borderColor: alert.color + '40', background: alert.color + '15' }}>
                        🇮🇳 India Seasonal Alert System
                    </span>
                    <h2>Animal Safety During Indian Seasons & Festivals</h2>
                    <p className="section-subtitle">Real-time care advisories tailored for India's unique climate and festivals</p>
                </div>

                {/* Alert selector tabs */}
                <div className="alert-tabs">
                    {ALERTS.map(a => (
                        <button
                            key={a.id}
                            className={`alert-tab-btn ${activeId === a.id ? 'active' : ''}`}
                            style={{ '--ac': a.color }}
                            onClick={() => { setActiveId(a.id); setExpandedGuide(false); }}
                        >
                            <span>{a.emoji}</span>
                            <span>{a.title.split(' ')[0]}</span>
                            {a.id === defaultActive && <span className="live-dot" />}
                        </button>
                    ))}
                </div>

                {/* Main alert card */}
                <div className="alert-card" style={{ borderColor: alert.border }}>
                    <div className="alert-card-top">
                        <div className="alert-icon-wrap" style={{ background: alert.color + '18' }}>
                            <span className="alert-big-icon">{alert.emoji}</span>
                        </div>
                        <div className="alert-info">
                            <div className="alert-badges">
                                <span className="severity-badge" style={{ background: alert.severityColor }}>
                                    ⚠️ {alert.severity} RISK
                                </span>
                                <span className="season-badge">{alert.subtitle}</span>
                            </div>
                            <h3 className="alert-title">{alert.title}</h3>
                            <p className="alert-desc">{alert.description}</p>
                        </div>
                    </div>

                    {/* Expand care guide */}
                    <button
                        className="guide-toggle"
                        style={{ '--ac': alert.color }}
                        onClick={() => setExpandedGuide(e => !e)}
                    >
                        {expandedGuide ? '▲ Hide Care Guide' : '📋 View Full Care Guide & Tips'}
                    </button>

                    {expandedGuide && <CareGuide alert={alert} />}
                </div>

                {/* Subscribe banner */}
                <div className="subscribe-banner" style={{ borderColor: alert.color + '40' }}>
                    <div className="sub-banner-left">
                        <span className="sub-banner-icon">🔔</span>
                        <div>
                            <strong>Get Seasonal Alerts Before They Hit</strong>
                            <p>We'll notify you 1 week before each high-risk season with actionable care tips.</p>
                        </div>
                    </div>
                    {subscribed ? (
                        <span className="subscribed-badge">✅ You're subscribed!</span>
                    ) : (
                        <button
                            className="btn-subscribe-alerts"
                            style={{ background: alert.color }}
                            onClick={() => setSubscribed(true)}
                        >
                            🔔 Subscribe to Alerts
                        </button>
                    )}
                </div>

                {/* Quick stat strip */}
                <div className="alert-stats">
                    {[
                        { icon: '🐶', stat: '2.8L+', label: 'Animals affected yearly' },
                        { icon: '📅', stat: '3', label: 'Major risk periods' },
                        { icon: '⚡', stat: '<5 min', label: 'Avg response guide' },
                        { icon: '🏥', stat: '500+', label: 'Partner vets on standby' },
                    ].map((s, i) => (
                        <div key={i} className="alert-stat-card">
                            <span>{s.icon}</span>
                            <strong>{s.stat}</strong>
                            <small>{s.label}</small>
                        </div>
                    ))}
                </div>

            </div>
        </section>
    );
}
