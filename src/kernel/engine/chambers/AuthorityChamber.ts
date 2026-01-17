import { InstitutionalState } from '../../types';

export interface AuthorityFindings {
    locks?: Array<{ class: string, level: string, reason: string }>;
    surfaces?: Record<string, string>;
    interactionLevel?: string;
}

export class AuthorityChamber {
    /**
     * Pure function to resolve authority profile based on current state.
     */
    public static investigate(state: InstitutionalState): AuthorityFindings {
        const phase = state.domains.phase?.id || 'GENESIS';
        const standing = state.domains.standing;
        const session = state.domains.session;

        let profile: AuthorityFindings = {
            locks: [],
            surfaces: {
                'OBLIGATION_CORRIDOR': 'RESTRICTED',
                'EVIDENCE_CAPTURE': 'HIDDEN',
                'LEDGER_CLOSURE': 'HIDDEN',
                'OBSERVATORY': 'VISIBLE'
            }
        };

        // Phase Logic
        if (phase === 'GENESIS') {
            profile.surfaces!['OBLIGATION_CORRIDOR'] = 'HIDDEN';
            profile.interactionLevel = 'OBSERVATIONAL';
        } else if (phase === 'PROBATION') {
            profile.surfaces!['OBLIGATION_CORRIDOR'] = 'FULL';
            profile.interactionLevel = 'CALIBRATION';
        }

        // Standing Logic
        if (standing.state === 'VIOLATED') {
            profile.locks!.push({ class: 'SURFACE', level: 'TOTAL', reason: 'FRACTURE' });
        } else if (standing.state !== 'PRE_INDUCTION') {
            profile.surfaces!['OBLIGATION_CORRIDOR'] = 'FULL';
        }

        // Session Logic
        if (session && (session.status === 'ACTIVE' || session.status === 'PENDING')) {
            profile.surfaces!['EVIDENCE_CAPTURE'] = 'FULL';
            profile.surfaces!['OBLIGATION_CORRIDOR'] = 'HIDDEN'; // Focus Mode
        }

        return profile;
    }
}
