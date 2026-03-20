import { MapContainer, TileLayer, Marker, Popup, useMap, Polyline, Tooltip } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
import { useEffect, useRef } from 'react';
import { haversineDistance } from '../utils/geoUtils';
import './NearbyFinder.css';


// Fix for default marker icons in Leaflet with Webpack/Vite
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

// Custom user icon
const userIcon = L.divIcon({
  className: 'custom-user-marker',
  html: '<div style="background-color: #FF6B6B; width: 18px; height: 18px; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 5px rgba(0,0,0,0.3);"></div>',
  iconSize: [18, 18],
  iconAnchor: [9, 9]
});

function MapController({ center, destination, zoom, onRouteFound }) {
  const map = useMap();
  const routingControlRef = useRef(null);

  useEffect(() => {
    if (center) {
      map.flyTo([center.lat, center.lng || center.lon], zoom || map.getZoom());
      // Fix for grey squares - force Leaflet to recalculate container size
      const timer = setTimeout(() => {
        if (map && map._container) {
          map.invalidateSize();
        }
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [center, zoom, map]);

  useEffect(() => {
    if (!center || !destination) {
      if (routingControlRef.current) {
        map.removeControl(routingControlRef.current);
        routingControlRef.current = null;
      }
      return;
    }

    if (routingControlRef.current) {
      map.removeControl(routingControlRef.current);
    }

    routingControlRef.current = L.Routing.control({
      waypoints: [
        L.latLng(center.lat, center.lng || center.lon),
        L.latLng(destination.lat, destination.lng || destination.lon)
      ],
      lineOptions: {
        styles: [
          { color: '#000', opacity: 0.15, weight: 12 }, // Shadow/Glow
          { color: '#FF4757', opacity: 1, weight: 6 }    // Main Highlighted Path
        ]
      },
      router: L.Routing.osrmv1({
        // LocationIQ uses a specific OSRM endpoint structure
        serviceUrl: `https://eu1.locationiq.com/v1/directions/driving/`,
        profile: 'driving',
        useHints: false,
        requestParameters: {
          key: import.meta.env.VITE_LOCATIONIQ_API_KEY
        }
      }),
      routeWhileDragging: false,
      addWaypoints: false,
      draggableWaypoints: false,
      fitSelectedRoutes: true,
      show: false // Hide text instructions
    }).addTo(map);

    routingControlRef.current.on('routesfound', (e) => {
      const routes = e.routes;
      if (routes && routes[0] && onRouteFound) {
        const summary = routes[0].summary;
        const instructions = routes[0].instructions.map(instr => ({
          text: instr.text,
          distance: instr.distance,
          type: instr.type
        }));

        onRouteFound({
          distance: (summary.totalDistance / 1000).toFixed(1),
          time: Math.round(summary.totalTime / 60),
          instructions: instructions
        });
      }
    });

    return () => {
      if (routingControlRef.current) {
        map.removeControl(routingControlRef.current);
      }
    };
  }, [center, destination, map]);

  return null;
}

/*
 MapView creates the OpenStreetMap using Leaflet.
 Props:
 - center: {lat, lng}
 - places: array (each with lat, lon/lng, name, type, etc)
 - onMarkerClick(place): callback when marker clicked
 - highlightedPlaceId: id to highlight marker
*/
export default function MapView({ center, places, onMarkerClick, highlightedPlaceId, destination, onLocationChange, onRouteFound }) {
  const mapCenter = center ? [center.lat, center.lng || center.lon] : [0, 0];
  const markerRef = useRef(null);

  const eventHandlers = {
    dragend() {
      const marker = markerRef.current;
      if (marker != null) {
        const newPos = marker.getLatLng();
        if (onLocationChange) {
          onLocationChange({ lat: newPos.lat, lng: newPos.lng });
        }
      }
    },
  };

  return (
    <MapContainer
      center={mapCenter}
      zoom={18}
      className="map-container"
      style={{ height: '100%', width: '100%' }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        crossOrigin={true}
      />

      <MapController center={center} destination={destination} zoom={18} onRouteFound={onRouteFound} />

      {center && (

        <Marker
          position={[center.lat, center.lng || center.lon]}
          icon={userIcon}
          draggable={true}
          eventHandlers={eventHandlers}
          ref={markerRef}
        >
          <Popup>You are here (Drag to adjust)</Popup>
        </Marker>
      )}

      {places.map((place) => {
        const lat = place.latitude || place.lat || (place.geometry?.location?.lat ? place.geometry.location.lat() : null);
        const lng = place.longitude || place.lon || place.lng || (place.geometry?.location?.lng ? place.geometry.location.lng() : null);

        if (!lat || !lng) return null;

        const isHighlighted = (place.place_id || place.id) === highlightedPlaceId;

        return (
          <Marker
            key={place.place_id || place.id || Math.random()}
            position={[lat, lng]}
            eventHandlers={{
              click: () => onMarkerClick && onMarkerClick(place),
            }}
          >
            <Popup>
              <div style={{ maxWidth: '240px' }}>
                <h3 style={{ margin: 0 }}>{place.name}</h3>
                <p style={{ margin: '0.25rem 0' }}>
                  <strong>Distance:</strong> {place.distanceKm || (place.distanceMeters ? (place.distanceMeters / 1000).toFixed(1) : '?')} km
                </p>
                <a
                  target='_blank'
                  rel='noreferrer'
                  href={`https://www.google.com/maps/dir/?api=1&origin=${center?.lat},${center?.lng || center?.lon}&destination=${lat},${lng}`}
                >
                  Get Directions
                </a>
              </div>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
}
