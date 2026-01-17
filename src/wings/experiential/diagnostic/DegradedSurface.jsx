import React from 'react';

/**
 * Degraded Surface
 * State: Alive but unstable/conflicted.
 * Purpose: Institutional console for conflict resolution.
 */
export const DegradedSurface = ({ error, onRetry, onDiagnostic }) => {
    return (
        <div style={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(255, 0, 0, 0.05)'
        }}>
            <div style={{
                border: '1px solid var(--iron-brand-breach)',
                padding: 'var(--iron-space-xl)',
                maxWidth: '600px',
                width: '90%',
                background: 'var(--iron-surface)'
            }}>
                <h2 style={{
                    color: 'var(--iron-brand-breach)',
                    fontFamily: 'var(--font-authority)',
                    marginBottom: 'var(--iron-space-md)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px'
                }}>
                    <span>⚠</span> INSTITUTIONAL CONFLICT ALERT
                </h2>

                <p style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.9rem',
                    marginBottom: 'var(--iron-space-lg)',
                    lineHeight: '1.4'
                }}>
                    The institutional engine has detected a state incoherence or runtime violation.
                    Authority surfaces have been locked to preserve integrity.
                </p>

                <div style={{
                    background: '#000',
                    padding: '12px',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.75rem',
                    color: '#ffaaaa',
                    marginBottom: 'var(--iron-space-xl)',
                    whiteSpace: 'pre-wrap'
                }}>
                    {error?.message || "UNKNOWN KERNEL PANIC"}
                    {error?.stack && `\n\n${error.stack.slice(0, 300)}...`}
                </div>

                <div style={{ display: 'flex', gap: '16px' }}>
                    <button
                        onClick={onRetry}
                        style={{
                            flex: 1,
                            background: 'var(--iron-brand-breach)',
                            color: '#fff',
                            border: 'none',
                            padding: '12px',
                            fontFamily: 'var(--font-authority)',
                            cursor: 'pointer'
                        }}
                    >
                        RUN STABILIZATION PROTOCOL
                    </button>
                    <button
                        onClick={onDiagnostic}
                        style={{
                            flex: 1,
                            background: 'transparent',
                            border: '1px solid var(--iron-brand-breach)',
                            color: 'var(--iron-brand-breach)',
                            padding: '12px',
                            fontFamily: 'var(--font-authority)',
                            cursor: 'pointer'
                        }}
                    >
                        FULL DIAGNOSTICS
                    </button>
                </div>
            </div>
        </div>
    );
};
