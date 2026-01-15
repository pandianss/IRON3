import React, { useState } from 'react';

export const DiagnosticOverlay = ({ state }) => {
    const [expanded, setExpanded] = useState(false);

    if (!state) return null;

    if (!expanded) {
        return (
            <div
                onClick={() => setExpanded(true)}
                style={{
                    position: 'fixed',
                    bottom: '10px',
                    right: '10px',
                    background: 'rgba(0,0,0,0.8)',
                    color: '#0f0',
                    border: '1px solid #0f0',
                    padding: '5px 10px',
                    fontFamily: 'monospace',
                    fontSize: '10px',
                    cursor: 'pointer',
                    zIndex: 9000
                }}
            >
                KERNEL: ACTIVE
            </div>
        );
    }

    return (
        <div style={{
            position: 'fixed',
            top: '0',
            right: '0',
            bottom: '0',
            width: '300px',
            background: 'rgba(0,0,0,0.95)',
            borderLeft: '1px solid #333',
            padding: '20px',
            overflowY: 'auto',
            fontFamily: 'monospace',
            color: '#ccc',
            fontSize: '11px',
            zIndex: 9000
        }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                <strong style={{ color: '#fff' }}>KERNEL DIAGNOSTICS</strong>
                <button onClick={() => setExpanded(false)} style={{ background: 'none', border: 'none', color: '#666', cursor: 'pointer' }}>[X]</button>
            </div>

            <Section title="STANDING" data={state.standing} />
            <Section title="AUTHORITY" data={state.authority} />
            <Section title="SESSION" data={state.session} />

        </div>
    );
};

const Section = ({ title, data }) => (
    <div style={{ marginBottom: '15px' }}>
        <div style={{ borderBottom: '1px solid #333', marginBottom: '5px', color: '#666' }}>{title}</div>
        <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>
            {JSON.stringify(data, null, 2)}
        </pre>
    </div>
);
