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

    // 3. No Institution Fallback
    if (!institution || institution.status === 'NO_INSTITUTION') {
        return <NoInstitutionSurface />;
    }

    // 4. Boot Phase
    if (institution.status === 'BOOTING') {
        return <BootSurface />;
    }

    // 5. Alive / Operational Phase
    const { standing, authority, session } = institution;

    const renderRealSurface = () => {
        try {
            if (!standing || !authority) {
                return <FailureSurface error="STATE CORRUPTION: MISSING DOMAINS" />;
            }

            if (standing.state === 'PRE_INDUCTION' || standing.state === 'INDUCTION') {
                return <Induction />;
            }

            if (authority.surfaces && authority.surfaces['EVIDENCE_CAPTURE'] === 'FULL') {
                return <EvidenceCapture startTime={session?.startTime} venue={session?.venue} />;
            }

            // DEFAULT GOVERNED SURFACE: THE OBSERVATORY
            // We pass the full institution state as the snapshot
            return (
                <InstitutionalDashboard snapshot={{
                    identity: { id: 'SIGMA-9', epoch: '2025' },
                    phase: institution.status,
                    standing: standing,
                    authority: authority,
                    contracts: {
                        active: institution.obligations || [],
                        breaches: institution.scars || []
                    },
                    ledger: institution.ledger || [],
                    diagnostics: {
                        cycles: institution.cycleCount || 0,
                        memory: '1.2MB',
                        errors: 0,
                        orphans: 'NONE'
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
