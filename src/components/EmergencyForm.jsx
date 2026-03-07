import { useState, useEffect } from 'react';
import './EmergencyForm.css';

export default function EmergencyForm({ onClose }) {
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

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [gpsLoading, setGpsLoading] = useState(true);

  // Auto-capture GPS on component mount
  useEffect(() => {
    captureLocationAuto();
  }, []);

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
          setFormData(prev => ({
            ...prev,
            latitude: position.coords.latitude.toFixed(6),
            longitude: position.coords.longitude.toFixed(6)
          }));
          setGpsLoading(false);
        },
        () => {
          console.log('Location access needed');
          setGpsLoading(false);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    } else {
      setGpsLoading(false);
    }
  };

  const requestManualLocation = () => {
    const loc = window.prompt("Enter your city or area (e.g. Jamshedpur):");
    if (!loc) return;

    setGpsLoading(true);
    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ address: loc }, (results, status) => {
      if (status === 'OK' && results[0]) {
        const coords = {
          lat: results[0].geometry.location.lat(),
          lng: results[0].geometry.location.lng()
        };
        sessionStorage.setItem('pawsafe_manual_location', JSON.stringify(coords));
        setFormData(prev => ({
          ...prev,
          latitude: coords.lat.toFixed(6),
          longitude: coords.lng.toFixed(6)
        }));
        setGpsLoading(false);
      } else {
        alert("Could not find that location. Please try again.");
        setGpsLoading(false);
      }
    });
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

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate required fields
    if (!formData.animalType || !formData.issueType || !formData.name || !formData.phone) {
      alert('Please fill in all required fields');
      return;
    }

    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      setTimeout(() => {
        onClose();
      }, 3000);
    }, 1500);
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
            <div className={`gps-indicator ${gpsLoading ? 'loading' : 'ready'}`}>
              📍 {gpsLoading ? 'Capturing GPS...' : 'GPS Locked'}
            </div>
            {formData.latitude && formData.longitude && (
              <div className="coordinates-display">
                <p>{formData.latitude}, {formData.longitude}</p>
              </div>
            )}
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

          <div className="divider">Your Contact</div>

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
      </div>
    </section>
  );
}
