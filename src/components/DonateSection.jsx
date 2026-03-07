import { useState } from 'react';
import { useTranslation } from '../utils/LanguageContext';
import './DonateSection.css';

const CAUSES = [
    { id: 'food', icon: '🍖', key: 'food', color: '#f57c00' },
    { id: 'medical', icon: '💊', key: 'medical', color: '#e53935' },
    { id: 'shelter', icon: '🏠', key: 'shelter', color: '#7b1fa2' },
    { id: 'general', icon: '🐾', key: 'general', color: '#0d7377' },
];

const ONE_TIME_AMOUNTS = [50, 100, 250, 500, 1000, 2500];

const MONTHLY_PLANS = [
    { id: 'basic', amountKey: 'basic', amount: 99, color: '#0d7377' },
    { id: 'care', amountKey: 'care', amount: 299, color: '#7b1fa2', popular: true },
    { id: 'guardian', amountKey: 'guardian', amount: 799, color: '#f57c00' },
];

function ThankYouModal({ mode, amount, cause, plan, onClose, t }) {
    const d = t.donate;
    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="ty-modal" onClick={e => e.stopPropagation()}>
                <div className="ty-icon">🎉</div>
                <h3>{d.thankyouHeading}</h3>
                {mode === 'onetime' ? (
                    <p>{d.thankyouOneTime.replace('{amount}', `₹${parseInt(amount).toLocaleString('en-IN')}`).replace('{cause}', cause)}</p>
                ) : (
                    <p>{d.thankyouSub.replace('{plan}', plan)}</p>
                )}
                <p className="ty-note">{d.thankyouNote}</p>
                <button className="btn-ty-close" onClick={onClose}>{d.thankyouClose}</button>
            </div>
        </div>
    );
}

export default function DonateSection() {
    const t = useTranslation();
    const d = t.donate;

    const [tab, setTab] = useState('onetime');       // 'onetime' | 'monthly'
    const [cause, setCause] = useState('food');
    const [amount, setAmount] = useState('');
    const [preset, setPreset] = useState(null);
    const [plan, setPlan] = useState('care');
    const [showTY, setShowTY] = useState(false);

    const finalAmount = preset ?? (parseInt(amount) || 0);
    const isValid = finalAmount >= 1;

    const handleOneTimeDonate = () => {
        if (!isValid) return;
        setShowTY(true);
    };

    const handleSubscribe = () => {
        setShowTY(true);
    };

    const selectedCause = CAUSES.find(c => c.id === cause);
    const selectedPlan = MONTHLY_PLANS.find(p => p.id === plan);

    return (
        <section className="donate-section">
            <div className="container">
                <div className="section-header">
                    <span className="section-tag">💝 {d.tag}</span>
                    <h2>{d.heading}</h2>
                    <p className="section-subtitle">{d.subtitle}</p>
                </div>

                {/* Tab switcher */}
                <div className="donate-tabs">
                    <button
                        className={`donate-tab ${tab === 'onetime' ? 'active' : ''}`}
                        onClick={() => setTab('onetime')}
                    >
                        🎁 {d.tabOneTime}
                    </button>
                    <button
                        className={`donate-tab ${tab === 'monthly' ? 'active' : ''}`}
                        onClick={() => setTab('monthly')}
                    >
                        🔁 {d.tabMonthly}
                    </button>
                </div>

                {/* ── ONE-TIME ── */}
                {tab === 'onetime' && (
                    <div className="donate-panel">
                        {/* Cause selector */}
                        <p className="panel-label">{d.chooseCause}</p>
                        <div className="cause-grid">
                            {CAUSES.map(c => (
                                <button
                                    key={c.id}
                                    className={`cause-card ${cause === c.id ? 'selected' : ''}`}
                                    style={{ '--cause-color': c.color }}
                                    onClick={() => setCause(c.id)}
                                >
                                    <span className="cause-icon">{c.icon}</span>
                                    <span className="cause-label">{d.causes[c.key]}</span>
                                </button>
                            ))}
                        </div>

                        {/* Amount selector */}
                        <p className="panel-label">{d.chooseAmount}</p>
                        <div className="amount-grid">
                            {ONE_TIME_AMOUNTS.map(a => (
                                <button
                                    key={a}
                                    className={`amount-chip ${preset === a && !amount ? 'active' : ''}`}
                                    onClick={() => { setPreset(a); setAmount(''); }}
                                >
                                    ₹{a.toLocaleString('en-IN')}
                                </button>
                            ))}
                        </div>

                        <input
                            className="donate-input"
                            type="number"
                            min="1"
                            placeholder={d.customPlaceholder}
                            value={amount}
                            onChange={e => { setAmount(e.target.value); setPreset(null); }}
                        />

                        <div className="donate-summary">
                            <span className="summary-cause" style={{ background: selectedCause?.color }}>
                                {selectedCause?.icon} {d.causes[selectedCause?.key]}
                            </span>
                            <span className="summary-amount">
                                {isValid ? `₹${finalAmount.toLocaleString('en-IN')}` : '₹—'}
                            </span>
                        </div>

                        <button
                            className="btn-donate-main"
                            disabled={!isValid}
                            onClick={handleOneTimeDonate}
                        >
                            💝 {d.donateNow} {isValid ? `₹${finalAmount.toLocaleString('en-IN')}` : ''}
                        </button>
                    </div>
                )}

                {/* ── MONTHLY ── */}
                {tab === 'monthly' && (
                    <div className="donate-panel">
                        <p className="panel-label">{d.choosePlan}</p>
                        <div className="plans-grid">
                            {MONTHLY_PLANS.map(p => (
                                <div
                                    key={p.id}
                                    className={`plan-card ${plan === p.id ? 'selected' : ''} ${p.popular ? 'popular' : ''}`}
                                    style={{ '--plan-color': p.color }}
                                    onClick={() => setPlan(p.id)}
                                >
                                    {p.popular && <span className="popular-badge">{d.popular}</span>}
                                    <div className="plan-name">{d.plans[p.amountKey].name}</div>
                                    <div className="plan-price">
                                        ₹{p.amount}<span className="per-month">/{d.month}</span>
                                    </div>
                                    <ul className="plan-perks">
                                        {d.plans[p.amountKey].perks.map((perk, i) => (
                                            <li key={i}>✓ {perk}</li>
                                        ))}
                                    </ul>
                                    <div className={`plan-radio ${plan === p.id ? 'checked' : ''}`} />
                                </div>
                            ))}
                        </div>

                        <div className="sub-note">
                            <span>ℹ️</span> {d.subNote}
                        </div>

                        <button className="btn-donate-main" onClick={handleSubscribe}>
                            🔁 {d.subscribe} — ₹{selectedPlan?.amount}/{d.month}
                        </button>
                    </div>
                )}

                {/* Impact strip */}
                <div className="impact-strip">
                    {[
                        { icon: '🍖', stat: '₹50', desc: d.impact.food },
                        { icon: '💊', stat: '₹100', desc: d.impact.medical },
                        { icon: '🏠', stat: '₹500', desc: d.impact.shelter },
                        { icon: '❤️', stat: '₹1000', desc: d.impact.care },
                    ].map((item, i) => (
                        <div key={i} className="impact-item">
                            <span className="impact-icon">{item.icon}</span>
                            <strong>{item.stat}</strong>
                            <small>{item.desc}</small>
                        </div>
                    ))}
                </div>
            </div>

            {showTY && (
                <ThankYouModal
                    mode={tab}
                    amount={finalAmount}
                    cause={d.causes[selectedCause?.key]}
                    plan={`${d.plans[selectedPlan?.amountKey]?.name} ₹${selectedPlan?.amount}/${d.month}`}
                    onClose={() => setShowTY(false)}
                    t={t}
                />
            )}
        </section>
    );
}
