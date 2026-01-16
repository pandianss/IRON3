/**
 * Standing Interpreter
 * Translates raw institutional standing (integrity/state) into UI-consumable bands and themes.
 */

export const StandingBand = {
    // High Integrity
    ELITE: 'ELITE',         // > 95%
    ASCENDING: 'ASCENDING', // > 80%

    // Baseline
    STABLE: 'STABLE',       // > 60%

    // Degradation
    SLIP: 'SLIP',           // > 40% (Warning)
    DEGRADED: 'DEGRADED',   // > 20% (Danger)
    COLLAPSED: 'COLLAPSED', // < 20% (Fatal)

    // Pre-activation
    GENESIS: 'GENESIS'
};

export const interpretStanding = (standingState) => {
    if (!standingState) return { band: StandingBand.GENESIS, color: 'gray' };

    const { integrity, state } = standingState;

    // Direct State Overrides
    if (state === 'COLLAPSED') return { band: StandingBand.COLLAPSED, color: 'red' };
    if (state === 'PRE_INDUCTION') return { band: StandingBand.GENESIS, color: 'slate' };

    // Integrity Mapping
    if (integrity >= 95) return { band: StandingBand.ELITE, color: 'gold' };
    if (integrity >= 80) return { band: StandingBand.ASCENDING, color: 'emerald' };
    if (integrity >= 60) return { band: StandingBand.STABLE, color: 'blue' };
    if (integrity >= 40) return { band: StandingBand.SLIP, color: 'orange' };
    if (integrity >= 20) return { band: StandingBand.DEGRADED, color: 'rose' };

    return { band: StandingBand.COLLAPSED, color: 'zinc' };
};
