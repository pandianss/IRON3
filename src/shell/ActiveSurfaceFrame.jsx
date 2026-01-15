import React, { useState, useEffect } from 'react';
import { NoInstitutionSurface } from '../surfaces/NoInstitutionSurface'
import { BootSurface } from '../surfaces/BootSurface'
import { FailureSurface } from '../surfaces/FailureSurface'
import { DiagnosticSurface } from '../surfaces/DiagnosticSurface'

// Experience Surfaces
import { Induction } from '../experience/induction/Induction';
import { InstitutionalDashboard } from '../experience/observatory/InstitutionalDashboard';
import { EvidenceCapture } from '../experience/evidence-capture/EvidenceCapture';
import { StandingThemeAdapter } from '../ui/adapters/StandingThemeAdapter';

export function ActiveSurfaceFrame({ institution }) {
    const [showDiag, setShowDiag] = useState(false);

    // Diagnostic Entry Law: Always possible via key chord
    useEffect(() => {
        const handleKey = (e) => {
            if (e.key === 'D' && e.shiftKey) setShowDiag(prev => !prev);
        };
        window.addEventListener('keydown', handleKey);
        return () => window.removeEventListener('keydown', handleKey);
    }, []);

    // 1. Explicit Failure Mode
    if (institution?.status === 'DEGRADED') {
        return <FailureSurface error={institution?.error || 'INSTITUTIONAL DEGRADATION'} />;
    }

    // 2. Diagnostic Override
    if (showDiag) {
        return <DiagnosticSurface institution={institution} />;
    }

    // 3. Operational or Absence Phase
    const renderRealSurface = () => {
        try {
            // The institution prop passed from App.jsx is the institutionalState (snapshot.state)
            // with a status property added.
            const state = institution || {};

            // Priority 1: Induction (PRE_INDUCTION or INDUCTED states stay in Induction UI until first compliance)
            const standingState = state.standing?.state;
            if (standingState === 'PRE_INDUCTION' || standingState === 'INDUCTED') {
                return <Induction />;
            }

            // Priority 2: Active Session
            if (state.authority?.surfaces && state.authority?.surfaces['EVIDENCE_CAPTURE'] === 'FULL') {
                return <EvidenceCapture startTime={state.session?.startTime} venue={state.session?.venue} />;
            }

            // DEFAULT: THE OBSERVATORY (Handles ALIVE, BOOTING, and NO_INSTITUTION)
            return (
                <InstitutionalDashboard snapshot={{
                    identity: state.identity || { id: 'ORPHAN-GATE', epoch: 'N/A' },
                    phase: institution?.status || 'ABSENT',
                    standing: state.standing || { state: 'VOID', integrity: 0 },
                    authority: state.authority || { surfaces: {}, interactionLevel: 'RESTRICTED' },
                    physiology: state.physiology || { capacity: 100, load: 0, status: 'OPTIMAL', law: { isAuthorized: true } },
                    contracts: {
                        active: state.obligations || [],
                        breaches: state.scars || []
                    },
                    ledger: institution?.ledger || [],
                    diagnostics: {
                        cycles: institution?.cycleCount || 0,
                        memory: '0.0MB',
                        errors: institution?.status === 'NO_INSTITUTION' ? 1 : 0,
                        orphans: institution?.status === 'NO_INSTITUTION' ? 'UNBOUND' : 'NONE'
                    }
                }} />
            );
        } catch (err) {
            return <FailureSurface error={err.message} />;
        }
    };



    return (
        <StandingThemeAdapter institutionalState={institution}>
            <div className="iron-active-frame" style={{
                position: 'relative',
                zIndex: 1,
                width: '100%',
                minHeight: '100vh',
                paddingTop: '32px', // Minimal status bar gap
                display: 'flex',
                flexDirection: 'column'
            }}>
                {renderRealSurface()}
            </div>
        </StandingThemeAdapter>
    );
}
