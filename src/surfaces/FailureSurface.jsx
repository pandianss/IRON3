import React from 'react';

export function FailureSurface({ error }) {
    return (
        <div style={{ padding: 40, border: '2px solid red', background: '#200', color: '#f88', fontFamily: 'monospace' }}>
            <h1>Institutional Failure</h1>
            <p>The system has encountered a critical incoherence.</p>
            <div style={{ background: '#000', padding: 20, border: '1px solid #400', marginTop: 20 }}>
                <pre>{error?.toString() || 'Unknown Kernel Panic'}</pre>
            </div>
            <button
                onClick={() => window.location.reload()}
                style={{ marginTop: 20, padding: '10px 20px', background: 'red', color: 'white', border: 'none', cursor: 'pointer' }}
            >
                RE-CONNECT
            </button>
        </div>
    )
}
