/**
 * Harness Module: Institutional Recorder
 * Role: Black-box flight recorder.
 * Captures the stream of reality.
 */
export class InstitutionalRecorder {
    constructor() {
        this.timeline = [];
    }

    capture(timestamp, event, snapshot) {
        this.timeline.push({
            timestamp,
            trigger: event,
            state: snapshot.state,
            mandates: snapshot.mandates
        });
    }

    exportArtifact() {
        return {
            timeline: this.timeline,
            summary: {
                totalCycles: this.timeline.length,
                finalState: this.timeline[this.timeline.length - 1]?.state
            }
        };
    }
}
