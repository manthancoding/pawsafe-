import { MapContainer, TileLayer, Marker, Popup, useMap, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect } from 'react';

// Marker Icons
const volunteerIcon = L.divIcon({
    className: 'custom-marker volunteer-marker',
    html: '<div style="background-color: #0d7377; width: 24px; height: 24px; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 10px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center; font-size: 14px;">🧑‍🚒</div>',
    iconSize: [24, 24],
    iconAnchor: [12, 12]
});

const rescueIcon = L.divIcon({
    className: 'custom-marker rescue-marker',
    html: '<div style="background-color: #e53935; width: 24px; height: 24px; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 10px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center; font-size: 14px;">🆘</div>',
    iconSize: [24, 24],
    iconAnchor: [12, 12]
});

function ChangeView({ center, zoom }) {
    const map = useMap();
    useEffect(() => {
        if (center) {
            map.setView(center, zoom);
            map.invalidateSize();
        }
    }, [center, zoom, map]);
    return null;
}

export default function RescueProgressMap({ volunteerLoc, rescueLoc, height = '300px' }) {
    const vPos = volunteerLoc ? [volunteerLoc.lat, volunteerLoc.lng] : null;
    const rPos = rescueLoc ? [rescueLoc.lat, rescueLoc.lng] : null;

    // Default center if no locations
    const center = vPos || rPos || [19.076, 72.877];
    const polyline = (vPos && rPos) ? [vPos, rPos] : [];

    return (
        <div style={{ height, width: '100%', borderRadius: '12px', overflow: 'hidden', border: '1.5px solid rgba(13, 115, 119, 0.2)' }}>
            <MapContainer center={center} zoom={15} style={{ height: '100%', width: '100%' }} zoomControl={false}>
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                <ChangeView center={center} zoom={15} />

                {vPos && (
                    <Marker position={vPos} icon={volunteerIcon}>
                        <Popup>Volunteer Location</Popup>
                    </Marker>
                )}

                {rPos && (
                    <Marker position={rPos} icon={rescueIcon}>
                        <Popup>Rescue Location</Popup>
                    </Marker>
                )}

                {polyline.length > 0 && (
                    <Polyline positions={polyline} color="#0d7377" weight={3} dashArray="5, 10" opacity={0.6} />
                )}
            </MapContainer>
        </div>
    );
}
