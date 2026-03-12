import { useState, useEffect, useRef } from 'react';
import { useTranslation } from '../utils/LanguageContext';
import { statsApi } from '../utils/api';
import { getGlobalImpactStatsOffsets } from '../utils/counterUtils';
import './RescueCounter.css';

// Animate a number from 0 to target
function useCountUp(target, duration = 2000, start = false) {
    const [count, setCount] = useState(0);
    const safeTarget = Number(target) || 0; // Prevent NaN

    useEffect(() => {
        if (!start || safeTarget === 0) {
            setCount(safeTarget);
            return;
        }

        let startTime = null;
        let animationFrame;

        const step = (timestamp) => {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / duration, 1);
            // Ease-out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(eased * safeTarget));
            if (progress < 1) {
                animationFrame = requestAnimationFrame(step);
            }
        };
        animationFrame = requestAnimationFrame(step);

        return () => {
            if (animationFrame) {
                cancelAnimationFrame(animationFrame);
            }
        };
    }, [safeTarget, duration, start]);

    return count;
}

function StatCard({ icon, label, target, suffix = '', color }) {
    const [visible, setVisible] = useState(false);
    const ref = useRef(null);
    const count = useCountUp(target, 2200, visible);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => { if (entry.isIntersecting) setVisible(true); },
            { threshold: 0.3 }
        );
        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, []);

    const formatted = count >= 1000 ? count.toLocaleString() : count;

    return (
        <div className="stat-card" ref={ref} style={{ '--card-accent': color }}>
            <div className="stat-icon">{icon}</div>
            <div className="stat-number">
                {formatted}{suffix}
                <span className="stat-pulse" />
            </div>
            <div className="stat-label">{label}</div>
            <div className="stat-bar">
                <div className="stat-bar-fill" style={{ width: visible ? '100%' : '0%' }} />
            </div>
        </div>
    );
}

export default function RescueCounter() {
    const t = useTranslation();
    const s = t.stats || {
        live: 'LIVE',
        heading: 'Live Rescue Counter',
        subtitle: 'Real-time impact across our network',
        rescued: 'ANIMALS RESCUED TODAY',
        active: 'ACTIVE RESCUE REQUESTS',
        ngos: 'VERIFIED NGOS',
        volunteers: 'ACTIVE VOLUNTEERS'
    };

    // Calculate random fallback values shown while loading or if backend unavailable
    const [stats, setStats] = useState({
        rescued: 1400 + Math.floor(Math.random() * 200),
        active: 20 + Math.floor(Math.random() * 30),
        ngos: 200 + Math.floor(Math.random() * 50),
        volunteers: 3800 + Math.floor(Math.random() * 300)
    });

    useEffect(() => {
        const offsets = getGlobalImpactStatsOffsets();

        statsApi.get()
            .then((data) => {
                if (data && Object.keys(data).length > 0) {
                    setStats((prev) => ({
                        rescued: (data.totalRescued || prev.rescued) + offsets.rescued,
                        active: (data.pendingRescue || prev.active) + offsets.active,
                        ngos: data.ngos || prev.ngos,
                        volunteers: data.volunteers || prev.volunteers
                    }));
                }
            })
            .catch((err) => {
                console.error("Failed to load stats, using random fallback values.", err);
                setStats((prev) => ({
                    ...prev,
                    rescued: prev.rescued + offsets.rescued,
                    active: prev.active + offsets.active
                }));
            });
    }, []);

    const cards = [
        { icon: '🐶', label: s.rescued, target: stats.rescued, suffix: '+', color: '#0d7377' },
        { icon: '🚑', label: s.active, target: stats.active, suffix: '', color: '#e53935' },
        { icon: '🏥', label: s.ngos, target: stats.ngos, suffix: '+', color: '#7b1fa2' },
        { icon: '👥', label: s.volunteers, target: stats.volunteers, suffix: '+', color: '#f57c00' },
    ];

    return (
        <section className="rescue-counter">
            <div className="container">
                <div className="counter-header">
                    <span className="live-badge">🔴 {s.live}</span>
                    <h2>{s.heading}</h2>
                    <p className="section-subtitle">{s.subtitle}</p>
                </div>
                <div className="stats-grid">
                    {cards.map((card, i) => (
                        <StatCard key={i} {...card} />
                    ))}
                </div>
            </div>
        </section>
    );
}
