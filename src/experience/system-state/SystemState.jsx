import React from 'react';
import NarrativeCard from '../../ui/components/institutional/NarrativeCard';
import '../../ui/styles/InstitutionalTheme.css';
import { NarrativeRegistry } from '../../core/protocols/NarrativeRegistry';

export const SystemState = ({ state }) => {
    // state is the 'Standing' object: { state, entropy, streak, since }

    // Mapping condition to visual severity
    const getConditionColor = () => {
        if (state.state === 'VIOLATED') return 'var(--civil-accent-alert)';
        if (state.state === 'BREACH_RISK') return 'var(--civil-accent-action)';
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
                    {state.state.replace('_', ' ')}
                </h1>
                <p style={{ marginTop: '12px', color: 'var(--civil-text-secondary)', fontSize: '0.9rem' }}>
                    Days in state: {state.streak}
                </p>
            </header>

            {/* 2. LAWFUL ACTS - REMOVED, as this is now handled by ObligationCorridor or Shell switching */}
            <section style={{ marginBottom: '40px' }}>
                <p style={{ color: 'var(--civil-text-muted)' }}>
                    System operational. No immediate obligations active on this surface.
                </p>
            </section>

            {/* 3. RECORD MONITOR */}
            <section>
                <div style={{ fontSize: '0.8rem', letterSpacing: '2px', color: 'var(--civil-text-muted)', marginBottom: '16px' }}>
                    SYSTEM RECORD
                </div>

                <div className="stats-row" style={{ display: 'flex', gap: '24px', marginBottom: '24px' }}>
                    <div>
                        <div style={{ fontSize: '2rem', fontWeight: '300' }}>{state.streak}</div>
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
