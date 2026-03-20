import { useState, useEffect } from 'react';
import { emergencyApi, ngoApi } from '../utils/api';
import MapView from './MapView';
import './EmergencyForm.css';

export default function EmergencyForm({ onClose, user }) {
  const [formData, setFormData] = useState({
    animalType: '',
    issueType: '',
    location: '',
    latitude: '',
    longitude: '',
    details: '',
    name: '',
    phone: '',
    photo: null
  });
  const [ngos, setNgos] = useState([]);
  const [nearestNgo, setNearestNgo] = useState(null);

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [gpsLoading, setGpsLoading] = useState(true);

  // Auto-capture GPS and fetch NGOs on component mount
  useEffect(() => {
    captureLocationAuto();
    ngoApi.getAll().then(setNgos).catch(console.error);
  }, []);

  const reverseGeocode = async (lat, lng) => {
    try {
      const apiKey = import.meta.env.VITE_LOCATIONIQ_API_KEY;
      const response = await fetch(
        `https://us1.locationiq.com/v1/reverse?key=${apiKey}&lat=${lat}&lon=${lng}&format=json`
      );
      const data = await response.json();
      if (data && data.display_name) {
        setFormData(prev => ({ ...prev, location: data.display_name }));
      }
    } catch (error) {
      console.error("Reverse geocoding error:", error);
    }
  };

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  useEffect(() => {
    if (formData.latitude && formData.longitude && ngos.length > 0) {
      const lat = parseFloat(formData.latitude);
      const lng = parseFloat(formData.longitude);

      let minDistance = Infinity;
      let closest = null;

      ngos.forEach(ngo => {
        if (ngo.latitude && ngo.longitude) {
          const d = calculateDistance(lat, lng, ngo.latitude, ngo.longitude);
          if (d < minDistance) {
            minDistance = d;
            closest = ngo;
          }
        }
      });
      setNearestNgo(closest);
    }
  }, [formData.latitude, formData.longitude, ngos]);

  const captureLocationAuto = () => {
    setGpsLoading(true);

    const savedLoc = sessionStorage.getItem('pawsafe_manual_location');
    if (savedLoc) {
      try {
        const parsed = JSON.parse(savedLoc);
        setFormData(prev => ({
          ...prev,
          latitude: parsed.lat.toFixed(6),
          longitude: parsed.lng.toFixed(6)
        }));
        setGpsLoading(false);
        return;
      } catch (e) { }
    }

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude.toFixed(6);
          const lng = position.coords.longitude.toFixed(6);
          setFormData(prev => ({
            ...prev,
            latitude: lat,
            longitude: lng
          }));
          setGpsLoading(false);
          reverseGeocode(lat, lng);
        },
        () => {
          console.log('Location access needed');
          setGpsLoading(false);
          setFormData(prev => ({ ...prev, latitude: '', longitude: '' })); // Ensure empty so UI reacts
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    } else {
      setGpsLoading(false);
    }
  };

  const requestManualLocation = async () => {
    const loc = window.prompt("Enter your city or area (e.g. Jamshedpur):");
    if (!loc) return;

    setGpsLoading(true);
    try {
      const apiKey = import.meta.env.VITE_LOCATIONIQ_API_KEY;
      const response = await fetch(
        `https://us1.locationiq.com/v1/search?key=${apiKey}&q=${encodeURIComponent(loc)}&format=json`
      );
      const results = await response.json();

      if (results && results.length > 0) {
        const firstResult = results[0];
        const coords = {
          lat: parseFloat(firstResult.lat),
          lng: parseFloat(firstResult.lon)
        };
        sessionStorage.setItem('pawsafe_manual_location', JSON.stringify(coords));
        setFormData(prev => ({
          ...prev,
          latitude: coords.lat.toFixed(6),
          longitude: coords.lng.toFixed(6)
        }));
        reverseGeocode(coords.lat.toFixed(6), coords.lng.toFixed(6));
      } else {
        alert("Could not find that location. Please try again.");
      }
    } catch (error) {
      console.error("Geocoding error:", error);
      alert("Search failed. Please try again later.");
    } finally {
      setGpsLoading(false);
    }
  };

  const handleLocationChange = ({ lat, lng }) => {
    const latStr = lat.toFixed(6);
    const lngStr = lng.toFixed(6);
    setFormData(prev => ({
      ...prev,
      latitude: latStr,
      longitude: lngStr
    }));
    reverseGeocode(latStr, lngStr);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    setFormData(prev => ({
      ...prev,
      photo: e.target.files[0]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate required fields
    if (!formData.animalType || !formData.issueType || !formData.name || !formData.phone) {
      alert('Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      const payload = new FormData();
      payload.append('animalType', formData.animalType);
      payload.append('issueType', formData.issueType);
      payload.append('location', formData.location);
      payload.append('urgency', 'moderate');
      payload.append('latitude', formData.latitude || '');
      payload.append('longitude', formData.longitude || '');
      payload.append('details', formData.details);
      payload.append('name', formData.name);
      payload.append('phone', formData.phone);
      payload.append('reportedBy', user?.id || 'anonymous');
      if (formData.photo) payload.append('photo', formData.photo);

      const result = await emergencyApi.submit(payload);
      setLoading(false);
      setSubmitted(true);

      if (result && result.id) {
        setTimeout(() => {
          onClose();
          window.location.href = `/rescue/${result.id}`;
        }, 2000);
      } else {
        setTimeout(() => onClose(), 3000);
      }
    } catch (err) {
      console.error('Emergency submission failed:', err);
      alert('Failed to submit emergency. Please try calling directly.');
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <section className="emergency-form-container">
        <div className="success-message">
          <div className="success-icon">✓</div>
          <h2>Emergency Reported!</h2>
          <p>Rescue teams have been alerted immediately.</p>
          <p>Rescuer will contact: <strong>{formData.phone}</strong></p>
          <div className="success-info">
            <p>🚑 Response time: ~10 min</p>
            <p>📍 Location locked & shared</p>
          </div>
          <button className="btn btn-primary" onClick={onClose}>Done</button>
        </div>
      </section>
    );
  }

  return (
    <section className="emergency-form-container">
      <div className="form-wrapper">
        <button className="close-btn" onClick={onClose}>✕</button>

        <h1>🚨 Emergency Report</h1>
        <p className="form-subtitle">Quick response saves lives</p>

        <form onSubmit={handleSubmit} className="emergency-form">
          {/* Quick Select Section */}
          <div className="quick-section">
            <label>Animal Type <span className="required">*</span></label>
            <div className="quick-buttons">
              {['Dog', 'Cat', 'Bird', 'Rabbit', 'Other'].map(type => (
                <button
                  key={type}
                  type="button"
                  className={`quick-btn ${formData.animalType === type.toLowerCase() ? 'active' : ''}`}
                  onClick={() => setFormData(prev => ({ ...prev, animalType: type.toLowerCase() }))}
                >
                  {type === 'Dog' && '🐕'}
                  {type === 'Cat' && '🐈'}
                  {type === 'Bird' && '🐦'}
                  {type === 'Rabbit' && '🐰'}
                  {type === 'Other' && '🦁'}
                  <span>{type}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="quick-section">
            <label>Issue Type <span className="required">*</span></label>
            <div className="quick-buttons">
              {['Injured', 'Trapped', 'Lost', 'Abandoned', 'Other'].map(type => (
                <button
                  key={type}
                  type="button"
                  className={`quick-btn ${formData.issueType === type.toLowerCase() ? 'active' : ''}`}
                  onClick={() => setFormData(prev => ({ ...prev, issueType: type.toLowerCase() }))}
                >
                  {type === 'Injured' && '🩹'}
                  {type === 'Trapped' && '🔒'}
                  {type === 'Lost' && '🔍'}
                  {type === 'Abandoned' && '😢'}
                  {type === 'Other' && '❓'}
                  <span>{type}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="gps-status">
            <div className={`gps-indicator ${(gpsLoading || !formData.latitude) ? 'loading' : 'ready'} ${(!gpsLoading && !formData.latitude) ? 'error' : ''}`}>
              {gpsLoading ? '📍 Capturing GPS...' : (formData.latitude ? '📍 GPS Locked' : '📍 Location Access Needed')}
            </div>

            {(!gpsLoading && !formData.latitude) && (
              <div className="gps-fallback-hint">
                <p>We couldn't get your precise location. Please search for your area manually or drag the red marker on the map.</p>
              </div>
            )}

            <div className="map-preview-container">
              <MapView
                center={{
                  lat: parseFloat(formData.latitude) || 19.0760,
                  lng: parseFloat(formData.longitude) || 72.8777
                }}
                places={ngos}
                destination={nearestNgo}
                onLocationChange={handleLocationChange}
              />
            </div>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <button
                type="button"
                className="btn btn-secondary btn-small"
                onClick={captureLocationAuto}
              >
                🔄 Refresh Location
              </button>
              <button
                type="button"
                className="btn btn-secondary btn-small"
                onClick={requestManualLocation}
              >
                ✏️ Enter Manually
              </button>
            </div>
          </div>

          {/* Location Details */}
          <div className="form-group">
            <label>Location Details</label>
            <input
              type="text"
              name="location"
              placeholder="Street address or landmark (optional)"
              value={formData.location}
              onChange={handleChange}
            />
          </div>

          {/* Details */}
          <div className="form-group">
            <label>Quick Details <span className="required">*</span></label>
            <textarea
              name="details"
              placeholder="Injuries, behavior, appearance..."
              rows="3"
              value={formData.details}
              onChange={handleChange}
              required
            ></textarea>
          </div>

          {/* Photo Upload */}
          <div className="photo-upload-section">
            <label>Upload Photo (Helps identify)</label>
            <div className="photo-upload-box">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                id="photo-input"
                className="file-input-hidden"
              />
              <label htmlFor="photo-input" className="photo-label">
                {formData.photo ? (
                  <>
                    <span className="check">✓</span>
                    <span className="file-name">{formData.photo.name}</span>
                  </>
                ) : (
                  <>
                    <span className="camera">📸</span>
                    <span>Tap to upload photo</span>
                  </>
                )}
              </label>
            </div>
          </div>

          <div className="form-divider">Your Contact</div>

          {/* Quick Contact */}
          <div className="form-grid">
            <div className="form-group">
              <label>Name <span className="required">*</span></label>
              <input
                type="text"
                name="name"
                placeholder="Your name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Phone <span className="required">*</span></label>
              <input
                type="tel"
                name="phone"
                placeholder="+919040959368"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="btn btn-primary btn-lg btn-emergency btn-submit"
            disabled={loading}
          >
            {loading ? (
              <>⏳ Sending...</>
            ) : (
              <>🚨 SUBMIT EMERGENCY</>
            )}
          </button>

          <p className="submit-note">Your location is automatically shared with rescue teams</p>
        </form>
      </div >
    </section >
  );
}
