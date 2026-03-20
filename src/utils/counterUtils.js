export function incrementGlobalImpactStats(donationAmount) {
    try {
        const stored = localStorage.getItem('pawsafe_counter_offsets');
        let offsets = stored ? JSON.parse(stored) : { rescued: 0, active: 0 };

        // Scale impact by donation amount (e.g. ₹500 = 1 animal rescued)
        const rescuedImpact = Math.max(1, Math.floor(donationAmount / 500));
        // Also simulate an active rescue request being resolved
        const activeImpact = Math.max(1, Math.floor(rescuedImpact / 2));

        offsets.rescued += rescuedImpact;
        // active requests go up when reported, but we can simulate a slight increase in active network activity
        offsets.active += activeImpact;

        localStorage.setItem('pawsafe_counter_offsets', JSON.stringify(offsets));
        return offsets;
    } catch (e) {
        console.error("Failed to update impact stats", e);
    }
}

export function getGlobalImpactStatsOffsets() {
    try {
        const stored = localStorage.getItem('pawsafe_counter_offsets');
        return stored ? JSON.parse(stored) : { rescued: 0, active: 0 };
    } catch (e) {
        return { rescued: 0, active: 0 };
    }
}
