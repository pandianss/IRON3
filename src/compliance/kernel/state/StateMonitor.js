/**
 * State Monitor
 * Canonical institutional state reference.
 */
export class StateMonitor {
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

    getState() {
        if (this.cache) return this.cache;
        if (!this.kernel || !this.kernel.state) return null;
        return this.kernel.state.getSnapshot();
    }

    getHealthScore() {
        const state = this.getState();
        // Derived from Integrity or similar
        return state?.standing?.integrity || 100;
    }

    getDegradationProfile() {
        const state = this.getState();
        // Return Lifecycle info
        return {
            lifecycle: state?.lifecycle?.stage || 'GENESIS',
            band: state?.standing?.state || 'STABLE'
        };
    }
}
