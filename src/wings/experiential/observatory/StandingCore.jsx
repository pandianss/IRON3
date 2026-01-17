import React from 'react';
import { HeatMap } from './HeatMap';

/**
 * Region B: Standing Core
 * Make standing understandable and legible.
 */
export const StandingCore = ({ standing }) => {
    const integrity = standing?.integrity || 0;
    const streak = standing?.streak || 0;
    const color = integrity < 50 ? 'var(--iron-brand-breach)' : (integrity < 80 ? 'var(--iron-accent)' : 'var(--iron-brand-stable)');

    return (
        <div style={{
            padding: 'var(--iron-space-lg)',
            background: 'var(--iron-surface-2)',
            border: '1px solid var(--iron-border)',
            height: '100%'
        }}>
            <h3 className="text-sm-caps" style={{ opacity: 0.5, marginBottom: 'var(--iron-space-lg)' }}>STANDING CORE</h3>

            <div style={{ marginBottom: 'var(--iron-space-xl)' }}>
                <div style={{ fontSize: '2.5rem', fontFamily: 'var(--font-authority)', color }}>
                    {standing?.state || 'NEUTRAL'}
                </div>
                <div style={{ fontSize: '0.7rem', opacity: 0.6 }}>Current Institutional Standing</div>
            </div>

            <div style={{ marginBottom: 'var(--iron-space-lg)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ fontSize: '0.8rem' }}>INTEGRITY SCORE</span>
                    <span style={{ fontFamily: 'var(--font-mono)', color }}>{integrity}%</span>
                </div>
                <div style={{ height: '4px', background: '#333', width: '100%' }}>
                    <div style={{ height: '100%', background: color, width: `${integrity}%`, transition: 'width 1s ease' }} />
                </div>
            </div>

            <HeatMap streak={streak} />

            <div style={{ marginTop: '20px' }}>
                <div style={{ fontSize: '0.7rem', opacity: 0.5, marginBottom: '8px' }}>RISK VECTORS</div>
                {standing?.risks?.length > 0 ? (
                    standing.risks.map((risk, i) => (
                        <div key={i} style={{ fontSize: '0.8rem', color: 'var(--iron-brand-breach)', marginBottom: '4px' }}>
                            ⚠ {risk}
                        </div>
                    ))
                ) : (
                    <div style={{ fontSize: '0.7rem', color: 'var(--iron-brand-stable)' }}>NO ACTIVE RISKS</div>
                )}
            </div>
        </div>
    );
};
