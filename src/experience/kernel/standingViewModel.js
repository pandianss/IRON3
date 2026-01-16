/******************************************************************************************
 * STANDING VIEW MODEL
 * 
 * Translates raw institutional standing into human-legible experiential data.
 ******************************************************************************************/

export function buildStandingViewModel(snapshot) {
    const { state, compliance } = snapshot;
    const standing = state.standing || {};
    const physiology = state.physiology || {};
    const lifecycle = state.lifecycle || {};

    return Object.freeze({
        // Metrics
        integrity: {
            value: standing.integrity,
            label: `${standing.integrity}%`,
            status: standing.integrity > 80 ? 'STABLE' : (standing.integrity > 50 ? 'WARNING' : 'CRITICAL')
        },
        continuity: {
            value: standing.streak || 0,
            label: `${standing.streak || 0} Days`,
            suffix: 'STREAK'
        },
        health: {
            value: physiology.health,
            label: `${physiology.health}%`,
            status: physiology.status
        },

        // Institutional Context
        institutionalAge: {
            value: state.ageDays || 0,
            label: `${state.ageDays || 0} Epochs`
        },

        // Compliance Context
        risk: {
            level: compliance?.riskLevel || 'LOW',
            verdictPending: state.verdictPending || false
        },

        // Lifecycle
        stage: lifecycle.stage,
        isRecovering: lifecycle.stage === 'RECOVERING',
        isDegrading: lifecycle.stage === 'DEGRADING'
    });
}
