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

    const { requiredSurface } = institutionalState;
    const { id, props } = requiredSurface;

    const renderSurface = () => {
        switch (id) {
            case SurfaceId.INDUCTION:
                return <Induction {...props} />;

            case SurfaceId.SYSTEM_STATE:
                return <SystemState
                    state={institutionalState.standing}
                    era={institutionalState.currentEra}
                    scars={institutionalState.scars}
                />;

            case SurfaceId.OBLIGATION_CORRIDOR:
                return <ObligationCorridor
                    obligations={institutionalState.obligations}
                    mode={props.mode} // Pass mode (RECOVERY etc)
                />;

            case SurfaceId.EVIDENCE_CAPTURE:
                return <EvidenceCapture {...props} />;

            case SurfaceId.LEDGER_CLOSURE:
                return <LedgerClosure {...props} />;

            case SurfaceId.CONSEQUENCE_HALL:
                return <ConsequenceHall {...props} scars={institutionalState.scars} />;

            default:
                return (
                    <div className="surface-error">
                        <h1>UNKNOWN SURFACE ASSIGNMENT</h1>
                        <pre>{id}</pre>
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
