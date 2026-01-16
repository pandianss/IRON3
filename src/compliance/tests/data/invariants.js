/**
 * THE MUTABLE TRUTHS
 * 
 * These are the invariants that must ALWAYS hold true for a valid institutional state.
 * Violation of any invariant constitutes a "Constitutional Crisis" and may trigger
 * an automated shutdown or degraded mode.
 */

export const INVARIANTS = [
    {
        id: 'INV_001_LEDGER_MONOTONICITY',
        description: 'The Ledger must never lose history. Size must be >= previous check.',
        severity: 'CRITICAL',
        check: (context) => {
            const currentSize = context.ledger.length;
            // previousSnapshot is the raw kernel snapshot, so it uses 'history'
            const previousSize = context.previousSnapshot?.history?.length || 0;
            return currentSize >= previousSize;
        }
    },
    {
        id: 'INV_002_STANDING_EXISTENCE',
        description: 'Every snapshot must contain a valid Standing object.',
        severity: 'CRITICAL',
        check: (context) => {
            return !!context.state.standing && !!context.state.standing.state;
        }
    },
    {
        id: 'INV_003_PHASE_VALIDITY',
        description: 'The current phase must be a recognized system phase.',
        severity: 'HIGH',
        check: (context) => {
            const validPhases = ['GENESIS', 'PROBATION', 'ACTIVE', 'SCARRED', 'TERMINATED'];
            return validPhases.includes(context.state.phase.id);
        }
    },
    {
        id: 'INV_004_FITNESS_VECTORS_BOUNDED',
        description: 'All fitness vectors must remain within [0, 1] bounds.',
        severity: 'HIGH',
        check: (context) => {
            if (!context.state.fitnessStanding) return true; // Skip if module inactive
            const vectors = context.state.fitnessStanding;
            const keys = ['continuity', 'recovery', 'integrity', 'stress'];
            return keys.every(k => vectors[k] >= 0 && vectors[k] <= 1);
        }
    }
];
