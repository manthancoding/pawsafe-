import { useState } from 'react';
import './AnimalBiteGuide.css';

// ── Dog Bite Steps ──────────────────────────────────────────
const DOG_BITE_STEPS = [
    {
        step: 1,
        icon: '🚿',
        title: 'Wash the Wound Immediately',
        urgency: 'Do this within 60 seconds',
        color: '#1565c0',
        content: [
            'Rinse the wound under running tap water for at least 15–20 minutes.',
            'Use soap and water — this alone reduces rabies risk by up to 50%.',
            'Do NOT scrub the wound — gentle rinsing is enough.',
            'Apply an antiseptic like Povidone-Iodine (Betadine) after washing.',
            'Do NOT apply turmeric, oil, chilli, or bandage tightly.',
        ],
        emergency: false,
    },
    {
        step: 2,
        icon: '🩹',
        title: 'Assess the Bite Category',
        urgency: 'Determines your treatment urgency',
        color: '#6a1b9a',
        content: [
            '🟡 Category I — Touching/feeding the animal, licking on intact skin → No treatment needed.',
            '🟠 Category II — Minor scratches, skin broken but no bleeding → Wash + Rabies Vaccination.',
            '🔴 Category III — Deep puncture, multiple bites, bites on face/hands/genitals, or bat contact → Immediate ARV + RIG injection.',
        ],
        emergency: false,
        catTable: true,
    },
    {
        step: 3,
        icon: '💉',
        title: 'Go to a Government Hospital Immediately',
        urgency: 'Anti-Rabies Vaccine (ARV) is FREE',
        color: '#c62828',
        content: [
            'In India, Anti-Rabies Vaccine (ARV) is FREE at all government hospitals.',
            'The standard schedule is: Day 0, Day 3, Day 7, Day 14, Day 28.',
            'Cat. III bites also require Rabies Immunoglobulin (RIG) on Day 0.',
            'Do NOT delay — once rabies symptoms appear, it is 100% fatal.',
            'Do NOT rely on traditional healers or home remedies for rabies prevention.',
        ],
        emergency: true,
    },
    {
        step: 4,
        icon: '🏥',
        title: 'Find Nearest Government Hospital',
        urgency: 'Available in every district',
        color: '#2e7d32',
        content: [
            'All government hospitals (PHC, CHC, District Hospital) provide free ARV.',
            'No prescription needed — just walk in to the casualty/emergency ward.',
            'In rural areas, go to your nearest Primary Health Centre (PHC).',
            'ASHA workers and Anganwadi centres can direct you to the nearest facility.',
        ],
        emergency: false,
        showHospital: true,
    },
    {
        step: 5,
        icon: '📋',
        title: 'Vaccination Schedule & Follow-Up',
        urgency: 'Complete the full course — do not skip',
        color: '#e65100',
        content: [
            'Day 0 — First vaccine dose (same day as bite). Also RIG for Cat. III.',
            'Day 3 — Second dose. Do not delay even by a day.',
            'Day 7 — Third dose. Wound should be healing by now.',
            'Day 14 — Fourth dose. Report any fever or neurological symptoms to doctor.',
            'Day 28 — Final dose. You are now protected.',
        ],
        emergency: false,
    },
];

// ── Other Animal Emergencies ────────────────────────────────
const OTHER_ANIMALS = [
    {
        id: 'monkey',
        icon: '🐒',
        title: 'Monkey Bite',
        color: '#827717',
        severity: 'HIGH — Same rabies risk as dog',
        steps: [
            '🚿 Wash wound with soap and running water for 15–20 min immediately.',
            '💉 Go to government hospital for ARV — monkeys carry Herpes B virus too.',
            '🩹 Monkey bites are often deep — Category III in most cases.',
            '🐒 Note whether monkey was wild or captive — tell the doctor.',
            '⚠️ Do NOT try to catch or follow the monkey.',
        ],
    },
    {
        id: 'snake',
        icon: '🐍',
        title: 'Snake Bite',
        color: '#1b5e20',
        severity: 'CRITICAL — Get to hospital in 30 min',
        steps: [
            '🛑 Keep the victim calm and still — movement speeds up venom spread.',
            '📏 Keep the bitten limb BELOW heart level.',
            '⌚ Note the time of bite immediately.',
            '🏥 Rush to nearest government hospital — Anti-Snake Venom (ASV) is free.',
            '❌ Do NOT cut and suck, tourniquet, or apply ice. Do NOT try to catch the snake.',
            '📸 Take a photo of snake from safe distance only if possible — helps identify species.',
        ],
    },
    {
        id: 'cat',
        icon: '🐱',
        title: 'Cat Scratch / Bite',
        color: '#6a1b9a',
        severity: 'MODERATE — Cat Scratch Disease + Rabies risk',
        steps: [
            '🚿 Wash with soap and water immediately for 15 min.',
            '💊 Cat scratches can cause Cat Scratch Disease (Bartonella) — may need antibiotics.',
            '💉 Cat bites that break skin are Category II/III — get ARV.',
            '🔍 Watch for swollen lymph nodes, fever within 3–14 days.',
            '🐾 Even pet cats should be vaccinated — verify rabies vaccination status.',
        ],
    },
    {
        id: 'scorpion',
        icon: '🦂',
        title: 'Scorpion Sting',
        color: '#b71c1c',
        severity: 'CRITICAL in children — Hospital immediately',
        steps: [
            '🧲 Do NOT apply ice, heat, or try to suck out venom.',
            '⌚ Note the time of sting and try to identify the scorpion colour.',
            '🏥 Go to hospital immediately — especially if child under 10 or elderly.',
            '⚠️ Danger signs: sweating, vomiting, numbness, breathing difficulty, drooling.',
            '💊 Prazosin is the antidote — available in government hospitals.',
            '🔦 Shake out shoes and clothing before wearing in rural areas.',
        ],
    },
    {
        id: 'rat',
        icon: '🐀',
        title: 'Rat Bite',
        color: '#455a64',
        severity: 'MODERATE — Leptospirosis & Rat Bite Fever risk',
        steps: [
            '🚿 Wash wound with soap and water for 15 min.',
            '💉 Get Tetanus shot if not updated in last 5 years.',
            '🏥 Visit a doctor — Rat Bite Fever (Streptobacillus) is rare but serious.',
            '💊 Antibiotics are usually prescribed — complete the course.',
            '🔍 Watch for fever, rash, joint pain within 3–10 days after bite.',
            '🐀 Wear gloves when handling rat traps or clearing infested areas.',
        ],
    },
];

// ── Hospital data (mock) ───────────────────────────────────
const HOSPITALS = [
    { name: 'AIIMS New Delhi', city: 'Delhi', phone: '011-26588500', type: 'Central Govt' },
    { name: 'KEM Hospital', city: 'Mumbai', phone: '022-24136051', type: 'Municipal' },
    { name: 'Rajiv Gandhi Govt Hospital', city: 'Chennai', phone: '044-25305000', type: 'State Govt' },
    { name: 'Victoria Hospital', city: 'Bengaluru', phone: '080-26703222', type: 'State Govt' },
    { name: 'Osmania General Hospital', city: 'Hyderabad', phone: '040-24600122', type: 'State Govt' },
    { name: 'SSKM Hospital', city: 'Kolkata', phone: '033-22041739', type: 'State Govt' },
];

// ── Sub-components ─────────────────────────────────────────
function StepCard({ step, isActive, onClick }) {
    return (
        <div
            className={`step-card ${isActive ? 'active' : ''}`}
            style={{ '--sc': step.color }}
            onClick={onClick}
        >
            <div className="step-number" style={{ background: step.color }}>{step.step}</div>
            <span className="step-card-icon">{step.icon}</span>
            <p className="step-card-title">{step.title}</p>
        </div>
    );
}

function StepDetail({ step }) {
    const [city, setCity] = useState('');
    const hospitals = city
        ? HOSPITALS.filter(h => h.city.toLowerCase().includes(city.toLowerCase()))
        : HOSPITALS;

    return (
        <div className="step-detail" style={{ '--sc': step.color }}>
            <div className="step-detail-header">
                <span className="sd-icon">{step.icon}</span>
                <div>
                    <div className="sd-step-num" style={{ color: step.color }}>Step {step.step}</div>
                    <h3 className="sd-title">{step.title}</h3>
                    <span className="sd-urgency" style={{ background: step.color + '20', color: step.color }}>
                        ⚡ {step.urgency}
                    </span>
                </div>
            </div>

            {step.catTable ? (
                <div className="cat-table">
                    <div className="cat-row cat-1"><span>🟡 Cat I</span><span>Licking on unbroken skin</span><span>Wash only</span></div>
                    <div className="cat-row cat-2"><span>🟠 Cat II</span><span>Minor scratch, no bleeding</span><span>ARV (5 doses)</span></div>
                    <div className="cat-row cat-3"><span>🔴 Cat III</span><span>Deep bite / face / hands</span><span>ARV + RIG (urgent)</span></div>
                </div>
            ) : (
                <ul className="step-points">
                    {step.content.map((c, i) => (
                        <li key={i}>{c}</li>
                    ))}
                </ul>
            )}

            {step.showHospital && (
                <div className="hospital-finder">
                    <p className="hf-label">🔎 Search nearby government hospitals</p>
                    <input
                        className="hf-input"
                        type="text"
                        placeholder="Enter your city (e.g. Mumbai, Delhi)"
                        value={city}
                        onChange={e => setCity(e.target.value)}
                    />
                    <div className="hf-list">
                        {hospitals.map((h, i) => (
                            <div key={i} className="hf-item">
                                <div>
                                    <p className="hf-name">{h.name}</p>
                                    <p className="hf-meta">{h.city} · {h.type}</p>
                                </div>
                                <a href={`tel:${h.phone}`} className="hf-call">📞 {h.phone}</a>
                            </div>
                        ))}
                        {hospitals.length === 0 && (
                            <p className="hf-empty">No hospitals found. Visit your nearest District Hospital or PHC.</p>
                        )}
                    </div>
                    <p className="hf-note">💡 All government hospitals provide FREE Anti-Rabies Vaccine (ARV)</p>
                </div>
            )}

            {step.emergency && (
                <div className="emergency-notice">
                    ⚠️ <strong>Rabies is 100% preventable but 100% fatal once symptoms appear.</strong> Do not delay vaccination.
                </div>
            )}
        </div>
    );
}

// ── Main Component ──────────────────────────────────────────
export default function AnimalBiteGuide() {
    const [activeStep, setActiveStep] = useState(0);
    const [tab, setTab] = useState('dog');          // 'dog' | 'others'
    const [activeAnimal, setActiveAnimal] = useState('monkey');

    const other = OTHER_ANIMALS.find(a => a.id === activeAnimal);

    return (
        <section className="bite-guide-section">
            <div className="container">

                {/* Header */}
                <div className="section-header">
                    <span className="section-tag">🚨 Emergency First Aid</span>
                    <h2>Animal Bite Emergency Guide</h2>
                    <p className="section-subtitle">Step-by-step first aid for animal bites common in India — act fast, save lives</p>
                </div>

                {/* Main Tabs */}
                <div className="bite-main-tabs">
                    <button
                        className={`bite-main-tab ${tab === 'dog' ? 'active' : ''}`}
                        onClick={() => setTab('dog')}
                    >
                        🐶 Stray Dog Bite
                        <span className="tab-sub">Most common in India</span>
                    </button>
                    <button
                        className={`bite-main-tab ${tab === 'others' ? 'active' : ''}`}
                        onClick={() => setTab('others')}
                    >
                        🐾 Other Animals
                        <span className="tab-sub">Monkey, Snake, Cat &amp; more</span>
                    </button>
                </div>

                {/* ── Dog Bite Flow ── */}
                {tab === 'dog' && (
                    <div className="dog-bite-flow">
                        {/* Step selector */}
                        <div className="step-selector">
                            {DOG_BITE_STEPS.map((s, i) => (
                                <StepCard
                                    key={s.step}
                                    step={s}
                                    isActive={activeStep === i}
                                    onClick={() => setActiveStep(i)}
                                />
                            ))}
                        </div>

                        {/* Step detail */}
                        <StepDetail step={DOG_BITE_STEPS[activeStep]} />

                        {/* Navigation */}
                        <div className="step-nav">
                            <button
                                className="step-nav-btn prev"
                                disabled={activeStep === 0}
                                onClick={() => setActiveStep(s => s - 1)}
                            >
                                ← Previous
                            </button>
                            <span className="step-nav-count">{activeStep + 1} / {DOG_BITE_STEPS.length}</span>
                            <button
                                className="step-nav-btn next"
                                disabled={activeStep === DOG_BITE_STEPS.length - 1}
                                onClick={() => setActiveStep(s => s + 1)}
                            >
                                Next →
                            </button>
                        </div>
                    </div>
                )}

                {/* ── Other Animals ── */}
                {tab === 'others' && (
                    <div className="other-animals">
                        <div className="animal-selector">
                            {OTHER_ANIMALS.map(a => (
                                <button
                                    key={a.id}
                                    className={`animal-btn ${activeAnimal === a.id ? 'active' : ''}`}
                                    style={{ '--ac': a.color }}
                                    onClick={() => setActiveAnimal(a.id)}
                                >
                                    <span>{a.icon}</span>
                                    <span>{a.title}</span>
                                </button>
                            ))}
                        </div>

                        <div className="animal-detail" style={{ '--ac': other.color }}>
                            <div className="animal-detail-header">
                                <span className="ad-icon">{other.icon}</span>
                                <div>
                                    <h3>{other.title}</h3>
                                    <span className="ad-severity" style={{ background: other.color + '18', color: other.color }}>
                                        ⚠️ {other.severity}
                                    </span>
                                </div>
                            </div>
                            <ul className="ad-steps">
                                {other.steps.map((s, i) => (
                                    <li key={i}>{s}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                )}

                {/* Quick reminder strip */}
                <div className="bite-quick-strip">
                    {[
                        { icon: '🚿', text: 'Wash wound 15+ mins' },
                        { icon: '🏥', text: 'Free ARV at govt hospitals' },
                        { icon: '💉', text: 'Rabies is 100% preventable' },
                        { icon: '📞', text: 'National helpline: 1962' },
                    ].map((item, i) => (
                        <div key={i} className="quick-strip-item">
                            <span>{item.icon}</span>
                            <p>{item.text}</p>
                        </div>
                    ))}
                </div>

            </div>
        </section>
    );
}
