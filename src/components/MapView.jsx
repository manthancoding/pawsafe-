import { useEffect, useRef } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import { MarkerClusterer } from '@googlemaps/markerclusterer';
import './NearbyFinder.css';

/*
 MapView creates the Google Map, adds user marker and place markers.
 Props:
 - apiKey: string
 - center: {lat, lng}
 - places: array (each with geometry.location, name, rating, vicinity)
 - onMarkerClick(place): callback when marker clicked
 - highlightedPlaceId: id to highlight marker from list hover
*/
export default function MapView({ apiKey, center, places, onMarkerClick, highlightedPlaceId }) {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const markersRef = useRef([]);
  const clusterRef = useRef(null);
  const userMarkerRef = useRef(null);

  useEffect(() => {
    if (!apiKey) return;
    const loader = new Loader({ apiKey, version: 'weekly', libraries: ['places'] });
    let mounted = true;
    loader.load().then(() => {
      if (!mounted) return;
      mapInstance.current = new window.google.maps.Map(mapRef.current, {
        center: center || { lat: 0, lng: 0 },
        zoom: 14,
        disableDefaultUI: true,
        gestureHandling: 'greedy'
      });
    }).catch((err) => {
      console.error('Google Maps load error', err);
    });
    return () => { mounted = false; };
  }, [apiKey]);

  // set or move user marker
  useEffect(() => {
    const map = mapInstance.current;
    if (!map || !center) return;
    if (!userMarkerRef.current) {
      userMarkerRef.current = new window.google.maps.Marker({
        position: center,
        map,
        title: 'You are here',
        icon: {
          path: window.google.maps.SymbolPath.CIRCLE,
          scale: 9,
          fillColor: '#FF6B6B',
          fillOpacity: 1,
          strokeColor: '#fff',
          strokeWeight: 2
        }
      });
      map.panTo(center);
    } else {
      userMarkerRef.current.setPosition(center);
      map.panTo(center);
    }
  }, [center]);

  // update place markers
  useEffect(() => {
    const map = mapInstance.current;
    if (!map) return;

    // clear existing markers
    markersRef.current.forEach(m => m.marker && m.marker.setMap(null));
    markersRef.current = [];
    if (clusterRef.current) {
      clusterRef.current.clearMarkers();
    }

    const newMarkers = places.map((place) => {
      const position = place.geometry.location;
      const marker = new window.google.maps.Marker({
        position,
        map,
        title: place.name,
        icon: undefined
      });

      const info = new window.google.maps.InfoWindow({
        content: `<div style="max-width:240px"><h3 style='margin:0'>${place.name}</h3>
          <p style='margin:.25rem 0'><strong>Rating:</strong> ${place.rating || '—'}</p>
          <p style='margin:.25rem 0'><strong>Address:</strong> ${place.vicinity || place.formatted_address || '—'}</p>
          <a target='_blank' rel='noreferrer' href='https://www.google.com/maps/dir/?api=1&origin=${center.lat},${center.lng}&destination=${position.lat()},${position.lng()}'>Get Directions</a>
          </div>`
      });

      marker.addListener('click', () => {
        info.open({ map, anchor: marker });
        onMarkerClick && onMarkerClick(place);
      });

      return { id: place.place_id || place.id || Math.random(), marker, info, place };
    });

    markersRef.current = newMarkers;

    // clustering
    const markerObjs = newMarkers.map(m => m.marker);
    clusterRef.current = new MarkerClusterer({ markers: markerObjs, map });

    return () => {
      newMarkers.forEach(m => m.marker.setMap(null));
      if (clusterRef.current) clusterRef.current.clearMarkers();
    };
  }, [places, center, onMarkerClick]);

  // highlight marker when hovered from list
  useEffect(() => {
    if (!highlightedPlaceId) return;
    const item = markersRef.current.find(m => m.id === highlightedPlaceId);
    if (item) {
      // pulse animation using bounce briefly
      item.marker.setAnimation(window.google.maps.Animation.BOUNCE);
      setTimeout(() => item.marker.setAnimation(null), 700);
    }
  }, [highlightedPlaceId]);

  return <div className="map-container" ref={mapRef} />;
}
