export const History = {
    // Helper to format a "Life Summary"
    // e.g. "Era 3 (Day 42). 2 Previous Fractures."
    getSummary: (scars, currentEra) => {
        const eraDisplay = currentEra ? `ERA ${currentEra.id.split('_')[1]}` : 'NO ERA';
        const fractureCount = scars.fractures;

        return {
            era: eraDisplay,
            scars: `${fractureCount} SCARS`
        };
    }
};
