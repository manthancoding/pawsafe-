import React, { useEffect, useMemo, useState, useRef, useCallback } from 'react';
import debounce from '../utils/debounce';
import MapView from './MapView';
import PlacesList from './PlacesList';
import { haversineDistance, cacheGet, cacheSet } from '../utils/geoUtils';
import './NearbyFinder.css';

const DEFAULT_RADIUS = 2000;
const DEFAULT_TYPE = 'restaurant';

export default function NearbyFinder() {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  const [userPos, setUserPos] = useState(null);
  const [loadingLocation, setLoadingLocation] = useState(true);
  const [places, setPlaces] = useState([]);
  const [loadingPlaces, setLoadingPlaces] = useState(false);
  const [type, setType] = useState(DEFAULT_TYPE);
  const [ratingFilter, setRatingFilter] = useState(0);
  const [error, setError] = useState(null);
  const [highlighted, setHighlighted] = useState(null);

  const placesServiceRef = useRef(null);

  // request geolocation on mount
  useEffect(() => {
    setLoadingLocation(true);
    if (!navigator.geolocation) {
      setError('Geolocation not supported');
      setLoadingLocation(false);
      return;
    }

    // Check if we already have a location overridden in sessionStorage
    const savedLoc = sessionStorage.getItem('pawsafe_manual_location');
    if (savedLoc) {
      try {
        const parsed = JSON.parse(savedLoc);
        setUserPos(parsed);
        setLoadingLocation(false);
        return;
      } catch (e) { }
    }

    navigator.geolocation.getCurrentPosition((pos) => {
      // Browser might give IP-based location which is inaccurate in India (e.g. shows West Bengal for Jamshedpur)
      const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
      setUserPos(coords);
      setLoadingLocation(false);
    }, (err) => {
      setError('Location access denied or unavailable');
      setLoadingLocation(false);
    }, { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 });
  }, []);

  // prepare a cached, debounced fetchNearby
  const fetchNearby = useCallback(async (loc, placeType) => {
    if (!loc) return;
    setLoadingPlaces(true);
    setError(null);
    const cacheKey = `nearby_${loc.lat.toFixed(4)}_${loc.lng.toFixed(4)}_${placeType}`;
    const cached = cacheGet(cacheKey);
    if (cached) {
      setPlaces(cached);
      setLoadingPlaces(false);
      return;
    }

    try {
      // Use Google Maps JS PlacesService via dynamic loader
      // create a temporary DOM node for service if needed
      const mapDiv = document.createElement('div');
      const map = new window.google.maps.Map(mapDiv);
      const service = new window.google.maps.places.PlacesService(map);
      const request = {
        location: new window.google.maps.LatLng(loc.lat, loc.lng),
        radius: DEFAULT_RADIUS,
        type: placeType
      };

      service.nearbySearch(request, (results, status) => {
        if (status !== window.google.maps.places.PlacesServiceStatus.OK) {
          setError('Places search failed: ' + status);
          setPlaces([]);
          setLoadingPlaces(false);
          return;
        }

        // compute distance and add distanceMeters
        const enriched = results.map(r => {
          const d = haversineDistance([loc.lat, loc.lng], [r.geometry.location.lat(), r.geometry.location.lng()]);
          return { ...r, distanceMeters: d };
        });
        cacheSet(cacheKey, enriched, 1000 * 60 * 5);
        setPlaces(enriched);
        setLoadingPlaces(false);
      });
    } catch (e) {
      setError('Places error: ' + e.message);
      setLoadingPlaces(false);
    }
  }, []);

  // debounce to prevent excessive calls
  const debouncedFetch = useMemo(() => debounce(fetchNearby, 600), [fetchNearby]);

  // trigger when userPos or type changes
  useEffect(() => {
    if (!userPos) return;
    if (!window.google || !window.google.maps) {
      // load via loader if not present
      // The MapView component also loads the script; ensure it is loaded before places queries
      const interval = setInterval(() => {
        if (window.google && window.google.maps) {
          clearInterval(interval);
          debouncedFetch(userPos, type);
        }
      }, 200);
      return () => clearInterval(interval);
    }
    debouncedFetch(userPos, type);
    return () => debouncedFetch.cancel();
  }, [userPos, type, debouncedFetch]);

  const onMarkerClick = (place) => {
    // When marker clicked, highlights in list
    setHighlighted(place.place_id || place.id);
  };

  const onListHover = (place) => {
    setHighlighted(place ? (place.place_id || place.id) : null);
  };

  const onListClick = (place) => {
    // center map on place
    if (place && place.geometry && place.geometry.location) {
      const coords = { lat: place.geometry.location.lat(), lng: place.geometry.location.lng() };
      const evt = new CustomEvent('pawsafe:centerMap', { detail: coords });
      window.dispatchEvent(evt);
    }
  };

  const requestManualLocation = () => {
    const loc = window.prompt("Enter your city or area (e.g. Jamshedpur):");
    if (!loc) return;

    setLoadingLocation(true);
    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ address: loc }, (results, status) => {
      if (status === 'OK' && results[0]) {
        const coords = {
          lat: results[0].geometry.location.lat(),
          lng: results[0].geometry.location.lng()
        };
        sessionStorage.setItem('pawsafe_manual_location', JSON.stringify(coords));
        setUserPos(coords);
        setLoadingLocation(false);
      } else {
        alert("Could not find that location. Please try again.");
        setLoadingLocation(false);
      }
    });
  };

  return (
    <div className="nearby-root">
      <div className="controls">
        <div className="control-row">
          <label>Category</label>
          <select value={type} onChange={e => setType(e.target.value)}>
            <option value="restaurant">Restaurant</option>
            <option value="hospital">Hospital</option>
            <option value="atm">ATM</option>
            <option value="pharmacy">Pharmacy</option>
            <option value="parking">Parking</option>
            <option value="police">Police</option>
          </select>
        </div>

        <div className="control-row">
          <label>Min Rating</label>
          <select value={ratingFilter} onChange={e => setRatingFilter(Number(e.target.value))}>
            <option value={0}>Any</option>
            <option value={3}>3+</option>
            <option value={4}>4+</option>
            <option value={4.5}>4.5+</option>
          </select>
        </div>

        <div className="control-row">
          <label>Radius</label>
          <div className="muted">{DEFAULT_RADIUS} m</div>
        </div>
      </div>

      <div className="main">
        <div className="map-panel">
          {loadingLocation && <div className="skeleton">Acquiring location…</div>}
          {!loadingLocation && !userPos && (
            <div className="fallback">
              Location denied or unavailable.
              <button onClick={() => requestManualLocation()} className="btn btn-secondary btn-small" style={{ marginLeft: '10px' }}>
                Enter Manually
              </button>
            </div>
          )}
          {!loadingLocation && userPos && (
            <div style={{ position: 'absolute', top: '10px', right: '10px', zIndex: 1000 }}>
              <button onClick={() => requestManualLocation()} className="btn btn-secondary btn-small" style={{ background: 'white', color: 'black', padding: '5px 10px', borderRadius: '4px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                Wrong Location? Fix it
              </button>
            </div>
          )}

          <MapView apiKey={apiKey} center={userPos} places={places} onMarkerClick={onMarkerClick} highlightedPlaceId={highlighted} />
        </div>

        <aside className="list-panel">
          <div className="panel-header">
            <h3>Nearby Places</h3>
            <div className="sub">{loadingPlaces ? 'Loading…' : `${places.length} results`}</div>
          </div>

          {loadingPlaces ? (
            <div className="list-skeleton">Loading places…</div>
          ) : (
            <PlacesList places={places} onHover={onListHover} onClick={onListClick} userLocation={userPos} ratingFilter={ratingFilter} />
          )}

          {error && <div className="error">{error}</div>}
        </aside>
      </div>
    </div>
  );
}
