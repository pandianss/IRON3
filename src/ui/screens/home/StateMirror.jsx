import React from 'react';
import { useGovernance } from '../../../context/GovernanceContext';
import NarrativeCard from '../../components/institutional/NarrativeCard';
import { Shield, AlertCircle, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import '../../styles/InstitutionalTheme.css';
import { NarrativeRegistry } from '../../../core/protocols/NarrativeRegistry';

const StateMirror = () => {
    const navigate = useNavigate();
    const {
        currentCondition,
        currentLaws,
        declarePractice,
        isFractured,
        isAtRisk,
        streak
    } = useGovernance();

    // Mapping condition to visual severity
    const getConditionColor = () => {
        if (isFractured) return 'var(--civil-accent-alert)';
        if (isAtRisk) return 'var(--civil-accent-action)';
        return 'var(--civil-text-primary)';
    };

    return (
        <div className="state-mirror" style={{ padding: '40px 20px', maxWidth: '600px', margin: '0 auto' }}>

            {/* 1. STATE HEADER */}
            <header style={{ marginBottom: '40px', borderBottom: 'var(--civil-border)', paddingBottom: '20px' }}>
                <div style={{ fontSize: '0.8rem', letterSpacing: '2px', color: 'var(--civil-text-muted)', marginBottom: '8px' }}>
                    CURRENT CONDITION
                </div>
                <h1 style={{
                    fontSize: '2rem',
                    fontWeight: '400',
                    color: getConditionColor(),
                    margin: 0
                }}>
                    {currentCondition.replace('_', ' ')}
                </h1>
                <p style={{ marginTop: '12px', color: 'var(--civil-text-secondary)', fontSize: '0.9rem' }}>
                    {currentLaws.description}
                </p>
            </header>

            {/* 2. LAWFUL ACTS */}
            <section style={{ marginBottom: '40px' }}>
                <div style={{ fontSize: '0.8rem', letterSpacing: '2px', color: 'var(--civil-text-muted)', marginBottom: '16px' }}>
                    LAWFUL ACTS
                </div>

                <div className="actions-grid" style={{ display: 'grid', gap: '12px' }}>
                    {currentLaws.obligations.includes('DAILY_PRACTICE') && (
                        <button
                            className="civil-button big"
                            onClick={() => navigate('/daily')}
                            style={{
                                width: '100%',
                                padding: '16px',
                                background: 'transparent',
                                border: '1px solid var(--civil-text-secondary)',
                                color: 'var(--civil-text-primary)',
                                textAlign: 'left',
                                cursor: 'pointer',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center'
                            }}
                        >
                            <span>BEGIN DAILY ADJUDICATION</span>
                            <span style={{ fontSize: '0.8rem', opacity: 0.5 }}>FORM 202</span>
                        </button>
                    )}

                    {currentLaws.obligations.includes('ENTER_RECOVERY') && (
                        <button
                            className="civil-button alert"
                            style={{
                                width: '100%',
                                padding: '16px',
                                background: 'rgba(217, 83, 79, 0.1)',
                                border: '1px solid var(--civil-accent-alert)',
                                color: 'var(--civil-accent-alert)',
                                textAlign: 'left',
                                cursor: 'pointer'
                            }}
                        >
                            ACKNOWLEDGE FRACTURE & BEGIN RECOVERY
                        </button>
                    )}
                </div>
            </section>

            {/* 3. RECORD MONITOR */}
            <section>
                <div style={{ fontSize: '0.8rem', letterSpacing: '2px', color: 'var(--civil-text-muted)', marginBottom: '16px' }}>
                    SYSTEM RECORD
                </div>

                <div className="stats-row" style={{ display: 'flex', gap: '24px', marginBottom: '24px' }}>
                    <div>
                        <div style={{ fontSize: '2rem', fontWeight: '300' }}>{streak}</div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--civil-text-secondary)' }}>CONTINUITY DAYS</div>
                    </div>
                </div>

                <NarrativeCard
                    type="NOTICE"
                    date="TODAY"
                    content={NarrativeRegistry.STATUS.INDUCTION}
                />
            </section>

        </div>
    );
};

export default StateMirror;
