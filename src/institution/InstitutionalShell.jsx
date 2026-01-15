import React, { useState, useEffect } from 'react';
import { SurfaceId } from '../institution/standing-engine/types';
import { StandingThemeAdapter } from '../ui/adapters/StandingThemeAdapter';

// The Spine
import { IronAppShell } from '../experience/spine/IronAppShell';

// Fallback Surfaces (Boot, Diagnostic, Etc)
import { NoInstitutionSurface } from '../experience/boot/NoInstitutionSurface';
import { BootingSurface } from '../experience/boot/BootingSurface';
import { DegradedSurface } from '../experience/diagnostic/DegradedSurface';
import { DiagnosticSurface } from '../experience/diagnostic/DiagnosticSurface';

// Experience Surfaces
import { SystemState } from '../experience/system-state/SystemState';
import { ObligationCorridor } from '../experience/obligation-corridor/ObligationCorridor';
import { EvidenceCapture } from '../experience/evidence-capture/EvidenceCapture';
import { LedgerClosure } from '../experience/ledger-closure/LedgerClosure';
import { ConsequenceHall } from '../experience/consequence-hall/ConsequenceHall';
import { Induction } from '../experience/induction/Induction';

/**
 * INSTITUTIONAL SHELL
 * 
 * The bridge between the Kernel and the User Experience.
 * Now enforced by the Guaranteed Render Spine.
 * 
 * Rule: NEVER RETURN NULL. ALWAYS RETURN <IronAppShell />.
 */
export const InstitutionalShell = ({ institutionalState, loading }) => {
    // Local ephemeral state for UI overrides (Diagnostics made visible)
    const [showDiagnostic, setShowDiagnostic] = useState(false);
    const [renderError, setRenderError] = useState(null);

    // --- 1. DETERMINE SPINE STATE (Layers 1 & 2) ---
    const connected = !!institutionalState;
    const standingLabel = institutionalState?.standing?.state || 'UNKNOWN';
    const phaseLabel = loading ? 'BOOTING' : (institutionalState ? 'OPERATIONAL' : 'DISCONNECTED');

    // System Message extraction (if any exists in state)
    // Future: Extract from institutionalState.signals or similar
    const systemMessage = null;

    // --- 2. DETERMINE ACTIVE SURFACE (Layer 3) ---
    const getActiveSurface = () => {
        // A. Hard Overrides (Diagnostics, Crashes)
        if (renderError) {
            return (
                <DegradedSurface
                    error={renderError}
                    onRetry={() => setRenderError(null)}
                    onDiagnostic={() => setShowDiagnostic(true)}
                />
            );
        }

        if (showDiagnostic) {
            return (
                <DiagnosticSurface
                    institutionalState={institutionalState}
                    onClose={() => setShowDiagnostic(false)}
                />
            );
        }

        // B. Boot / Connection States
        if (loading) {
            return <BootingSurface step="CONNECTING TO KERNEL" />;
        }

        if (!institutionalState) {
            return (
                <NoInstitutionSurface
                    onInitialize={() => window.location.reload()} // Placeholder for init action
                    onDiagnostic={() => setShowDiagnostic(true)}
                />
            );
        }

        // C. Institutional Routing Logic
        // Priority: Induction > Evidence > Obligation > SystemState
        const { authority, standing, session } = institutionalState;

        try {
            // Safety check for critical sub-domains
            if (!authority || !standing) {
                throw new Error("CRITICAL STATE CORRUPTION: MISSING DOMAINS");
            }

            if (standing.state === 'PRE_INDUCTION' || standing.state === 'INDUCTION') {
                return <Induction />;
            }

            if (authority.surfaces && authority.surfaces['EVIDENCE_CAPTURE'] === 'FULL') {
                return <EvidenceCapture startTime={session?.startTime} venue={session?.venue} />;
            }

            if (authority.surfaces && authority.surfaces['OBLIGATION_CORRIDOR'] === 'FULL') {
                // Default to System State / Dashboard for now
                // Future: Route to specific Obligation Corridor if needed
                return <SystemState
                    state={standing}
                    era={institutionalState.currentEra}
                    scars={institutionalState.scars}
                />;
            }

            // Fallback for Operational State
            return (
                <SystemState
                    state={standing}
                    era={institutionalState.currentEra}
                    scars={institutionalState.scars}
                />
            );

        } catch (err) {
            console.error("Routing Error:", err);
            return (
                <DegradedSurface
                    error={err}
                    onRetry={() => window.location.reload()}
                    onDiagnostic={() => setShowDiagnostic(true)}
                />
            );
        }
    };

    // --- 3. RENDER SPINE (Guaranteed) ---
    return (
        <StandingThemeAdapter institutionalState={institutionalState}>
            <IronAppShell
                phase={phaseLabel}
                standing={standingLabel}
                connected={connected}
                systemMessage={systemMessage}
            >
                {/* 
                    Error Boundary for Render Layer 
                    We wrap the content generator to catch render crashes 
                    and show the DegradedSurface instead of a blank screen.
                */}
                <ErrorBoundary fallback={(err) => (
                    <DegradedSurface
                        error={err}
                        onRetry={() => setRenderError(null)}
                        onDiagnostic={() => setShowDiagnostic(true)}
                    />
                )}>
                    {getActiveSurface()}
                </ErrorBoundary>

            </IronAppShell>
        </StandingThemeAdapter>
    );
};

// Internal minimal ErrorBoundary for the Shell
class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error("Institutional Render Error:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return this.props.fallback(this.state.error);
        }
        return this.props.children;
    }
}
