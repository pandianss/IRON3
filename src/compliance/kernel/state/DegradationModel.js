/**
 * Degradation Model
 * Sovereignty Slice: Phase 3.1
 * Role: The Sovereign Auditor of Institutional Fitness.
 */
export class DegradationModel {
    constructor(kernel) {
        this.kernel = kernel;
        this.config = {
            baseDecay: 2,           // Flat health loss per cycle
            violationWeight: {
                'NOMINAL': 0,
                'MINOR': 5,
                'CRITICAL': 15,
                'SUPREME': 50
            },
            thresholds: {
                OPTIMAL: 80,
                DEGRADED: 40,
                CRITICAL: 10,
                COLLAPSED: 0
            }
        };
    }

    /**
     * evaluate - Computes the new health of the institution.
     */
    evaluate(snapshot) {
        const state = snapshot.state;
        const currentHealth = state.physiology?.health ?? 100;

        // 1. Violation-Weighted Degradation
        // We look at the audit log for violations since the last evaluation.
        const recentViolations = (snapshot.audit || []).filter(v => v.verdict === 'VIOLATION');
        const violationPenalty = recentViolations.reduce((acc, v) => {
            return acc + (this.config.violationWeight[v.severity] || 5);
        }, 0);

        // 2. Continuous Health Decay
        const decay = this.config.baseDecay;

        const nextHealth = Math.max(0, currentHealth - violationPenalty - decay);

        // 3. Threshold Mapping
        let band = 'OPTIMAL';
        if (nextHealth <= this.config.thresholds.COLLAPSED) band = 'COLLAPSED';
        else if (nextHealth <= this.config.thresholds.CRITICAL) band = 'CRITICAL';
        else if (nextHealth <= this.config.thresholds.DEGRADED) band = 'DEGRADED';

        return {
            health: nextHealth,
            band,
            penalties: {
                violations: violationPenalty,
                decay: decay
            },
            timestamp: new Date().toISOString()
        };
    }
}
