import React, { useState, useEffect } from 'react';
import { useGovernance } from '../context/GovernanceContext';
import { NoInstitutionSurface } from '../surfaces/NoInstitutionSurface'
import { BootSurface } from '../surfaces/BootSurface'
import { FailureSurface } from '../surfaces/FailureSurface'
import { DiagnosticSurface } from '../surfaces/DiagnosticSurface'

// Experience Core
import { ExperienceKernel } from '../experience/kernel/experienceKernel';
import { RitualGate } from '../experience/rituals/RitualGate';
import { StandingGate } from '../experience/kernel/StandingGate';

// Experience Surfaces
import { Induction } from '../experience/induction/Induction';
import { InstitutionalDashboard } from '../experience/observatory/InstitutionalDashboard';
import { EvidenceCapture } from '../experience/evidence-capture/EvidenceCapture';
import { StandingThemeAdapter } from '../ui/adapters/StandingThemeAdapter';
import { ThresholdSurface } from '../experience/observatory/ThresholdSurface';

export function ActiveSurfaceFrame({ institution, children }) {
    const { declare, institutionalState } = useGovernance();
    const [showDiag, setShowDiag] = useState(false);

    // Diagnostic Entry Law: Always possible via key chord
    useEffect(() => {
        const handleKey = (e) => {
            if (e.key.toUpperCase() === 'D' && e.shiftKey) {
                console.log("DIAGNOSTIC TOGGLE DETECTED");
                setShowDiag(prev => !prev);
            }
        };
        window.addEventListener('keydown', handleKey);
        return () => window.removeEventListener('keydown', handleKey);
    }, []);

    // 3. Operational or Absence Phase (Binding to Experience Kernel)
    const renderRealSurface = () => {
        try {
            // Snapshot from Governance Context is already enriched and includes history
            const snapshot = institutionalState || { state: {}, history: [], mandates: null };

            // Diagnostic Override is still high-priority but checked against Kernel
            if (showDiag) {
                ExperienceKernel.authorizeSurface("Diagnostic", snapshot);
                return <DiagnosticSurface institution={snapshot} />;
            }

            // Determine Target Surface and its Contract
            let targetSurface = "Standing";
            let surfaceComponent = InstitutionalDashboard;

            const standingState = snapshot.standing?.state;
            const hasStartedInduction = snapshot.foundation?.why || snapshot.foundation?.brokenPromise;

            if (!snapshot.identity && !hasStartedInduction) {
                targetSurface = "NoInstitution";
                surfaceComponent = NoInstitutionSurface;
            } else if (!snapshot.identity && hasStartedInduction) {
                // If induction started but identity is missing, it means we are in the induction flow
                targetSurface = "Induction";
                surfaceComponent = Induction;
            } else if (snapshot.identity && !snapshot.standing) {
                // If identity exists but no standing, it means we are in the threshold flow
                targetSurface = "Threshold";
                surfaceComponent = ThresholdSurface;
            } else if (snapshot.identity && snapshot.standing && !snapshot.mandates) {
                // If identity and standing exist but no mandates, it means we are in the boot flow
                targetSurface = "Boot";
                surfaceComponent = BootSurface;
            } else if (snapshot.identity && snapshot.standing && snapshot.mandates) {
                // If identity, standing, and mandates exist, we are in the standing phase
                targetSurface = "Standing";
                surfaceComponent = InstitutionalDashboard;
            }

            // CHOKE-POINT: Enter Experience with Contract
            const experience = ExperienceKernel.enterExperience(targetSurface, snapshot, surfaceComponent.contract);
            const { surface, context, orientation } = experience;

            // RENDER DISPATCH (Wrapped in StandingGate)
            const renderWithGate = (comp, isRitualSurface = false) => {
                const content = (
                    <StandingGate surfaceName={surface} contract={surfaceComponent.contract} snapshot={snapshot}>
                        {comp}
                    </StandingGate>
                );

                if (isRitualSurface) return content;

                return (
                    <RitualGate snapshot={snapshot}>
                        {content}
                    </RitualGate>
                );
            };

            switch (surface) {
                case "Induction":
                    return renderWithGate(<Induction orientation={orientation} />, true);
                case "EvidenceCapture":
                    return renderWithGate(<EvidenceCapture
                        startTime={snapshot.state.session?.startTime}
                        venue={snapshot.state.session?.venue}
                        orientation={orientation}
                    />, true);
                case "Threshold":
                    return renderWithGate(<ThresholdSurface orientation={orientation} />, true);
                case "Diagnostic":
                    return renderWithGate(<DiagnosticSurface institution={snapshot} orientation={orientation} />, true);
                case "Failure":
                    return renderWithGate(<FailureSurface error="Experience Law Violation" orientation={orientation} />, true);
                case "NoInstitution":
                    return renderWithGate(
                        <NoInstitutionSurface
                            onInitialize={() => {
                                ExperienceKernel.authorizeSurface("Induction", snapshot);
                                declare('INIT_INDUCTION', { timestamp: new Date().toISOString() });
                            }}
                            onDiagnostic={() => setShowDiag(true)}
                        />,
                        true
                    );
                case "Boot":
                    return renderWithGate(<BootSurface orientation={orientation} />, true);
                case "Standing":
                default:
                    return renderWithGate(
                        <InstitutionalDashboard snapshot={snapshot} />
                    );
            }
        } catch (err) {
            console.error("UX-SOVEREIGNTY BREACH:", err.message);
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
                {/* Providers and Bridge must mount here to drive the institutional state */}
                {children}
            </div>
        </StandingThemeAdapter>
    );
}
