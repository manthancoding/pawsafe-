// helper utilities: distance calculation and cache management
export function haversineDistance([lat1, lng1], [lat2, lng2]) {
  const toRad = (deg) => (deg * Math.PI) / 180;
  const R = 6371e3; // meters
  const φ1 = toRad(lat1);
  const φ2 = toRad(lat2);
  const Δφ = toRad(lat2 - lat1);
  const Δλ = toRad(lng2 - lng1);
  const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // meters
}

// simple localStorage cache with TTL (ms)
export function cacheGet(key) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    const data = JSON.parse(raw);
    if (data.expire && Date.now() > data.expire) {
      localStorage.removeItem(key);
      return null;
    }
    return data.value;
  } catch (e) {
    return null;
  }
}

export function cacheSet(key, value, ttl = 1000 * 60 * 5) { // default 5min
  try {
    const payload = { value, expire: Date.now() + ttl };
    localStorage.setItem(key, JSON.stringify(payload));
  } catch (e) {}
}
