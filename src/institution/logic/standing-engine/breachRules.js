/**
 * Logic for handling breaches (violations of law).
 */

/**
 * @param {string} obligationId 
 * @returns {import('./types').Violation}
 */
export function createViolation(obligationId) {
    return {
        id: `v_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        type: mapObligationToViolation(obligationId),
        date: new Date().toISOString(),
        acknowledged: false
    };
}

function mapObligationToViolation(obligationId) {
    const map = {
        'DAILY_PRACTICE': 'MISSED_PRACTICE',
        'IMMEDIATE_CORRECTION': 'IGNORED_WARNING',
        'ENTER_RECOVERY': 'RECOVERY_DELAYED'
    };
    return map[obligationId] || 'GENERIC_BREACH';
}
