import React from 'react';
import { useGovernance } from '../../../context/GovernanceContext';
import NarrativeCard from '../../components/institutional/NarrativeCard';
import '../../styles/InstitutionalTheme.css';
import { NarrativeRegistry } from '../../../core/protocols/NarrativeRegistry';

const FractureNarrative = () => {
    const { declarePractice } = useGovernance();

    const handleAcknowledge = () => {
        declarePractice('ENTER_RECOVERY');
    };

    return (
        <div style={{
            height: '100vh',
            background: 'var(--civil-bg)',
            padding: '40px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center'
        }}>
            <div style={{ maxWidth: '600px', width: '100%' }}>
                <div style={{
                    borderLeft: '4px solid var(--civil-accent-alert)',
                    paddingLeft: '20px',
                    marginBottom: '40px'
                }}>
                    <h1 style={{
                        color: 'var(--civil-accent-alert)',
                        fontSize: '3rem',
                        margin: 0,
                        lineHeight: 1
                    }}>
                        {NarrativeRegistry.FRACTURE.TITLE}
                    </h1>
                    <div style={{
                        fontSize: '0.9rem',
                        color: 'var(--civil-text-secondary)',
                        letterSpacing: '2px',
                        marginTop: '8px'
                    }}>
                        {NarrativeRegistry.FRACTURE.EVENT_ID_PREFIX}2026-001
                    </div>
                </div>

                <NarrativeCard
                    type="ORDER"
                    date="IMMEDIATE"
                    content={NarrativeRegistry.FRACTURE.ORDER}
                />

                <div style={{ marginTop: '40px', borderTop: 'var(--civil-border)', paddingTop: '20px' }}>
                    <p style={{ color: 'var(--civil-text-primary)', marginBottom: '24px' }}>
                        {NarrativeRegistry.FRACTURE.PATH}
                    </p>
                    <button
                        className="civil-button"
                        onClick={handleAcknowledge}
                        style={{
                            width: '100%',
                            background: 'var(--civil-accent-alert)',
                            color: '#000',
                            fontWeight: 'bold'
                        }}
                    >
                        ACKNOWLEDGE & BEGIN RECOVERY
                    </button>
                    <div style={{ textAlign: 'center', marginTop: '16px', fontSize: '0.8rem', color: 'var(--civil-text-secondary)' }}>
                        This action will be added to your permanent record.
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FractureNarrative;
