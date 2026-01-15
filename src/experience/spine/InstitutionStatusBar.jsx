import React from 'react';

/**
 * Layer 1: Institution Status Bar
 * The heartbeat. Always visible.
 * Displays phase, standing (or UNKNOWN), and system health.
 */
export const InstitutionStatusBar = ({ phase = 'UNKNOWN', standing = 'Unknown', connected = false }) => {
    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '32px',
            zIndex: 1000, // Topmost
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 var(--iron-space-md)',
            background: 'rgba(0,0,0,0.8)',
            borderBottom: '1px solid var(--iron-border)',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.6rem',
            color: 'var(--iron-text-secondary)',
            backdropFilter: 'blur(4px)'
        }}>
            <div style={{ display: 'flex', gap: '16px' }}>
                <span style={{ color: connected ? 'var(--iron-brand-stable)' : 'var(--iron-brand-breach)' }}>
                    ●
                </span>
                <span>PHASE: {phase}</span>
            </div>

            <div style={{ display: 'flex', gap: '16px' }}>
                <span>STANDING: {standing}</span>
                <span>IRON v3.0</span>
            </div>
        </div>
    );
};
