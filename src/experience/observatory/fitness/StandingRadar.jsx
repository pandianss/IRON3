import React from 'react';

/**
 * STANDING RADAR
 * Visualizes the 5 vectors: Continuity, Stress, Recovery, Integrity, Trajectory.
 */
export const StandingRadar = ({ vectors }) => {
    if (!vectors) return null;

    const { continuity, stress, recovery, integrity, trajectory } = vectors;

    const items = [
        { label: 'CONTINUITY', value: continuity, color: 'var(--iron-brand-stable)' },
        { label: 'STRESS', value: stress, color: 'var(--iron-brand-breach)' },
        { label: 'RECOVERY', value: recovery, color: 'var(--iron-accent)' },
        { label: 'INTEGRITY', value: integrity, color: 'var(--iron-brand-stable)' },
        { label: 'TRAJECTORY', value: (trajectory + 1) / 2, color: 'var(--iron-text-primary)' }, // Normalized -1 to 1 => 0 to 1
    ];

    return (
        <div style={{ marginTop: '20px', padding: '15px', border: '1px solid var(--iron-border)', background: 'rgba(0,0,0,0.3)' }}>
            <div style={{ fontSize: '0.6rem', opacity: 0.5, letterSpacing: '2px', marginBottom: '15px' }}>INSTITUTIONAL_VECTORS</div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {items.map((item, i) => (
                    <div key={i}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.6rem', marginBottom: '4px' }}>
                            <span>{item.label}</span>
                            <span style={{ color: item.color, fontFamily: 'var(--font-mono)' }}>{(item.value * 100).toFixed(0)}%</span>
                        </div>
                        <div style={{ height: '2px', background: 'rgba(255,255,255,0.05)', position: 'relative' }}>
                            <div style={{
                                width: `${item.value * 100}%`,
                                height: '100%',
                                background: item.color,
                                boxShadow: `0 0 5px ${item.color}44`,
                                transition: 'width 1.5s ease-in-out'
                            }} />
                        </div>
                    </div>
                ))}
            </div>

            <div style={{ marginTop: '20px', fontSize: '0.5rem', opacity: 0.4, lineHeight: '1.4' }}>
                [!] Vectors are derived from cumulative institutional memory.
                <br />
                [!] Asymmetric decay applied to Continuity and Integrity.
            </div>
        </div>
    );
};
