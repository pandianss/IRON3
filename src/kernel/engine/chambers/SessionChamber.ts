import { SovereignEvent } from '../../types';

export type SessionStatus = 'IDLE' | 'PENDING' | 'ACTIVE';

export interface SessionFindings {
    status?: SessionStatus;
    startTime?: number | null;
    activeContractId?: string | null;
    venue?: string | null;
    intakeEvidence?: any;
}

export class SessionChamber {
    /**
     * Pure function to derive session findings from current session state and event.
     */
    public static investigate(current: { status: SessionStatus }, event: SovereignEvent): SessionFindings | null {
        const type = event.type;
        const payload = event.payload;

        if (['INIT_RITUAL', 'PROTOCOL_INIT'].includes(type)) {
            if (current.status === 'IDLE') {
                return {
                    status: 'PENDING',
                    startTime: event.timestamp
                };
            }
        } else if (type === 'SESSION_INTENT') {
            if (current.status === 'IDLE') {
                return {
                    status: 'PENDING',
                    activeContractId: payload.contractId
                };
            }
        } else if (['SESSION_STARTED', 'PROTOCOL_START'].includes(type)) {
            if (current.status === 'PENDING' || current.status === 'IDLE') {
                return {
                    status: 'ACTIVE',
                    startTime: event.timestamp,
                    venue: payload.venue,
                    intakeEvidence: payload.evidence
                };
            }
        } else if (['SESSION_ENDED', 'PROTOCOL_COMPLETE', 'RITUAL_COMPLETE'].includes(type)) {
            if (current.status === 'ACTIVE' || current.status === 'PENDING') {
                return {
                    status: 'IDLE',
                    activeContractId: null,
                    startTime: null,
                    venue: null
                };
            }
        }

        return null;
    }
}
