import React from 'react';

export function FailureSurface({ error }) {
    return (
        <div style={{ padding: 40, border: '2px solid var(--iron-brand-breach)', background: '#100', color: '#f88', textAlign: 'center', minHeight: '300px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <h1 style={{ fontFamily: 'var(--font-authority)', letterSpacing: '4px', color: 'var(--iron-brand-breach)', marginBottom: '10px' }}>
                LOSS OF COMMITMENT
            </h1>
            <p style={{ opacity: 0.7, marginBottom: '30px', fontSize: '1.1rem' }}>
                The behavioral construct has suffered a terminal incoherence.
                The institution cannot maintain authority under these conditions.
            </p>
            <div style={{ background: '#000', padding: 20, border: '1px solid #400', marginTop: 20, textAlign: 'left', fontSize: '0.8rem', opacity: 0.5 }}>
                <div style={{ marginBottom: '10px', color: '#666' }}>DIAGNOSTIC_ERR_SIG:</div>
                <pre style={{ whiteSpace: 'pre-wrap', margin: 0 }}>{error?.toString() || 'DISCIPLINE_VOID'}</pre>
            </div>
            <button
                onClick={() => {
                    localStorage.clear();
                    window.location.href = '/';
                }}
                style={{
                    marginTop: 30,
                    padding: '15px 40px',
                    background: 'var(--iron-brand-breach)',
                    color: 'white',
                    border: 'none',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    letterSpacing: '2px',
                    width: 'fit-content',
                    alignSelf: 'center'
                }}
            >
                RE-ESTABLISH SOVEREIGNTY
            </button>
        </div>
    )
}

