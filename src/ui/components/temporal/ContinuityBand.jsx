import React from 'react';
import '../../styles/InstitutionalTheme.css';

/**
 * C1. Continuity Band
 * Role: Visualizes uninterrupted adherence.
 * Visual Law: Horizontal persistence, Always growing or fragmenting.
 */
export const ContinuityBand = ({ streak, history = [] }) => {
    // history: Array of past n days status? 
    // MVP: Just the streak number dominant, plus a visual bar.

    return (
        <div style={{
            marginTop: 'var(--iron-space-lg)',
            marginBottom: 'var(--iron-space-lg)',
            textAlign: 'center'
        }}>

            <div className="flex-center" style={{ gap: 'var(--iron-space-md)', alignItems: 'baseline' }}>
                <span className="font-numeric num-massive" style={{ color: 'var(--iron-text-primary)' }}>
                    {streak}
                </span>
                <span className="text-sm-caps">
                    DAYS CONTINUITY
                </span>
            </div>

            {/* Visual Bar (The "Band") */}
            <div style={{
                display: 'flex',
                gap: '2px',
                justifyContent: 'center',
                marginTop: 'var(--iron-space-sm)',
                opacity: 0.5
            }}>
                {/* Dynamically generate blocks based on streak (capped at say 10 for visual) */}
                {Array.from({ length: Math.min(streak, 12) }).map((_, i) => (
                    <div key={i} style={{
                        width: '8px',
                        height: '24px',
                        background: 'var(--theme-accent)',
                        opacity: (i + 1) / Math.min(streak, 12)
                    }} />
                ))}
            </div>

            {streak === 0 && (
                <div style={{
                    marginTop: 'var(--iron-space-sm)',
                    color: 'var(--iron-text-tertiary)',
                    fontFamily: 'var(--font-mono)'
                }}>
                    NO MOMENTUM DETECTED
                </div>
            )}
        </div>
    );
};
