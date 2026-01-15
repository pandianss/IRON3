import React from 'react';

/**
 * Diagnostic Surface
 * State: Inspection Mode.
 * Purpose: IRON's control room. Expose the institution.
 */
export const DiagnosticSurface = ({ institutionalState, onClose }) => {
    if (!institutionalState) return <div style={{ padding: 20 }}>NO STATE TO INSPECT</div>;

    const { standing, obligations, ledger, authority } = institutionalState;

    return (
        <div style={{
            height: '100%',
            overflowY: 'auto',
            padding: 'var(--iron-space-lg)',
            background: 'var(--iron-surface-2)',
            fontFamily: 'var(--font-mono)'
        }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--iron-space-xl)' }}>
                <h2 className="text-sm-caps" style={{ color: 'var(--iron-accent)' }}>INSTITUTIONAL DIAGNOSTICS</h2>
                <button onClick={onClose} style={{ cursor: 'pointer', background: 'none', border: '1px solid var(--iron-border)', color: 'var(--iron-text-primary)', padding: '4px 12px' }}>CLOSE</button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>

                {/* A. Standing Inspector */}
                <Panel title="STANDING STATE">
                    <Row label="STATE" value={standing?.state} />
                    <Row label="INTEGRITY" value={standing?.integrity} />
                    <Row label="LAST PRACTICE" value={standing?.lastPracticeDate} />
                    <Row label="STREAK" value={standing?.streak} />
                </Panel>

                {/* B. Authority Map */}
                <Panel title="AUTHORITY MAP">
                    <Row label="SURFACES" value={JSON.stringify(authority?.surfaces, null, 2)} />
                    <Row label="PERMISSIONS" value={entryCount(authority?.permissions)} />
                </Panel>

                {/* C. Contract Inspector */}
                <Panel title="ACTIVE OBLIGATIONS">
                    {obligations?.map((o, i) => (
                        <div key={i} style={{ marginBottom: '8px', borderLeft: '2px solid var(--iron-brand-stable)', paddingLeft: '8px' }}>
                            <div>{o.id}</div>
                            <div style={{ fontSize: '0.7rem', opacity: 0.7 }}>{o.description}</div>
                        </div>
                    ))}
                    {(!obligations || obligations.length === 0) && <div style={{ opacity: 0.5 }}>NO ACTIVE CONTRACTS</div>}
                </Panel>

                {/* D. Ledger Tail */}
                <Panel title="LEDGER EVENT TAIL (LAST 5)">
                    {ledger?.slice(-5).reverse().map((e, i) => (
                        <div key={i} style={{ marginBottom: '8px', fontSize: '0.65rem', borderBottom: '1px solid #333', paddingBottom: '4px' }}>
                            <div style={{ color: 'var(--iron-accent)' }}>{e.type}</div>
                            <div style={{ opacity: 0.5 }}>{e.timestamp}</div>
                        </div>
                    ))}
                </Panel>

            </div>
        </div>
    );
};

const Panel = ({ title, children }) => (
    <div style={{ background: 'var(--iron-surface)', padding: '16px', border: '1px solid var(--iron-border)' }}>
        <div className="text-sm-caps" style={{ marginBottom: '12px', opacity: 0.7, borderBottom: '1px solid #333', paddingBottom: '4px' }}>{title}</div>
        {children}
    </div>
);

const Row = ({ label, value }) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.8rem' }}>
        <span style={{ opacity: 0.7 }}>{label}</span>
        <span style={{ color: 'var(--iron-text-primary)' }}>{value}</span>
    </div>
);

const entryCount = (obj) => obj ? Object.keys(obj).length : 0;
