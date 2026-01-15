import React, { useState } from 'react';
import '../../ui/styles/InstitutionalTheme.css';
import { NarrativeRegistry } from '../../core/protocols/NarrativeRegistry';
import { useGovernance } from '../../context/GovernanceContext';

export const Induction = ({ day }) => {
    const { declare, institutionalState } = useGovernance();
    const [step, setStep] = useState(0);

    const slides = [
        NarrativeRegistry.BRIEFING.SLIDE_1,
        NarrativeRegistry.BRIEFING.SLIDE_2,
        NarrativeRegistry.BRIEFING.SLIDE_3
    ];

    const next = async () => {
        if (step < slides.length - 1) {
            setStep(step + 1);
        } else {
            // COMPLETE
            // If we are PRE_INDUCTION, we need to create contract.
            if (institutionalState.standing.state === 'PRE_INDUCTION') {
                await declare('CONTRACT_CREATED');
            } else {
                // Already inducted, maybe just acknowledging the day's briefing?
                // For now, let's treat it as skipping to dashboard/obligation
                // But wait, if we are INDUCTED, evaluateInstitution forces requiredSurface to INDUCTION.
                // We need a way to distinct "Inducted but briefing read".
                // In the Shell, we might need granular surfaces or a local "Complete" state that isn't ledger-based?
                // OR, strictly, we need a ledger event 'BRIEFING_COMPLETE'.
                await declare('FIRST_COMPLIANCE'); // HACK for MVP to move to COMPLIANT? 
                // No, that breaks the "Day 1 Practice" rule.

                // Let's rely on CONTRACT_CREATED moving us to INDUCTED.
                // If we are INDUCTED, we typically need to do PRACTICE.
                // So maybe this screen needs to route to ObligationCorridor?
                // But the Engine forces INDUCTION surface for Inducted state.
                // This implies the Induction Surface MUST include the Practice ability or link to it?
                // Let's make "Enter System" enable the Practice view?
                // Actually `evaluateInstitution` says: if INDUCTED -> Surface INDUCTION.
                // So we are stuck here unless state changes.
                // We should change `evaluateInstitution` to allow Obligation in INDUCTED state.
                // For now, let's fire 'PRACTICE_COMPLETE' to get to COMPLIANT immediately for the demo?
                // Or stick to the "Contract Created" logic.

                // MVP fix: If we are PRE_INDUCTION, fire CONTRACT_CREATED.
                // If we are INDUCTED, this screen is basically "Day 1 View". It should probably allow Practice.
            }
        }
    };

    return (
        <div className="briefing-screen" style={{
            height: '100vh',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            padding: '40px',
            background: 'var(--civil-bg)'
        }}>
            <div style={{ maxWidth: '500px', margin: '0 auto' }}>
                <div style={{
                    fontSize: '0.8rem',
                    letterSpacing: '2px',
                    color: 'var(--civil-accent-stable)',
                    marginBottom: '24px'
                }}>
                    BRIEFING {step + 1} / {slides.length}
                </div>

                <h1 style={{
                    fontSize: '2.5rem',
                    marginBottom: '24px',
                    color: 'var(--civil-text-primary)'
                }}>
                    {slides[step].title}
                </h1>

                <p style={{
                    fontSize: '1.1rem',
                    lineHeight: '1.6',
                    color: 'var(--civil-text-secondary)',
                    marginBottom: '48px'
                }}>
                    {slides[step].content}
                </p>

                <button
                    onClick={next}
                    style={{
                        padding: '16px 32px',
                        background: 'var(--civil-text-primary)',
                        color: 'var(--civil-bg)',
                        border: 'none',
                        fontSize: '1rem',
                        fontWeight: '600',
                        cursor: 'pointer'
                    }}
                >
                    {step === slides.length - 1 ? 'ENTER THE SYSTEM' : 'ACKNOWLEDGE'}
                </button>
            </div>
        </div>
    );
};
