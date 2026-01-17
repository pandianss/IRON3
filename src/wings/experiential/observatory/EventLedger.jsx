import React from 'react';

/**
 * Region E: Event Ledger
 * Expose the institutional nervous system (Event Tail).
 */
export const EventLedger = ({ events }) => {
    const tail = events?.slice(-10).reverse() || [];

    return (
        <div style={{
            padding: 'var(--iron-space-lg)',
            background: 'var(--iron-surface-2)',
            border: '1px solid var(--iron-border)',
            height: '100%',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column'
        }}>
            <h3 className="text-sm-caps" style={{ opacity: 0.5, marginBottom: 'var(--iron-space-lg)' }}>EVENT LEDGER</h3>

            <div style={{
                flex: 1,
                overflowY: 'auto',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.7rem'
            }}>
                {tail.map((e, i) => (
                    <div key={i} style={{
                        padding: '6px 0',
                        borderBottom: '1px solid #222',
                        display: 'flex',
                        gap: '12px'
                    }}>
                        <span style={{ opacity: 0.4 }}>[{i}]</span>
                        <span style={{ color: 'var(--iron-accent)' }}>{e.type}</span>
                        <span style={{ opacity: 0.5, fontSize: '0.6rem' }}>
                            {e.meta?.timestamp ? new Date(e.meta.timestamp).toLocaleTimeString() : 'N/A'}
                        </span>
                    </div>
                ))}
                {tail.length === 0 && <div style={{ opacity: 0.4 }}>NO RECENT EVENTS</div>}
            </div>
        </div>
    );
};
