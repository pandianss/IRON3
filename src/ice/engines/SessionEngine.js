/**
 * ICE Module 8: Session Engine
 * Role: The Watcher.
 * Responsibilities:
 * - Tracks whether the user is currently "in" a contract execution.
 * - Manages session timers and metadata.
 */
export class SessionEngine {
    constructor(kernel) {
        this.kernel = kernel;
    }

    /**
     * Cycle Step 1: Process new events to update session state.
     */
    process() {
        // Look at the Ledger delta (new events since last cycle?)
        // Ideally we only process the *current* event being ingested.
        // But engines typically run on the *whole* state or specifically react to the input.
        // For MVP, we'll check the latest event in the ledger.

        const history = this.kernel.ledger.getHistory();
        if (history.length === 0) return;

        const lastEvent = history[history.length - 1];
        const currentSession = this.kernel.state.getDomain('session');

        if (lastEvent.type === 'SESSION_INTENT') {
            if (currentSession.status === 'IDLE') {
                this.updateSession({
                    status: 'PENDING',
                    activeContractId: lastEvent.payload.contractId
                });
            }
        } else if (lastEvent.type === 'SESSION_STARTED') {
            // User moved from Intake -> Active
            if (currentSession.status === 'PENDING' || currentSession.status === 'IDLE') {
                this.updateSession({
                    status: 'ACTIVE',
                    startTime: lastEvent.payload.timestamp || lastEvent.meta.timestamp,
                    venue: lastEvent.payload.venue,
                    intakeEvidence: lastEvent.payload.evidence // Before Selfie
                });
            }
        } else if (lastEvent.type === 'SESSION_ENDED') {
            if (currentSession.status === 'ACTIVE') {
                this.updateSession({
                    status: 'IDLE',
                    activeContractId: null,
                    startTime: null,
                    venue: null
                });
            }
        } else if (lastEvent.type === 'PRACTICE_COMPLETE' && currentSession.status === 'ACTIVE') {
            // Implicit closure
            this.updateSession({ status: 'IDLE' });
        }
    }

    updateSession(payload) {
        const action = {
            type: 'SESSION_UPDATE_STATUS',
            payload: payload,
            actor: 'SessionEngine',
            rules: ['R-SESS-01']
        };

        this.kernel.complianceKernel.getGate().govern(action, () => {
            this.kernel.state.update('session', payload);
            console.log(`ICE: Session Update [${payload.status}] Governed.`);
        }).catch(e => {
            console.error("ICE: Session Update Blocked by Constitution", e.message);
        });
    }
}
