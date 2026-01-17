import React from 'react';

/**
 * CAPACITY METER (Fitness Focus)
 * Visualizes the balance between Training Load and Physiological Recovery.
 */
export const CapacityMeter = ({ physiology }) => {
    const { capacity = 100, load = 0, status = 'OPTIMAL', law = { isAuthorized: true } } = physiology || {};

    const getColor = () => {
        if (!law.isAuthorized) return 'var(--iron-brand-breach)';
        if (status === 'STRAINED') return 'var(--iron-brand-risk)';
        return 'var(--iron-brand-stable)';
    };

    return (
        <div style={{ padding: '10px', flex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', opacity: 0.6, marginBottom: '5px' }}>
                <span>INSTITUTIONAL CAPACITY</span>
                <span>{capacity}%</span>
            </div>

            <div style={{
                height: '4px',
                background: 'rgba(255,255,255,0.1)',
                position: 'relative',
                overflow: 'hidden'
            }}>
                <div style={{
                    width: `${capacity}%`,
                    height: '100%',
                    background: getColor(),
                    transition: 'width 1s ease, background 0.5s ease'
                }} />
            </div>

            <div style={{ marginTop: '10px', fontSize: '0.6rem', color: getColor(), fontWeight: 'bold' }}>
                {status.replace('_', ' ')}
            </div>

            {!law.isAuthorized && (
                <div style={{
                    marginTop: '5px',
                    fontSize: '0.6rem',
                    color: 'var(--iron-brand-breach)',
                    textTransform: 'uppercase',
                    letterSpacing: '1px'
                }}>
                    Mandatory Rest Active
                </div>
            )}
        </div>
    );
};
