/**
 * IRON Core Contract: Daily Practice
 * "The Body is the Record."
 */

/** @type {import('../types').InstitutionalContract} */
export const DAILY_PRACTICE_CONTRACT = {
    id: 'contract.core.daily_practice',
    meta: {
        version: '1.0',
        description: 'Mandatory Daily Practice',
        severity: 'CORE',
        enforceable: true
    },
    activation: {
        when: {
            all: [
                { standing: { isNot: 'PRE_INDUCTION' } },
                { standing: { isNot: 'DORMANT' } }
            ]
        }
    },
    obligations: [
        {
            id: 'obligation.practice',
            requiredEvent: 'SESSION_ENDED', // or PRACTICE_COMPLETE
            window: { cycle: 'DAILY' },
            evidence: {
                schemaValid: true // Handled by EventRegistry
            }
        }
    ],
    violations: [
        {
            id: 'violation.missed_practice',
            when: {
                obligation: 'obligation.practice',
                condition: 'expired'
            },
            emits: 'PRACTICE_MISSED', // The penalizing event
            weight: 10
        }
    ],
    authorityEffects: {
        onActivation: [
            { allow: { surface: 'OBLIGATION_CORRIDOR', interaction: 'FULL' } }
        ],
        onViolation: [
            { lock: { class: 'MOTION', level: 'FROZEN', surfaces: ['OBLIGATION_CORRIDOR'] } } // Example
        ]
    }
};
