import React, { useState } from 'react';
import { useGovernance } from '../../context/GovernanceContext';
import '../../ui/styles/InstitutionalTheme.css';
import { NarrativeRegistry } from '../../core/protocols/NarrativeRegistry';

export const ObligationCorridor = ({ obligations }) => {
    // obligations is string[]
    const { declare } = useGovernance();
    const [status, setStatus] = useState('INIT');

    const handleYes = async () => {
        // "Submit Evidence" / "Declare Practice"
        // This will write to ledger -> Update Standing -> Shell switches surface (e.g. to LedgerClosure or SystemState)
        await declare('PRACTICE_COMPLETE');
    };

    const handleRest = async () => {
        await declare('REST_TAKEN');
    };

    const handleFail = async () => {
        await declare('PRACTICE_MISSED');
    };

    return (
        <div className="obligation-surface" style={{
            height: '100vh',
            background: 'var(--civil-bg)',
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center'
        }}>
            <h1 style={{
                fontSize: '2rem',
                fontWeight: '400',
                marginBottom: '40px',
                textAlign: 'center'
            }}>
                {NarrativeRegistry.ADJUDICATION.HEADER}
            </h1>

            <div style={{ marginBottom: '20px', color: 'var(--civil-accent-action)' }}>
                REQUIRED: {obligations.join(', ')}
            </div>

            <div style={{ display: 'grid', gap: '16px', width: '100%', maxWidth: '400px' }}>
                {/* MVP: Hardcoded buttons for the standard obligations */}

                <button
                    className="civil-button"
                    onClick={handleYes}
                >
                    {NarrativeRegistry.ADJUDICATION.BTN_CONFIRM}
                </button>

                <button
                    className="civil-button"
                    style={{ background: 'transparent', border: '1px solid var(--civil-text-secondary)' }}
                    onClick={handleRest}
                >
                    {NarrativeRegistry.ADJUDICATION.BTN_REST}
                </button>

                <button
                    className="civil-button"
                    style={{ background: 'transparent', color: 'var(--civil-text-muted)' }}
                    onClick={handleFail}
                >
                    {NarrativeRegistry.ADJUDICATION.BTN_FAIL}
                </button>
            </div>

            <div style={{ marginTop: '40px', fontSize: '0.8rem', color: 'var(--civil-text-muted)' }}>
                {NarrativeRegistry.ADJUDICATION.FOOTER}
            </div>
        </div>
    );
};
