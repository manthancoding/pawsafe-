import { useState, useMemo } from 'react';
import { useTranslation } from '../utils/LanguageContext';
import './NGOFinder.css';

const NGOS = [
    {
        id: 1,
        name: 'PawsFirst Rescue',
        city: 'Mumbai',
        rating: 4.9,
        reviews: 312,
        phone: '+91 98200 11223',
        distance: '1.2 km',
        tags: ['24/7', 'Ambulance', 'Wildlife'],
        speciality: 'Stray dogs & cats',
        avatar: '🐶',
    },
    {
        id: 2,
        name: 'Wildlife SOS India',
        city: 'Delhi',
        rating: 4.8,
        reviews: 541,
        phone: '+91 99107 87222',
        distance: '3.5 km',
        tags: ['24/7', 'Wildlife'],
        speciality: 'Wild animal rescues',
        avatar: '🦁',
    },
    {
        id: 3,
        name: 'Happy Tails NGO',
        city: 'Bengaluru',
        rating: 4.7,
        reviews: 198,
        phone: '+91 80123 45678',
        distance: '2.1 km',
        tags: ['Ambulance'],
        speciality: 'Injured street animals',
        avatar: '🐱',
    },
    {
        id: 4,
        name: 'Feather & Fur Care',
        city: 'Chennai',
        rating: 4.6,
        reviews: 134,
        phone: '+91 44987 65432',
        distance: '4.8 km',
        tags: ['24/7', 'Ambulance'],
        speciality: 'Birds & small animals',
        avatar: '🦜',
    },
    {
        id: 5,
        name: 'Green Earth Animal Aid',
        city: 'Hyderabad',
        rating: 4.5,
        reviews: 87,
        phone: '+91 40123 78901',
        distance: '6.0 km',
        tags: ['Wildlife'],
        speciality: 'Reptiles & wildlife',
        avatar: '🐍',
    },
    {
        id: 6,
        name: 'Mumbai Animal Care',
        city: 'Mumbai',
        rating: 4.8,
        reviews: 276,
        phone: '+91 22345 67890',
        distance: '0.8 km',
        tags: ['24/7', 'Ambulance', 'Wildlife'],
        speciality: 'All animals, 24/7 mobile unit',
        avatar: '🚑',
    },
];

const CITIES = [
    'All Cities',
    'Agartala', 'Agra', 'Ahmedabad', 'Aizawl', 'Ajmer', 'Aligarh', 'Allahabad',
    'Alwar', 'Ambala', 'Amravati', 'Amritsar', 'Anantapur', 'Aurangabad',
    'Bareilly', 'Belgaum', 'Bengaluru', 'Bhopal', 'Bhubaneswar', 'Bikaner',
    'Chandigarh', 'Chennai', 'Coimbatore', 'Cuttack',
    'Davanagere', 'Dehradun', 'Delhi', 'Dhanbad', 'Durgapur',
    'Erode', 'Faridabad', 'Firozabad',
    'Gandhinagar', 'Ghaziabad', 'Gorakhpur', 'Guntur', 'Gurgaon', 'Guwahati',
    'Gwalior',
    'Hubballi', 'Hyderabad',
    'Imphal', 'Indore', 'Itanagar',
    'Jabalpur', 'Jaipur', 'Jalandhar', 'Jammu', 'Jamshedpur', 'Jodhpur',
    'Kakinada', 'Kalyan', 'Kanpur', 'Kochi', 'Kohima', 'Kolhapur', 'Kolkata',
    'Kota', 'Kozhikode', 'Kurnool',
    'Lucknow', 'Ludhiana',
    'Madurai', 'Mangaluru', 'Meerut', 'Mumbai', 'Mysuru',
    'Nagpur', 'Nashik', 'Navi Mumbai', 'Noida',
    'Panaji', 'Patna', 'Pimpri-Chinchwad', 'Puducherry', 'Pune',
    'Raipur', 'Rajkot', 'Ranchi', 'Rohtak',
    'Salem', 'Shillong', 'Shimla', 'Silchar', 'Siliguri', 'Srinagar', 'Surat',
    'Thane', 'Thiruvananthapuram', 'Tiruchirappalli', 'Tirunelveli',
    'Udaipur', 'Ujjain',
    'Vadodara', 'Varanasi', 'Vijayawada', 'Visakhapatnam',
    'Warangal',
];

function StarRating({ rating }) {
    return (
        <span className="stars">
            {[1, 2, 3, 4, 5].map(i => (
                <span key={i} className={i <= Math.round(rating) ? 'star filled' : 'star'}>★</span>
            ))}
        </span>
    );
}

function NGOCard({ ngo, t }) {
    return (
        <div className="ngo-card">
            <div className="ngo-card-header">
                <div className="ngo-avatar">{ngo.avatar}</div>
                <div className="ngo-info">
                    <h3 className="ngo-name">{ngo.name}</h3>
                    <p className="ngo-city">📍 {ngo.city}</p>
                </div>
                <div className="ngo-distance-badge">{ngo.distance}</div>
            </div>

            <p className="ngo-speciality">{ngo.speciality}</p>

            <div className="ngo-rating-row">
                <StarRating rating={ngo.rating} />
                <span className="rating-value">{ngo.rating}</span>
                <span className="rating-count">({ngo.reviews} {t.ngo.reviews})</span>
            </div>

            <div className="ngo-tags">
                {ngo.tags.map(tag => (
                    <span key={tag} className={`ngo-tag tag-${tag.replace('/', '').replace(' ', '').toLowerCase()}`}>
                        {tag === '24/7' ? '🕐 24/7' : tag === 'Ambulance' ? '🚑 Ambulance' : '🦁 Wildlife'}
                    </span>
                ))}
            </div>

            <div className="ngo-contact">
                <span className="ngo-phone">📞 {ngo.phone}</span>
            </div>

            <a href={`tel:${ngo.phone.replace(/\s/g, '')}`} className="btn-call-now">
                📞 {t.ngo.callNow}
            </a>
        </div>
    );
}

export default function NGOFinder() {
    const t = useTranslation();
    const [city, setCity] = useState('All Cities');
    const [only247, setOnly247] = useState(false);
    const [ambulance, setAmbulance] = useState(false);
    const [wildlife, setWildlife] = useState(false);

    const filtered = useMemo(() => {
        return NGOS.filter(ngo => {
            if (city !== 'All Cities' && ngo.city !== city) return false;
            if (only247 && !ngo.tags.includes('24/7')) return false;
            if (ambulance && !ngo.tags.includes('Ambulance')) return false;
            if (wildlife && !ngo.tags.includes('Wildlife')) return false;
            return true;
        });
    }, [city, only247, ambulance, wildlife]);

    return (
        <section className="ngo-finder">
            <div className="container">
                <div className="section-header">
                    <span className="section-tag">🏥 {t.ngo.tag}</span>
                    <h2>{t.ngo.heading}</h2>
                    <p className="section-subtitle">{t.ngo.subtitle}</p>
                </div>

                {/* Filter Bar */}
                <div className="filter-bar">
                    <div className="filter-group">
                        <label className="filter-label">🌆 {t.ngo.filterCity}</label>
                        <select
                            className="filter-select"
                            value={city}
                            onChange={e => setCity(e.target.value)}
                        >
                            {CITIES.map(c => <option key={c}>{c}</option>)}
                        </select>
                    </div>

                    <div className="filter-toggles">
                        {[
                            { key: 'only247', state: only247, set: setOnly247, label: t.ngo.filter247, icon: '🕐' },
                            { key: 'ambulance', state: ambulance, set: setAmbulance, label: t.ngo.filterAmbulance, icon: '🚑' },
                            { key: 'wildlife', state: wildlife, set: setWildlife, label: t.ngo.filterWildlife, icon: '🦁' },
                        ].map(({ key, state, set, label, icon }) => (
                            <button
                                key={key}
                                className={`filter-toggle ${state ? 'active' : ''}`}
                                onClick={() => set(s => !s)}
                            >
                                {icon} {label}
                            </button>
                        ))}
                    </div>

                    <span className="filter-count">{filtered.length} {t.ngo.found}</span>
                </div>

                {/* Grid */}
                {filtered.length > 0 ? (
                    <div className="ngo-grid">
                        {filtered.map(ngo => (
                            <NGOCard key={ngo.id} ngo={ngo} t={t} />
                        ))}
                    </div>
                ) : (
                    <div className="ngo-empty">
                        <span>🔍</span>
                        <p>{t.ngo.noResults}</p>
                    </div>
                )}
            </div>
        </section>
    );
}
