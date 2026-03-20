/**
 * Calculates the distance between two points in km using the Haversine formula
 */
function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

/**
 * Finds nearby available volunteers for a given location
 */
async function findNearbyVolunteers(db, lat, lon, radiusKm = 10) {
    try {
        const volunteersSnapshot = await db.collection('volunteers')
            .where('isActive', '==', true)
            .where('availability', '==', true)
            .get();

        const nearby = volunteersSnapshot.docs
            .map(doc => {
                const data = doc.data();
                if (!data.latitude || !data.longitude) return null;
                const distance = calculateDistance(lat, lon, data.latitude, data.longitude);
                return { id: doc.id, ...data, distance };
            })
            .filter(v => v !== null && v.distance <= radiusKm)
            .sort((a, b) => a.distance - b.distance);

        return nearby;
    } catch (error) {
        console.error('Error finding nearby volunteers:', error);
        return [];
    }
}

module.exports = { calculateDistance, findNearbyVolunteers };
