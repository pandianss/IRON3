/**
 * Institutional State Monitor
 * Canonical institutional state reference and mandatory write bottleneck.
 */
export class InstitutionalStateMonitor {
    constructor(kernel, token) {
        this.kernel = kernel;
        this.token = token;
        this.cache = null;
    }

    /**
     * Set a temporary cache for the current evaluation cycle.
     */
    enableCache() {
        // Safe access check
        if (this.kernel && this.kernel.state) {
            // Clone snapshot to create a mutable cache layer
            this.cache = { ...this.kernel.state.getSnapshot() };
        }
    }

    disableCache() {
        this.cache = null;
    }

    /**
     * Read access to institutional state.
     */
    getState() {
        if (this.cache) return this.cache;
        if (!this.kernel || !this.kernel.state) return null;
        return this.kernel.state.getSnapshot();
    }

    applyEvent(domain, data) {
        if (!this.kernel || !this.kernel.state) {
            throw new Error("Sovereignty Breach: Cannot apply event without initialized state.");
        }

        console.log(`STATE_LOCK: Applying event to domain [${domain}]`);
        this.kernel.state.update(domain, data, this.token);

        if (this.cache) {
            // Update cache to reflect pending change if in evaluation cycle
            this.cache[domain] = { ...this.cache[domain], ...data };
        }
    }

    /**
     * activateInstitution - Sovereignty Slice (Phase 2.3)
     * Canonical transition to ACTIVE stage.
     */
    activateInstitution(event) {
        if (this.getState()?.lifecycle?.stage === 'ACTIVE') {
            throw new Error("Sovereignty Breach: Institution is already active.");
        }

        const payload = event.payload || {};
        const health = payload.health || 80;

        console.log("STATE_MONITOR: Canonical Activation Transition.");

        // 1. Update Lifecycle Stage
        this.applyEvent('lifecycle', {
            stage: 'ACTIVE',
            baselineHealth: health,
            activatedAt: new Date().toISOString()
        });

        // 2. Initialize Health Domain (Sovereignty Item 9 alignment)
        this.applyEvent('physiology', {
            health: health,
            status: 'OPTIMAL',
            lastAssessment: new Date().toISOString()
        });
    }

    getHealthScore() {
        const state = this.getState();
        // Item 9: Health comes from the physiology/degradation domain
        return state?.physiology?.health || 100;
    }

    getDegradationProfile() {
        const state = this.getState();
        return {
            lifecycle: state?.lifecycle?.stage || 'GENESIS',
            band: state?.standing?.state || 'STABLE'
        };
    }
}
