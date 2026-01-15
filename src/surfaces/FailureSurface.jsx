import React from 'react';

export function FailureSurface({ error, kernel }) {
    const handleRealign = async () => {
        if (!kernel) {
            window.location.reload();
            return;
        }
        // Soft Recovery: Declare a realignment event that the engines can interpret
        // as a "Penalty for Incoherence"
        await kernel.ingest('AUTHORITY_REALIGNED', { penalty: 20 }, 'USER_HOST');
    };

    return (
        <div style={{ padding: 40, border: '2px solid var(--iron-brand-breach)', background: '#100', color: '#f88', textAlign: 'center', minHeight: '300px', display: 'flex', flexDirection: 'column', justifyContent: 'center', position: 'relative', zIndex: 10000 }}>
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

            <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', marginTop: 30 }}>
                <button
                    onClick={handleRealign}
                    style={{
                        padding: '15px 40px',
                        background: 'var(--iron-brand-breach)',
                        color: 'white',
                        border: 'none',
                        cursor: 'pointer',
                        fontWeight: 'bold',
                        letterSpacing: '2px'
                    }}
                >
                    RE-ALIGN AUTHORITY [!]
                </button>

                <button
                    onClick={() => {
                        localStorage.clear();
                        window.location.href = '/';
                    }}
                    style={{
                        padding: '10px 20px',
                        background: 'transparent',
                        color: '#666',
                        border: '1px solid #333',
                        cursor: 'pointer',
                        fontSize: '0.7rem'
                    }}
                >
                    HARD_RESET_SOVEREIGNTY
                </button>
            </div>

            <p style={{ marginTop: '20px', fontSize: '0.7rem', opacity: 0.4 }}>
                [!] Re-alignment incurs a 20% Integrity Penalty.
            </p>
        </div>
    )
}

