/**
 * FC-00: Institutional Genesis
 * Role: Sovereignty at Birth.
 * Jurisdiction: GENESIS -> PROBATION.
 */

export const FC00_CONTRACT = {
    id: 'contract.core.genesis',
    meta: {
        version: '1.0',
        description: 'Institutional Genesis & Baseline Establishment',
        severity: 'CORE',
        enforceable: true
    },

    // Jurisdictional Authority
    jurisdiction: {
        phases: ['GENESIS', 'PROBATION'],
        sovereign: true // Defers all other contracts in these phases
    },

    // Standing Seeding (FC-00 Constants)
    seeding: {
        continuity: 0.50,
        recovery: 0.50,
        integrity: 0.70,
        stress: 0.10,
        trajectory: 0.00
    },

    activation: {
        when: { always: true } // Active by default at Kernel boot
    },

    obligations: [
        {
            id: 'obligation.genesis.verdict',
            requiredEvent: 'GENESIS_VERDICT_SUBMITTED',
            window: { cycle: 'ONCE' },
            description: 'Institutional Consent & Purpose Acknowledgment'
        },
        {
            id: 'obligation.genesis.baseline',
            requiredEvent: 'BASELINE_DECLARED',
            window: { cycle: 'ONCE' },
            description: 'Physical Condition & Intent Declaration'
        }
    ],

    // Phase Transition Logic handled by PhaseController, but defined here for documentation
    transitions: {
        toProbation: {
            trigger: 'GENESIS_VERDICT_SUBMITTED',
            emit: 'INSTITUTION_BORN'
        },
        toActive: {
            condition: 'STABILIZED',
            window: '7D',
            emit: 'INSTITUTION_ACTIVATED'
        }
    }
};
