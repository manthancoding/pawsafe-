import { useState, useEffect, useRef } from 'react';
import './LocationAutocomplete.css';

export default function LocationAutocomplete({ onSelect, placeholder = 'Search for a location...' }) {
    const [query, setQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [loading, setLoading] = useState(false);
    const apiKey = import.meta.env.VITE_LOCATIONIQ_API_KEY;
    const timeoutRef = useRef(null);

    useEffect(() => {
        if (query.length < 3) {
            setSuggestions([]);
            return;
        }

        if (timeoutRef.current) clearTimeout(timeoutRef.current);

        timeoutRef.current = setTimeout(async () => {
            setLoading(true);
            try {
                // Using LocationIQ Autocomplete with addressdetails and country codes for better accuracy
                const response = await fetch(
                    `https://api.locationiq.com/v1/autocomplete.php?key=${apiKey}&q=${encodeURIComponent(query)}&format=json&limit=5&addressdetails=1&normalizeaddress=1`
                );
                const data = await response.json();

                if (data.error) {
                    console.error('LocationIQ Error:', data.error);
                    setSuggestions([]);
                    return;
                }

                if (Array.isArray(data)) {
                    setSuggestions(data);
                } else {
                    setSuggestions([]);
                }
            } catch (error) {
                console.error('Autocomplete error:', error);
                setSuggestions([]);
            } finally {
                setLoading(false);
            }
        }, 400); // Slightly faster debounce

        return () => clearTimeout(timeoutRef.current);
    }, [query, apiKey]);

    const handleSelect = (item) => {
        setQuery(item.display_name);
        setSuggestions([]);
        setShowSuggestions(false);
        onSelect({
            lat: parseFloat(item.lat),
            lng: parseFloat(item.lon),
            name: item.display_name
        });
    };

    return (
        <div className="autocomplete-container">
            <input
                type="text"
                value={query}
                onChange={(e) => {
                    setQuery(e.target.value);
                    setShowSuggestions(true);
                }}
                onFocus={() => setShowSuggestions(true)}
                placeholder={placeholder}
                className="autocomplete-input"
            />
            {showSuggestions && (suggestions.length > 0 || loading) && (
                <ul className="suggestions-list">
                    {loading && <li className="suggestion-item loading">Searching...</li>}
                    {!loading && suggestions.map((item) => (
                        <li
                            key={item.place_id}
                            onClick={() => handleSelect(item)}
                            className="suggestion-item"
                        >
                            {item.display_name}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
