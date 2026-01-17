/**
 * @typedef {Object} Era
 * @property {string} id - Unique Era ID (e.g. "ERA_1")
 * @property {string} start - ISO Date start
 * @property {string|null} end - ISO Date end (null if active)
 * @property {string} status - 'ACTIVE' | 'CLOSED' | 'VOID'
 * @property {number} length - Duration in days
 */

/**
 * Calculates eras from a list of scars/fracture points.
 * @param {Array} history - The standing history [state, timestamp]
 * @returns {Era[]}
 */
export function deriveEras(history) {
    // Logic: An Era begins at Induction (or Recovery Exit) and ends at Violation.
    // This is a simplified derivation. Real logic might be more complex.

    const eras = [];
    let currentEra = null;
    let eraCount = 0;

    // We need to trace the ledger history to find Era boundaries.
    // Or we trace state transitions.

    // Simplification for MVP:
    // If we are PRE_INDUCTION, no Era.
    // If we enter INDUCTED, Era 1 starts.
    // If we hit VIOLATED, Era 1 ends.
    // If we hit RECONSTITUTED (via Recovery), Era 2 starts.

    // Better approach: Replay logic should have yielded discrete "Era" events?
    // Or we simply map transitions:
    // [Any] -> INDUCTED/RECONSTITUTED : Start new Era
    // [Any] -> VIOLATED : End current Era

    return eras; // Placeholder implementation to be filled by evaluateInstitution logic integration
}

// For now, we will probably implement Era derivation inside evaluateInstitution directly
// or use this as a helper. Let's make it a helper class/module.

export const Eras = {
    start: (timestamp, index) => ({
        id: `ERA_${index}`,
        start: timestamp,
        end: null,
        status: 'ACTIVE',
        length: 0
    }),

    close: (era, timestamp) => ({
        ...era,
        end: timestamp,
        status: 'CLOSED'
        // length calculation logic here
    })
};
