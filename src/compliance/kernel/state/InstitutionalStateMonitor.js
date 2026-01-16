/**
 * Institutional State Monitor
 * Canonical institutional state reference and mandatory write bottleneck.
 */
export class InstitutionalStateMonitor {
    constructor(kernel) {
        this.kernel = kernel;
        this.cache = null;
    }

    /**
     * Set a temporary cache for the current evaluation cycle.
     */
    enableCache() {
        this.cache = this.kernel.state.getSnapshot();
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

    /**
     * Mandatory Write Bottleneck (Sovereignty Item 6)
     * All writes to institutional state MUST pass through this method.
     */
    applyEvent(domain, data) {
        if (!this.kernel || !this.kernel.state) {
            throw new Error("Sovereignty Breach: Cannot apply event without initialized state.");
        }

        console.log(`STATE_LOCK: Applying event to domain [${domain}]`);
        this.kernel.state.update(domain, data);

        if (this.cache) {
            // Update cache to reflect pending change if in evaluation cycle
            this.cache[domain] = { ...this.cache[domain], ...data };
        }
    }

    getHealthScore() {
        const state = this.getState();
        return state?.standing?.integrity || 100;
    }

    getDegradationProfile() {
        const state = this.getState();
        return {
            lifecycle: state?.lifecycle?.stage || 'GENESIS',
            band: state?.standing?.state || 'STABLE'
        };
    }
}
