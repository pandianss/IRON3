/**
 * Harness Module: Institutional Recorder
 * Role: Black-box flight recorder.
 * Captures the stream of reality.
 */
export class InstitutionalRecorder {
    constructor() {
        this.timeline = [];
    }

    capture(timestamp, event, snapshot, actorId = 'SYSTEM') {
        this.timeline.push({
            timestamp,
            actorId,
            trigger: event,
            state: snapshot.state,
            phase: snapshot.phase,
            mandates: snapshot.mandates
        });
    }

    exportArtifact() {
        const actors = [...new Set(this.timeline.map(t => t.actorId))];
        const summary = actors.map(id => {
            const actorEvents = this.timeline.filter(t => t.actorId === id);
            return {
                id,
                totalEvents: actorEvents.length,
                finalState: actorEvents[actorEvents.length - 1]?.state,
                finalPhase: actorEvents[actorEvents.length - 1]?.phase
            };
        });

        return {
            timeline: this.timeline,
            summary
        };
    }
}
