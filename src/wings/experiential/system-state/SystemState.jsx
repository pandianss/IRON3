import React from 'react';
import { useGovernance } from '../../context/GovernanceContext';
import { useStanding } from '../../ui/hooks/useStanding';
import '../../ui/styles/InstitutionalTheme.css';

// Primitives
import { StandingBanner } from '../../ui/components/authority/StandingBanner';
import { VerdictPanel } from '../../ui/components/authority/VerdictPanel';
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

    // Domain Abstraction (Configurable via Context in future)
    const domain = {
        // Fitness
        name: 'IRON PROTOCOL',
        unit: 'DAILY PRACTICE',
        action: 'INITIATE'

        // Exam Example:
        // name: 'GATE PREPARATION',
        // unit: 'MOCK TEST',
        // action: 'ATTEMPT'
    };

    // Derived content for MVP
    const contracts = [
        {
            id: 'daily_obligation',
            title: domain.unit,
            type: 'OBLIGATION',
            riskWeight: standingBand === 'RISK' ? 0.8 : 0
        }
    ];

    const isDailyComplete = () => {
        if (!institutionalState.standing.lastPracticeDate) return false;
        const last = new Date(institutionalState.standing.lastPracticeDate);
        const now = new Date();
        return last.toDateString() === now.toDateString();
    };

    const actionLabel = isDailyComplete() ? 'ADDITIONAL EFFORT' : domain.action;

    const handleContractAction = async (contract) => {
        // Phase 2.5: Declare Intent (Opens the Intake Surface)
        await declare('SESSION_INTENT', {
            contractId: contract.id
        });
    };

    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>

            {/* AUTHORITY HEADER */}
            <StandingBanner
                standing={institutionalState.standing}
                era={institutionalState.currentEra}
            />

            {/* MANDATE VOICEOVER */}
            <div style={{ maxWidth: 600, margin: '0 auto', width: '100%', marginTop: 'var(--iron-space-lg)' }}>
                <VerdictPanel />
            </div>

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
                    onSelect={handleContractAction}
                    actionLabel={actionLabel}
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
