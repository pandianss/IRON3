import { TelemetryStore } from './TelemetryStore.js';

/**
 * MTL Module 1: Compliance Telemetry Agent
 * Role: The Observer.
 * Responsibility: Calculate high-level compliance metrics from raw kernel events.
 */
export class ComplianceTelemetryAgent {
    constructor(kernel) {
        this.kernel = kernel;
        this.store = new TelemetryStore();
        this.observations = {
            breaches: 0,
            bandChanges: 0,
            totalDays: 0
        };

        // Subscribe to kernel updates
        this.unsubscribe = this.kernel.subscribe(this.handleUpdate.bind(this));
    }

    handleUpdate(snapshot) {
        this.analyze(snapshot);
    }

    analyze(snapshot) {
        const history = snapshot.history;
        const currentStanding = snapshot.state.standing?.state || 'UNKNOWN';

        // 1. Calculate Breach Rate
        // A breach is defined here as a drop in Integrity or entering a BREACHED band
        // For MVP, we count Explicit Breach Events
        const breachEvents = history.filter(e => e.type === 'AUTHORITY_REALIGNED' || e.type === 'OBLIGATION_BREACHED');
        const totalEvents = history.length;

        const breachRate = totalEvents > 0 ? (breachEvents.length / totalEvents) : 0;
        this.store.update('breachRate', breachRate);

        // 2. Calculate Module Utilization
        const activeModules = snapshot.activeModules || [];
        const utilization = {};
        activeModules.forEach(mod => {
            utilization[mod] = 'ACTIVE';
        });
        this.store.update('moduleUtilization', utilization);

        // 3. Volatility (Simplified)
        // Check if standing changed since last observation
        if (this.lastStanding && this.lastStanding !== currentStanding) {
            this.observations.bandChanges++;
        }
        this.lastStanding = currentStanding;

        this.store.update('standingVolatility', this.observations.bandChanges);
        this.store.snapshot();
    }

    getReport() {
        return this.store.getLatest();
    }

    shutdown() {
        if (this.unsubscribe) this.unsubscribe();
    }
}
