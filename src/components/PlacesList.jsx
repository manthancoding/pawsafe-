import React from 'react';
import './NearbyFinder.css';

export default function PlacesList({ places, onHover, onClick, userLocation, ratingFilter }) {
  // sort by distance if userLocation present
  const sorted = [...places];
  if (userLocation) {
    sorted.sort((a, b) => {
      const da = a.distanceMeters || 0;
      const db = b.distanceMeters || 0;
      return da - db;
    });
  }

  const filtered = ratingFilter ? sorted.filter(p => (p.rating || 0) >= ratingFilter) : sorted;

  return (
    <div className="places-list">
      {filtered.length === 0 && <div className="empty">No places found</div>}
      {filtered.map((p) => (
        <div key={p.place_id || p.id} className="place-item"
          onMouseEnter={() => onHover && onHover(p)}
          onMouseLeave={() => onHover && onHover(null)}
          onClick={() => onClick && onClick(p)}>
          <div className="place-main">
            <div className="place-name">{p.name}</div>
            <div className="place-meta">{p.vicinity || p.formatted_address || ''}</div>
          </div>
          <div className="place-side">
            <div className="rating">{p.rating ? p.rating.toFixed(1) : '—'}</div>
            <div className="distance">{p.distanceMeters ? Math.round(p.distanceMeters) + ' m' : '—'}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
