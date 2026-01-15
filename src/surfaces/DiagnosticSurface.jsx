import React from 'react';

export function DiagnosticSurface({ institution }) {
    return (
        <div style={{ padding: 40, background: '#112', color: '#88f', fontFamily: 'monospace' }}>
            <h1 style={{ borderBottom: '1px solid #88f', paddingBottom: 10 }}>Institutional Diagnostics</h1>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginTop: 20 }}>
                <section>
                    <h3>Core State</h3>
                    <pre>{JSON.stringify({
                        status: institution?.status,
                        standing: institution?.standing,
                        phase: institution?.phase
                    }, null, 2)}</pre>
                </section>
                <section>
                    <h3>Memory Ledger</h3>
                    <pre>{institution?.ledger ? `Events: ${institution.ledger.length}` : 'Empty'}</pre>
                </section>
            </div>
            <div style={{ marginTop: 40 }}>
                <h3>Raw Domain Snapshot</h3>
                <pre style={{ maxHeight: 300, overflow: 'auto', background: '#000', padding: 10 }}>
                    {JSON.stringify(institution, null, 2)}
                </pre>
            </div>
        </div>
    )
}
