/**
 * MTL Module 2: Telemetry Store
 * Role: Aggregation Buffer.
 * Responsibility: Store calculated metrics for analysis and reporting.
 */
export class TelemetryStore {
    constructor() {
        this.metrics = {
            breachRate: 0,
            standingVolatility: 0,
            moduleUtilization: {},
            lastUpdated: null
        };
        this.history = [];
    }

    update(key, value) {
        this.metrics[key] = value;
        this.metrics.lastUpdated = new Date().toISOString();
    }

    snapshot() {
        const snap = { ...this.metrics, timestamp: new Date().toISOString() };
        this.history.push(snap);
        return snap;
    }

    getLatest() {
        return { ...this.metrics };
    }

    getHistory() {
        return [...this.history];
    }
}
