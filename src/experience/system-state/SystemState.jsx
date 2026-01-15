import React from 'react';
import { useGovernance } from '../../context/GovernanceContext';
import { useStanding } from '../../ui/hooks/useStanding';
import '../../ui/styles/InstitutionalTheme.css';

// Primitives
import { StandingBanner } from '../../ui/components/authority/StandingBanner';
import { ObligationStack } from '../../ui/components/obligation/ObligationStack';
import { ContinuityBand } from '../../ui/components/temporal/ContinuityBand';

/**
 * Phase 2.1: Obligation Hall (formerly SystemState)
 * Role: Forward-looking view of what is owed.
 */
export const SystemState = (props) => {
    // We ignore legacy props (state, era) and use the Hook, 
    // ensuring "Unidirectional Data Flow" (Design-to-Code Spec).
    const { institutionalState, declare } = useGovernance();
    const interpretation = useStanding(); // Subscribes to interpreted state
    const { standingBand } = interpretation;

    // Derived content for MVP
    // In a real app, 'contracts' would come from the engine/ledger.
    // For now, we hardcode the "Daily Practice" contract.
    const contracts = [
        {
            id: 'daily_practice',
            title: 'DAILY PRACTICE',
            type: 'PRACTICE',
            riskWeight: standingBand === 'RISK' ? 0.8 : 0
        }
    ];

    const handleContractAction = async (contract) => {
        // Navigate to Compliance Chamber (Action Screen)
        // For MVP, we might just declare direct success if we don't have routing yet,
        // BUT the plan says "Home -> Obligation Hall" and "Action -> Compliance Chambers".
        // The Shell renders SurfaceId.OBLIGATION_CORRIDOR for action.
        // We probably need a way to 'enter' the corridor from here.
        // For now, let's assume the Shell triggers OBLIGATION_CORRIDOR on a separate state, 
        // OR we just execute here for simplicity in this step.

        // Let's adhere to the "Refactor" plan:
        // "Action feels binding... Completion triggers institutional response."
        // If we click here, we strictly should go to the "Execution Mode".
        // But for this specific task, let's allow 'Completing' via the stack for now 
        // until we wire up the Navigation between Hall and Chamber.

        await declare('PRACTICE_COMPLETE');
    };

    return (
        <div className="surface-authority" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>

            {/* AUTHORITY HEADER */}
            <StandingBanner
                standing={institutionalState.standing}
                era={institutionalState.currentEra}
            />

            {/* TEMPORAL CONTEXT (Mini) */}
            <div style={{ padding: '0 var(--iron-space-lg)' }}>
                <ContinuityBand streak={institutionalState.standing.streak} />
            </div>

            {/* OBLIGATION HALL MAIN FLOOR */}
            <div style={{
                flex: 1,
                padding: 'var(--iron-space-lg)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                maxWidth: '600px',
                margin: '0 auto',
                width: '100%'
            }}>
                <div className="text-sm-caps" style={{
                    marginBottom: 'var(--iron-space-md)',
                    opacity: 0.7,
                    textAlign: 'center'
                }}>
                    PENDING CONTRACTS
                </div>

                <ObligationStack
                    contracts={contracts}
                    onSelect={handleContractAction}
                />
            </div>

            {/* HUMAN LAYER (Footer) */}
            <div style={{
                padding: 'var(--iron-space-md)',
                textAlign: 'center',
                opacity: 0.4,
                fontSize: '0.7rem'
            }}>
                IRON INSTITUTION | v3.0
            </div>
        </div>
    );
};
