import React from 'react';

/**
 * Region D: Contract Monitor
 * Make contracts alive and legal status observable.
 */
export const ContractMonitor = ({ contracts }) => {
    const active = contracts?.active || [];
    const breaches = contracts?.breaches || [];

    return (
        <div style={{
            padding: 'var(--iron-space-lg)',
            background: 'var(--iron-surface-2)',
            border: '1px solid var(--iron-border)',
            height: '100%'
        }}>
            <h3 className="text-sm-caps" style={{ opacity: 0.5, marginBottom: 'var(--iron-space-lg)' }}>CONTRACT MONITOR</h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                    <div style={{ fontSize: '0.7rem', opacity: 0.6, marginBottom: '8px' }}>ACTIVE OBLIGATIONS</div>
                    {active.map((o, i) => (
                        <div key={i} style={{
                            fontSize: '0.8rem',
                            padding: '8px',
                            borderLeft: '2px solid var(--iron-brand-stable)',
                            background: 'rgba(255,255,255,0.02)',
                            marginBottom: '4px'
                        }}>
                            {o.label || o.id}
                        </div>
                    ))}
                    {active.length === 0 && <div style={{ fontSize: '0.7rem', opacity: 0.4 }}>NO OBLIGATIONS</div>}
                </div>

                <div>
                    <div style={{ fontSize: '0.7rem', opacity: 0.6, marginBottom: '8px', color: 'var(--iron-brand-breach)' }}>ACTIVE BREACHES</div>
                    {breaches.map((b, i) => (
                        <div key={i} style={{
                            fontSize: '0.8rem',
                            padding: '8px',
                            borderLeft: '2px solid var(--iron-brand-breach)',
                            background: 'rgba(255,0,0,0.05)',
                            marginBottom: '4px'
                        }}>
                            {b.label || b.reason}
                        </div>
                    ))}
                    {breaches.length === 0 && <div style={{ fontSize: '0.7rem', opacity: 0.4 }}>CLEAR</div>}
                </div>
            </div>
        </div>
    );
};
