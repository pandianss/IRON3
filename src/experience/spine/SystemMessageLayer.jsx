import React from 'react';

/**
 * Layer 2: System Message Layer
 * Conditional, but sovereign.
 * Used for boot states, authority explanations, breaches.
 * Not a modal. An institutional annunciator.
 */
export const SystemMessageLayer = ({ message, type = 'INFO' }) => {
    if (!message) return null;

    const getColor = (t) => {
        switch (t) {
            case 'ERROR': return 'var(--iron-brand-breach)';
            case 'WARNING': return 'var(--iron-accent)';
            case 'SUCCESS': return 'var(--iron-brand-stable)';
            default: return 'var(--iron-text-secondary)';
        }
    };

    return (
        <div style={{
            position: 'fixed',
            bottom: '32px', // Above some footer area
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 900,
            width: '90%',
            maxWidth: '600px',
            textAlign: 'center',
            pointerEvents: 'none' // Don't block clicks unless critical?
        }}>
            <div style={{
                background: 'rgba(10,10,10,0.95)',
                border: `1px solid ${getColor(type)}`,
                padding: 'var(--iron-space-md)',
                color: getColor(type),
                fontFamily: 'var(--font-mono)',
                fontSize: '0.75rem',
                boxShadow: '0 4px 12px rgba(0,0,0,0.5)'
            }}>
                {message}
            </div>
        </div>
    );
};
