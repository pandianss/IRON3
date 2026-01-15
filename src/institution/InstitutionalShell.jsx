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

import { BootScreen } from '../ui/components/system/BootScreen';
import { DiagnosticOverlay } from '../ui/components/system/DiagnosticOverlay';

export const InstitutionalShell = ({ institutionalState, loading }) => {
    // 1. Guaranteed Boot/Loading Spine
    if (loading) {
        return <BootScreen status="CONNECTING TO LEDGER..." />;
    }

    if (!institutionalState) {
        return <BootScreen status="NO STATE" error={true} details="The InstitutionalKernel returned no state snapshot." />;
    }

    // Determine Surface (Routing Logic)
    // Priority: Induction > Evidence > Obligation > SystemState
    let surfaceId = SurfaceId.SYSTEM_STATE;
    let surfaceProps = {};

    const authority = institutionalState.authority;
    const standing = institutionalState.standing;
    const session = institutionalState.session;

    // Safety checks for sub-domains
    if (!authority || !standing) {
        return <BootScreen status="STATE CORRUPTION" error={true} details={{ authority: !!authority, standing: !!standing }} />;
    }

    if (standing.state === 'PRE_INDUCTION') {
        surfaceId = SurfaceId.INDUCTION;
    } else if (authority.surfaces && authority.surfaces['EVIDENCE_CAPTURE'] === 'FULL') {
        surfaceId = SurfaceId.EVIDENCE_CAPTURE;
        // Pass session props
        surfaceProps = { startTime: session?.startTime, venue: session?.venue };
    } else if (authority.surfaces && authority.surfaces['OBLIGATION_CORRIDOR'] === 'FULL') {
        surfaceId = SurfaceId.SYSTEM_STATE;
    }

    const renderSurface = () => {
        try {
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
                    return <BootScreen status="SURFACE ROUTING ERROR" error={true} details={{ surfaceId }} />;
            }
        } catch (err) {
            return <BootScreen status="RENDER CRASH" error={true} details={err.message} />;
        }
    };

    return (
        <StandingThemeAdapter institutionalState={institutionalState}>
            <div className="app-shell">
                {renderSurface()}
                <DiagnosticOverlay state={institutionalState} />
            </div>
        </StandingThemeAdapter>
    );
};
