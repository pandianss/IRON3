/**
 * Harness Module: Metric Collector
 * Role: Collects and exports simulation metrics.
 */
export class MetricCollector {
    constructor() {
        this.history = [];
    }

    record(day, actorId, snapshot) {
        this.history.push({
            day,
            actorId,
            standingIndex: snapshot.state.standing.index,
            standingBand: snapshot.state.standing.state,
            phase: snapshot.phase.id,
            integrity: snapshot.state.standing.integrity
        });
    }

    generateArtifacts() {
        const timelines = this.history.reduce((acc, entry) => {
            if (!acc[entry.actorId]) acc[entry.actorId] = [];
            acc[entry.actorId].push(entry);
            return acc;
        }, {});

        const outcomes = Object.keys(timelines).map(actorId => {
            const actorHistory = timelines[actorId];
            const final = actorHistory[actorHistory.length - 1];
            return {
                id: actorId,
                finalStanding: final.standingIndex,
                finalBand: final.standingBand,
                finalPhase: final.phase,
                finalIntegrity: final.integrity
            };
        });

        return {
            standing_timelines: timelines,
            institutional_outcomes: outcomes
        };
    }
}
