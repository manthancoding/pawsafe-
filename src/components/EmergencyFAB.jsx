import { useTranslation } from '../utils/LanguageContext';
import './EmergencyFAB.css';

export default function EmergencyFAB({ onEmergency }) {
    const t = useTranslation();
    return (
        <button className="emergency-fab" onClick={onEmergency} aria-label="Report Emergency">
            <span className="fab-icon">🚨</span>
            <span className="fab-text">{t.fab.label}</span>
        </button>
    );
}
