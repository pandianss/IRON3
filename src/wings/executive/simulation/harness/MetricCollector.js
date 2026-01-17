/**
 * NEW Metric Collector
 * Role: Record and compile simulation outcomes.
 */
export class MetricCollector {
    constructor() {
        this.records = [];
    }

    record(day, actorId, snapshot) {
        this.records.push({
            day,
            actorId,
            lifecycle: snapshot.state.lifecycle,
            standing: snapshot.state.standing,
            physiology: snapshot.state.physiology,
            compliance: snapshot.compliance
        });
    }

    generateArtifacts() {
        return {
            standing_timelines: this.records.map(r => ({
                day: r.day,
                health: r.physiology?.health,
                band: r.physiology?.status,
                stage: r.lifecycle?.stage
            })),
            institutional_outcomes: [{
                id: "SIM-INSTITUTION-01",
                finalBand: this.records[this.records.length - 1]?.physiology?.status || 'UNKNOWN',
                finalStage: this.records[this.records.length - 1]?.lifecycle?.stage || 'UNKNOWN',
                totalDays: this.records.length
            }]
        };
    }
}
