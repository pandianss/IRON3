import React from 'react';
import { useGovernance } from '../context/GovernanceContext';

export function DiagnosticSurface({ institution }) {
    const { dismantle } = useGovernance();

    return (
        <div style={{ padding: 40, background: '#112', color: '#88f', fontFamily: 'monospace' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #88f', paddingBottom: 10 }}>
                <h1>Institutional Diagnostics</h1>
                <button
                    onClick={() => {
                        if (window.confirm("PERMANENT DISMANTLE: This will wipe all institutional history. Proceed?")) {
                            dismantle();
                        }
                    }}
                    style={{
                        background: '#300',
                        color: '#f44',
                        border: '1px solid #f44',
                        padding: '10px 20px',
                        cursor: 'pointer',
                        fontFamily: 'monospace',
                        fontWeight: 'bold'
                    }}
                >
                    PERMANENT_DISMANTLE
                </button>
            </div>
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

DiagnosticSurface.contract = {
    supportedPhases: [
        'pre_institutional', 'initiated', 'bound', 'active', 'degrading',
        'failed', 'recovering', 'sovereign'
    ],
    authorityRange: [0, 5]
};
