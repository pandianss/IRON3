import React from 'react';

/**
 * Booting Surface
 * State: Institution constructing.
 * Purpose: Make institutional emergence visible.
 */
export const BootingSurface = ({ step = 'INITIALIZING', logs = [] }) => {
    const steps = [
        'MEMORY LEDGER',
        'CONTRACT LOADING',
        'STANDING ENGINE',
        'AUTHORITY BINDING',
        'MANDATE EMISSION'
    ];

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            maxWidth: '500px',
            margin: '0 auto',
            padding: 'var(--iron-space-lg)'
        }}>
            <div className="text-sm-caps" style={{ color: 'var(--iron-brand-stable)', marginBottom: 'var(--iron-space-xl)' }}>
                INSTITUTIONAL FORMATION
            </div>

            {/* Boot Timeline */}
            <div style={{ width: '100%', marginBottom: 'var(--iron-space-xl)' }}>
                {steps.map((s, i) => (
                    <div key={s} style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        marginBottom: '12px',
                        opacity: i <= steps.indexOf(step) ? 1 : 0.3
                    }}>
                        <div style={{
                            width: '8px',
                            height: '8px',
                            background: i < steps.indexOf(step) ? 'var(--iron-brand-stable)' : (i === steps.indexOf(step) ? 'var(--iron-accent)' : '#333'),
                            borderRadius: '50%'
                        }} />
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}>{s}</span>
                        {i === steps.indexOf(step) && <span style={{ fontSize: '0.6rem', color: 'var(--iron-accent)' }}>PROCESSING...</span>}
                    </div>
                ))}
            </div>

            {/* Identity Block */}
            <div style={{
                border: '1px solid var(--iron-border)',
                padding: 'var(--iron-space-md)',
                width: '100%',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.7rem',
                color: 'var(--iron-text-secondary)'
            }}>
                <div>ID: SIGMA-9-IRON</div>
                <div>EPOCH: {new Date().getFullYear()}</div>
                <div>SEED: {Math.random().toString(36).substring(7).toUpperCase()}</div>
            </div>

            <div style={{ marginTop: 'var(--iron-space-lg)', fontSize: '0.7rem', opacity: 0.5 }}>
                DO NOT CLOSE WINDOW
            </div>
        </div>
    );
};
