import React, { useEffect, useState } from 'react';
import { useGovernance } from '../../context/GovernanceContext';
import { useStanding } from '../../ui/hooks/useStanding';
import '../../ui/styles/InstitutionalTheme.css';

// Primitives
import { StandingBanner } from '../../ui/components/authority/StandingBanner';
import { VerdictPanel } from '../../ui/components/authority/VerdictPanel';
import { ContinuityBand } from '../../ui/components/temporal/ContinuityBand';
import { ComplianceControl } from '../../ui/components/obligation/ComplianceControl';

/**
 * Phase 1: Daily Verdict Screen
 * Ref: DAILY_VERDICT_BLUEPRINT.md
 */
export const LedgerClosure = (props) => {
    const { institutionalState, declare } = useGovernance(); // Get fresh state
    const interpretation = useStanding();

    // Animation Staging (Entry Sequence)
    const [phase, setPhase] = useState(0);

    useEffect(() => {
        // Phase 1: Institutional Arrival (Immediate)
        setPhase(1);

        // Phase 2: Verdict Declaration (0.8s Delay)
        const timer1 = setTimeout(() => setPhase(2), 800);

        // Phase 3: Temporal Consequence (1.6s Delay)
        const timer2 = setTimeout(() => setPhase(3), 1600);

        return () => { clearTimeout(timer1); clearTimeout(timer2); };
    }, []);

    const handleAcknowledge = async () => {
        // "The institution closes the day before the user continues."
        // Action: 'CONTINUE_CYCLE' -> Logic should move user to next state/screen
        await declare('CONTINUE_CYCLE');
    };

    // Derived Data
    const { standingBand } = interpretation;
    const isBreach = standingBand === 'BREACH';

    // Verdict Message Logic
    const getVerdict = () => {
        if (isBreach) return { title: "BREACH RECORDED", message: "Fracture detected in continuity." };
        if (standingBand === 'RECOVERY') return { title: "RECOVERY PROTOCOL", message: "Reconstruction phase active." };
        if (standingBand === 'RISK') return { title: "RISK ELEVATED", message: "Instability detected in streak." };
        if (standingBand === 'ASCENDING') return { title: "ASCENSION TRACKED", message: "Institutional standards exceeded." };
        return { title: "CONTINUITY CONFIRMED", message: "Institutional standards met." };
    };

    const verdict = getVerdict();

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            background: 'var(--iron-bg-primary)',
            color: 'var(--iron-text-primary)',
            animation: 'fadeIn 1s ease'
        }}>

            {/* ZONE 1: AUTHORITY (Always Visible, Assertion) */}
            <div style={{
                opacity: phase >= 1 ? 1 : 0,
                transition: 'opacity 1s var(--iron-ease-authority)',
                borderBottom: '1px solid var(--iron-border)'
            }}>
                <StandingBanner
                    standing={institutionalState.standing}
                    era={institutionalState.currentEra}
                />

                <div style={{ padding: 'var(--iron-space-lg)', maxWidth: '600px', margin: '0 auto', width: '100%' }}>
                    {/* Verdict slides in */}
                    <div style={{
                        transform: phase >= 2 ? 'translateY(0)' : 'translateY(-20px)',
                        opacity: phase >= 2 ? 1 : 0,
                        transition: 'all 0.5s var(--iron-ease-authority)'
                    }}>
                        <VerdictPanel
                            type={standingBand}
                            title={verdict.title}
                            message={verdict.message}
                        />
                    </div>
                </div>
            </div>

            {/* ZONE 2: CONTINUITY */}
            <div style={{
                padding: 'var(--iron-space-lg)',
                opacity: phase >= 3 ? 1 : 0,
                transition: 'opacity 1s ease 0.2s',
                textAlign: 'center'
            }}>
                <ContinuityBand streak={institutionalState.standing.streak} />
            </div>

            {/* ZONE 3: TEMPORAL (Ledger Stub) */}
            <div style={{
                flex: 1,
                padding: 'var(--iron-space-lg)',
                opacity: phase >= 3 ? 0.6 : 0,
                transition: 'opacity 1s ease 0.5s',
                display: 'flex',
                justifyContent: 'center'
            }}>
                <div className="rect-border" style={{
                    padding: 'var(--iron-space-lg)',
                    background: 'var(--iron-surface)',
                    width: '100%',
                    maxWidth: '600px'
                }}>
                    <div className="text-sm-caps" style={{ marginBottom: 'var(--iron-space-md)' }}>RECENT LEDGER</div>
                    <div className="font-numeric text-muted">
                        {/* Mock Last Entries */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                            <span>DAY {institutionalState.standing.streak || 1}</span>
                            <span style={{ color: 'var(--iron-accent)' }}>CLOSED</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* ZONE 4: EXECUTION / EXIT */}
            <div style={{
                padding: 'var(--iron-space-lg)',
                opacity: phase >= 3 ? 1 : 0,
                transition: 'opacity 0.5s ease 1s',
                maxWidth: '600px', margin: '0 auto', width: '100%'
            }}>
                <ComplianceControl
                    label="ACKNOWLEDGE VERDICT"
                    onComplete={handleAcknowledge}
                    variant={isBreach ? 'breach' : 'standard'}
                />
            </div>

        </div>
    );
};
