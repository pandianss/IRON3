import React, { useState } from 'react';
import { useGovernance } from '../../../context/GovernanceContext';
import { useNavigate } from 'react-router-dom';
import '../../styles/InstitutionalTheme.css';
import { NarrativeRegistry } from '../../../core/protocols/NarrativeRegistry';

const DailyAdjudication = () => {
    const { declarePractice } = useGovernance();
    const navigate = useNavigate();
    const [status, setStatus] = useState('INIT'); // INIT, REASON, CONFIRM

    const handleYes = async () => {
        await declarePractice('PRACTICE_COMPLETE');
        navigate('/');
    };

    const handleRest = async () => {
        await declarePractice('REST_TAKEN');
        navigate('/');
    };

    const handleFail = async () => {
        // In a real app this might ask for a reason before failing
        // For local sim, we can just trigger a miss which might lead to fracture logic
        // But for now, let's just record a "Miss" which doesn't protect the streak
        await declarePractice('PRACTICE_MISSED');
        navigate('/');
    };

    return (
        <div style={{
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

            <div style={{ display: 'grid', gap: '16px', width: '100%', maxWidth: '400px' }}>
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

export default DailyAdjudication;
