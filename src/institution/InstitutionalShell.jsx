import React from 'react';
import { SurfaceId } from '../institution/standing-engine/types';
import { StandingThemeAdapter } from '../ui/adapters/StandingThemeAdapter';

// Surfaces
import { SystemState } from '../experience/system-state/SystemState';
import { ObligationCorridor } from '../experience/obligation-corridor/ObligationCorridor';
import { EvidenceCapture } from '../experience/evidence-capture/EvidenceCapture';
import { LedgerClosure } from '../experience/ledger-closure/LedgerClosure';
import { ConsequenceHall } from '../experience/consequence-hall/ConsequenceHall';
import { Induction } from '../experience/induction/Induction';

export const InstitutionalShell = ({ institutionalState, loading }) => {
    if (loading) return <div className="loading">CONNECTING TO LEDGER...</div>;
    if (!institutionalState) return <div className="error">NO INSTITUTIONAL STATE</div>;

    // Determine Surface (Routing Logic)
    // Priority: Induction > Evidence > Obligation > SystemState
    let surfaceId = SurfaceId.SYSTEM_STATE;
    let surfaceProps = {};

    const authority = institutionalState.authority;
    const standing = institutionalState.standing;
    const session = institutionalState.session;

    if (standing.state === 'PRE_INDUCTION') {
        surfaceId = SurfaceId.INDUCTION;
    } else if (authority.surfaces['EVIDENCE_CAPTURE'] === 'FULL') {
        surfaceId = SurfaceId.EVIDENCE_CAPTURE;
        // Pass session props
        surfaceProps = { startTime: session.startTime, venue: session.venue };
    } else if (authority.surfaces['OBLIGATION_CORRIDOR'] === 'FULL') {
        // In this MVP, we might show SystemState which contains the contracts?
        // Or if we have a dedicated Corridor view.
        // For now, let's keep SystemState as the main hub unless strictly in Corridor mode.
        surfaceId = SurfaceId.SYSTEM_STATE;
    }

    const renderSurface = () => {
        switch (surfaceId) {
            case SurfaceId.INDUCTION:
                return <Induction {...surfaceProps} />;

            case SurfaceId.SYSTEM_STATE:
                return <SystemState
                    state={institutionalState.standing}
                    era={institutionalState.currentEra}
                    scars={institutionalState.scars}
                />;

            case SurfaceId.OBLIGATION_CORRIDOR:
                return <ObligationCorridor
                    obligations={institutionalState.obligations}
                    mode={surfaceProps.mode} // Pass mode (RECOVERY etc)
                />;

            case SurfaceId.EVIDENCE_CAPTURE:
                return <EvidenceCapture {...surfaceProps} />;

            case SurfaceId.LEDGER_CLOSURE:
                return <LedgerClosure {...surfaceProps} />;

            case SurfaceId.CONSEQUENCE_HALL:
                return <ConsequenceHall {...surfaceProps} scars={institutionalState.scars} />;

            default:
                return (
                    <div className="surface-error">
                        <h1>UNKNOWN SURFACE ASSIGNMENT</h1>
                        <pre>{surfaceId}</pre>
                    </div>
                );
        }
    };

    return (
        <StandingThemeAdapter institutionalState={institutionalState}>
            <div className="app-shell">
                {renderSurface()}
            </div>
        </StandingThemeAdapter>
    );
};
