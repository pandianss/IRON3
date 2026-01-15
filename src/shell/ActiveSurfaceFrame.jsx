import React from 'react';
import { NoInstitutionSurface } from '../surfaces/NoInstitutionSurface';
import { BootSurface } from '../surfaces/BootSurface';

// Experience Surfaces
import { Induction } from '../experience/induction/Induction';
import { SystemState } from '../experience/system-state/SystemState';
import { EvidenceCapture } from '../experience/evidence-capture/EvidenceCapture';
// import { ObligationCorridor } from '../experience/obligation-corridor/ObligationCorridor'; // Not used in primary routing yet
// import { LedgerClosure } from '../experience/ledger-closure/LedgerClosure'; // Not used yet
// import { ConsequenceHall } from '../experience/consequence-hall/ConsequenceHall'; // Not used yet

import { StandingThemeAdapter } from '../ui/adapters/StandingThemeAdapter';

export function ActiveSurfaceFrame({ institution }) {
    if (!institution) return <NoInstitutionSurface />;

    if (institution.status === 'BOOTING') return <BootSurface />;

    // --- ROUTING LOGIC ---
    // Extract Domains
    const { standing, authority, session } = institution;

    const renderSurface = () => {
        try {
            // Safety Check
            if (!standing || !authority) {
                return (
                    <div style={{ padding: 24, paddingTop: 60, color: '#ff0000' }}>
                        <h2>CRITICAL STATE CORRUPTION</h2>
                        <p>Missing Standing or Authority domains.</p>
                        <pre>{JSON.stringify(institution, null, 2)}</pre>
                    </div>
                );
            }

            // 1. Induction
            if (standing.state === 'PRE_INDUCTION' || standing.state === 'INDUCTION') {
                return <Induction />;
            }

            // 2. Active Session (Evidence Capture)
            if (authority.surfaces && authority.surfaces['EVIDENCE_CAPTURE'] === 'FULL') {
                return <EvidenceCapture startTime={session?.startTime} venue={session?.venue} />;
            }

            // 3. System State (Default Dashboard)
            return (
                <SystemState
                    state={standing}
                    era={institution.currentEra}
                    scars={institution.scars}
                />
            );

        } catch (err) {
            return (
                <div style={{ padding: 24, paddingTop: 60, color: '#ff0000' }}>
                    <h2>SURFACE RENDER CRASH</h2>
                    <pre>{err.message}</pre>
                </div>
            )
        }
    };

    // Wrap in Theme Adapter to ensure colors match standing
    return (
        <StandingThemeAdapter institutionalState={institution}>
            <div style={{
                position: 'relative',
                zIndex: 1,
                width: '100%',
                minHeight: '100vh',
                paddingTop: '32px', // Clear Status Bar
                display: 'flex',
                flexDirection: 'column'
            }}>
                {renderSurface()}
            </div>
        </StandingThemeAdapter>
    );
}
