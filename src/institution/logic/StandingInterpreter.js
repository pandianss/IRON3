/**
 * Standing Interpreter
 * Normalizes raw engine outputs into canonical UI state.
 * Reference: DESIGN_TO_CODE_SPEC.md Section 2.1
 */

export const StandingBand = {
    STABLE: 'STABLE',
    ASCENDING: 'ASCENDING',
    RISK: 'RISK',
    BREACH: 'BREACH',
    RECOVERY: 'RECOVERY'
};

export function interpretStanding(institutionalState) {
    if (!institutionalState || !institutionalState.standing) {
        return getDefaultInterpretation();
    }

    const { state, entropy } = institutionalState.standing;
    const isFractured = institutionalState.scars && institutionalState.scars.list.some(s => s.type === 'FRACTURE' && isRecent(s.date));

    // 1. Determine Band
    let standingBand = StandingBand.STABLE;

    switch (state) {
        case 'COMPLIANT':
            standingBand = StandingBand.STABLE;
            break;
        case 'INSTITUTIONAL':
            standingBand = StandingBand.ASCENDING;
            break;
        case 'BREACH_RISK':
        case 'STRAINED':
            standingBand = StandingBand.RISK;
            break;
        case 'VIOLATED':
            standingBand = StandingBand.BREACH;
            break;
        case 'RECOVERY':
        case 'RECONSTITUTED':
            standingBand = StandingBand.RECOVERY;
            break;
        default:
            standingBand = StandingBand.STABLE;
    }

    // 2. Calculate Pressure/Intensity
    // Entropy is usually 0-1.
    const riskPressure = entropy || 0;

    // Motion intensity scales with Band + Entropy
    let motionIntensity = 0.1; // Base ambient
    if (standingBand === StandingBand.ASCENDING) motionIntensity = 0.3;
    if (standingBand === StandingBand.RISK) motionIntensity = 0.5 + (riskPressure * 0.5);
    if (standingBand === StandingBand.BREACH) motionIntensity = 0; // Frozen until fracture animation
    if (standingBand === StandingBand.RECOVERY) motionIntensity = 0.2;

    return {
        standingBand,
        standingLevel: institutionalState.standing.streak || 0,
        riskPressure,
        motionIntensity,
        // temporalPhase: determineTemporalPhase(institutionalState) // TODO
    };
}

function getDefaultInterpretation() {
    return {
        standingBand: StandingBand.STABLE,
        standingLevel: 0,
        riskPressure: 0,
        motionIntensity: 0
    };
}

function isRecent(date) {
    // Helper to see if scar is "fresh" (e.g. today). 
    // Simplified for now.
    return true;
}
