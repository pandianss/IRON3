export class TelemetryStore {
    constructor() {
        this.metrics = {};
    }

    update(key, value) {
        this.metrics[key] = { value, timestamp: new Date().toISOString() };
    }

    getLatest() {
        return { ...this.metrics };
    }

    snapshot() {
        // Implementation for history if needed
    }
}
