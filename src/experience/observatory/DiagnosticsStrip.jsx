import React from 'react';

/**
 * Region F: System Diagnostics Strip
 * Make system reality unavoidable. Meta-system data.
 */
export const DiagnosticsStrip = ({ diagnostics }) => {
    return (
        <div style={{
            padding: '8px var(--iron-space-lg)',
            background: '#000',
            borderTop: '1px solid var(--iron-border)',
            display: 'flex',
            gap: '32px',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.65rem',
            color: 'var(--iron-text-secondary)',
            opacity: 0.8
        }}>
            <div>CYCLES: {diagnostics?.cycles || '0'}</div>
            <div>MEMORY: {diagnostics?.memory || '0.0MB'}</div>
            <div>ERRORS: {diagnostics?.errors || '0'}</div>
            <div>SIMULATION: {diagnostics?.simulation ? 'ACTIVE' : 'LIVE'}</div>
            <div style={{ marginLeft: 'auto' }}>ORPHANS: {diagnostics?.orphans || 'NONE'}</div>
        </div>
    );
};
