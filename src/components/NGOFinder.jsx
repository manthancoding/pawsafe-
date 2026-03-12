import { useState, useEffect } from 'react';
import { useTranslation } from '../utils/LanguageContext';
import { haversineDistance } from '../utils/geoUtils';
import './NGOFinder.css';

export default function NGOFinder() {
    const t = useTranslation();
    const [userLoc, setUserLoc] = useState(null);
    const [ngos, setNgos] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!navigator.geolocation) {
            setError("Geolocation is not supported by your browser.");
            return;
        }

        setLoading(true);
        navigator.geolocation.getCurrentPosition(
            async (pos) => {
                const lat = pos.coords.latitude;
                const lon = pos.coords.longitude;
                setUserLoc({ lat, lon });

                try {
                    const query = `
                        [out:json];
                        (
                          node["amenity"="animal_shelter"](around:10000,${lat},${lon});
                          way["amenity"="animal_shelter"](around:10000,${lat},${lon});
                          node["amenity"="veterinary"](around:10000,${lat},${lon});
                          way["amenity"="veterinary"](around:10000,${lat},${lon});
                        );
                        out center;
                    `;

                    const response = await fetch("https://overpass-api.de/api/interpreter", {
                        method: "POST",
                        body: query
                    });

                    if (!response.ok) throw new Error("Failed to fetch data");
                    const data = await response.json();

                    if (!data || !data.elements) {
                        setNgos([]);
                        return;
                    }

                    const parsed = data.elements.map(el => {
                        const elLat = el.lat || el.center?.lat;
                        const elLon = el.lon || el.center?.lon;

                        if (!elLat || !elLon) return null;

                        const distMeters = haversineDistance([lat, lon], [elLat, elLon]);
                        const distKm = (distMeters / 1000).toFixed(1);

                        const name = el.tags?.name || (el.tags?.amenity === 'veterinary' ? 'Veterinary Clinic' : 'Animal Shelter');
                        let phone = el.tags?.phone || el.tags?.['contact:phone'] || '';

                        return {
                            id: el.id,
                            name,
                            distanceKm: distKm,
                            distanceVal: distMeters,
                            phone,
                            lat: elLat,
                            lon: elLon,
                            type: el.tags?.amenity
                        };
                    }).filter(Boolean).sort((a, b) => a.distanceVal - b.distanceVal);

                    setNgos(parsed);
                } catch (err) {
                    setError("Could not load nearby facilities.");
                    console.error(err);
                } finally {
                    setLoading(false);
                }
            },
            (err) => {
                console.warn(err);
                setError("Location access denied or unavailable. Please enable location permissions.");
                setLoading(false);
            },
            { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
        );
    }, []);

    return (
        <section className="ngo-finder">
            <div className="container">
                <div className="section-header">
                    <span className="section-tag">🏥 {t.ngo?.tag || 'NGO Directory'}</span>
                    <h2>{t.ngo?.heading || 'Nearby NGOs & Rescue Centres'}</h2>
                    <p className="section-subtitle">
                        {t.ngo?.subtitle || 'Find verified animal shelters, hospitals, and vets within 10km.'}
                    </p>
                </div>

                {loading && (
                    <div className="ngo-empty">
                        <span className="spinner" style={{ display: 'inline-block', margin: '0 auto 15px', borderTopColor: '#0d7377', width: '40px', height: '40px' }}></span>
                        <p>Locating you and finding nearby places...</p>
                    </div>
                )}

                {error && (
                    <div className="ngo-empty">
                        <span>⚠️</span>
                        <p>{error}</p>
                    </div>
                )}

                {!loading && !error && ngos.length === 0 && userLoc && (
                    <div className="ngo-empty">
                        <span>🔍</span>
                        <p>No animal shelters or vets found within 10 km of your location.</p>
                    </div>
                )}

                {!loading && ngos.length > 0 && (
                    <div className="ngo-grid list-mode">
                        {ngos.map(ngo => (
                            <div key={ngo.id} className="ngo-card" style={{ cursor: 'default' }}>
                                <div className="ngo-card-header">
                                    <div className="ngo-avatar">{ngo.type === 'veterinary' ? '🩺' : '🏥'}</div>
                                    <div className="ngo-info">
                                        <h3 className="ngo-name" title={ngo.name}>{ngo.name}</h3>
                                        <p className="ngo-city">{ngo.distanceKm} km away</p>
                                    </div>
                                </div>

                                <div className="ngo-actions-row" style={{ marginTop: '1rem', gridTemplateColumns: 'repeat(2, 1fr)' }}>
                                    {ngo.phone ? (
                                        <a href={`tel:${ngo.phone.replace(/\\s/g, '')}`} className="btn-action btn-call" title="Call Now">
                                            📞 Call
                                        </a>
                                    ) : (
                                        <button className="btn-action btn-call" disabled style={{ opacity: 0.5, cursor: 'not-allowed' }} aria-label="No phone number available">
                                            📞 Unavailable
                                        </button>
                                    )}
                                    <a
                                        href={`https://www.google.com/maps/dir/?api=1&origin=${userLoc.lat},${userLoc.lon}&destination=${ngo.lat},${ngo.lon}`}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="btn-action btn-dir"
                                        title="Get Directions"
                                    >
                                        🗺️ Directions
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}
