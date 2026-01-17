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
    async process() {
        // Look at the Ledger delta (new events since last cycle?)
        // Ideally we only process the *current* event being ingested.
        // But engines typically run on the *whole* state or specifically react to the input.
        // For MVP, we'll check the latest event in the ledger.

        const history = this.kernel.ledger.getHistory();
        if (history.length === 0) return;

        const lastEvent = history[history.length - 1];
        const currentSession = this.kernel.state.getDomain('session');

        console.log(`SESSION_ENGINE: Processing ${lastEvent.type}. Current Status: ${currentSession.status}`);

        if (lastEvent.type === 'INIT_RITUAL' || lastEvent.type === 'PROTOCOL_INIT') {
            if (currentSession.status === 'IDLE') {
                return await this.updateSession({
                    status: 'PENDING',
                    startTime: lastEvent.payload.timestamp || lastEvent.meta.timestamp,
                    ritualInitiated: true
                });
            }
        } else if (lastEvent.type === 'SESSION_INTENT') {
            if (currentSession.status === 'IDLE') {
                return await this.updateSession({
                    status: 'PENDING',
                    activeContractId: lastEvent.payload.contractId
                });
            }
        } else if (lastEvent.type === 'SESSION_STARTED' || lastEvent.type === 'PROTOCOL_START') {
            if (currentSession.status === 'PENDING' || currentSession.status === 'IDLE') {
                return await this.updateSession({
                    status: 'ACTIVE',
                    startTime: lastEvent.payload.timestamp || lastEvent.meta.timestamp,
                    venue: lastEvent.payload.venue,
                    intakeEvidence: lastEvent.payload.evidence
                });
            }
        } else if (lastEvent.type === 'SESSION_ENDED' || lastEvent.type === 'PROTOCOL_COMPLETE' || lastEvent.type === 'RITUAL_COMPLETE') {
            if (currentSession.status === 'ACTIVE' || currentSession.status === 'PENDING') {
                return await this.updateSession({
                    status: 'IDLE',
                    activeContractId: null,
                    startTime: null,
                    venue: null
                });
            }
        }
    }

    async updateSession(payload) {
        const action = {
            type: 'SESSION_UPDATE_STATUS',
            payload: payload,
            actor: 'SessionEngine',
            rules: ['R-SESS-01']
        };

        return this.kernel.complianceKernel.getGate().govern(action, () => {
            this.kernel.setState('session', payload);
            console.log(`ICE: Session Update [${payload.status}] Governed.`);
        }).catch(e => {
            console.error("ICE: Session Update Blocked by Constitution", e.message);
            throw e;
        });
    }
}
