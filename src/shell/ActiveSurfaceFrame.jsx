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
    // The Dashboard is the "Always-on" surface, even for Orphans.
    const renderRealSurface = () => {
        try {
            // Priority 1: Induction
            if (institution?.standing?.state === 'PRE_INDUCTION' || institution?.standing?.state === 'INDUCTION') {
                return <Induction />;
            }

            // Priority 2: Active Session
            if (institution?.authority?.surfaces && institution?.authority?.surfaces['EVIDENCE_CAPTURE'] === 'FULL') {
                return <EvidenceCapture startTime={institution?.session?.startTime} venue={institution?.session?.venue} />;
            }

            // DEFAULT: THE OBSERVATORY (Handles ALIVE, BOOTING, and NO_INSTITUTION)
            return (
                <InstitutionalDashboard snapshot={{
                    identity: institution?.identity || { id: 'ORPHAN-GATE', epoch: 'N/A' },
                    phase: institution?.status || 'ABSENT',
                    standing: institution?.standing || { state: 'VOID', integrity: 0 },
                    authority: institution?.authority || { surfaces: {}, interactionLevel: 'RESTRICTED' },
                    contracts: {
                        active: institution?.obligations || [],
                        breaches: institution?.scars || []
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
