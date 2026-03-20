import './DirectionsPanel.css';

export default function DirectionsPanel({ routeInfo, onClose, destinationName }) {
    if (!routeInfo) return null;

    return (
        <div className="directions-panel">
            <div className="directions-header">
                <div className="directions-title">
                    <span className="directions-icon">🗺️</span>
                    <div>
                        <h3>Directions to {destinationName || 'Rescue Centre'}</h3>
                        <p className="route-stats">
                            <strong>{routeInfo.distance} km</strong> • Approx. <strong>{routeInfo.time} mins</strong>
                        </p>
                    </div>
                </div>
                <button className="close-directions" onClick={onClose} aria-label="Close directions">✕</button>
            </div>

            <div className="instructions-list">
                {routeInfo.instructions && routeInfo.instructions.length > 0 ? (
                    routeInfo.instructions.map((step, idx) => (
                        <div key={idx} className="instruction-step">
                            <span className="step-number">{idx + 1}</span>
                            <div className="step-detail">
                                <p className="step-text">{step.text}</p>
                                {step.distance > 0 && (
                                    <span className="step-dist">
                                        {step.distance >= 1000
                                            ? `${(step.distance / 1000).toFixed(1)} km`
                                            : `${Math.round(step.distance)} m`}
                                    </span>
                                )}
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="no-data">Calculating route details...</p>
                )}
            </div>

            <div className="directions-footer">
                <button className="btn-finish" onClick={onClose}>Finish directions</button>
            </div>
        </div>
    );
}
