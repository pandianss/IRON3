import React from 'react';
import { useSovereignKernel } from '../../../spine/context/SovereigntyContext';
import { useGovernance } from '../../../spine/context/GovernanceContext';

export const SovereignView = ({ state }) => {
    const { declare } = useGovernance();
    const { phase, standing } = state;

    return (
        <div style={styles.container}>
            {/* Header */}
            <header style={styles.header}>
                <div style={styles.logo}>IRON SOVEREIGNTY</div>
                <div style={styles.phaseIndicator}>
                    PHASE: <span style={{ color: 'var(--iron-brand-stable)' }}>{phase?.id || 'UNKNOWN'}</span>
                </div>
            </header>

            {/* Main Grid */}
            <main style={styles.grid}>

                {/* 1. Standing Card */}
                <div style={styles.card}>
                    <div style={styles.cardLabel}>STANDING INTEGRITY</div>
                    <div style={styles.integrityValue}>
                        100%
                    </div>
                    <div style={styles.statusRow}>
                        <span style={styles.statusLabel}>STATUS</span>
                        <span style={{ color: 'var(--iron-brand-stable)' }}>STABLE</span>
                    </div>
                </div>

                {/* 2. Protocol Actions */}
                <div style={styles.card}>
                    <div style={styles.cardLabel}>DIRECTIVES</div>
                    <div style={styles.actions}>
                        <button
                            style={styles.button}
                            onClick={() => declare('PROTOCOL_INITIATED', { protocol: 'STANDARD_SESSION' })}
                        >
                            INITIATE SESSION
                        </button>
                        <button
                            style={{ ...styles.button, borderColor: 'var(--iron-brand-risk)' }}
                            onClick={() => declare('SYSTEM_CALIBRATION', {})}
                        >
                            CALIBRATE
                        </button>
                    </div>
                </div>

                {/* 3. Audit Stream */}
                <div style={{ ...styles.card, gridColumn: 'span 2' }}>
                    <div style={styles.cardLabel}>JUDICIAL AUDIT STREAM</div>
                    <div style={styles.logContainer}>
                        {state.compliance?.audit?.slice(-5).reverse().map((entry, i) => (
                            <div key={i} style={styles.logEntry}>
                                <span style={styles.timestamp}>{new Date(entry.timestamp).toLocaleTimeString()}</span>
                                <span style={styles.eventType}>{entry.type}</span>
                                <span style={styles.actor}>{entry.actorId}</span>
                            </div>
                        ))}
                        {(!state.compliance?.audit || state.compliance.audit.length === 0) && (
                            <div style={{ opacity: 0.3, fontStyle: 'italic' }}>No audit records found.</div>
                        )}
                    </div>
                </div>

            </main>
        </div>
    );
};

const styles = {
    container: {
        minHeight: '100vh',
        background: 'var(--iron-infra-base)',
        color: 'var(--iron-text-primary)',
        fontFamily: 'var(--font-authority)',
        padding: '2rem'
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingBottom: '2rem',
        borderBottom: '1px solid var(--iron-infra-border)'
    },
    logo: {
        fontSize: '1.5rem',
        letterSpacing: '2px',
        fontWeight: 'bold'
    },
    phaseIndicator: {
        fontSize: '0.8rem',
        letterSpacing: '1px',
        background: 'var(--iron-infra-panel)',
        padding: '8px 16px',
        borderRadius: 'var(--iron-radius-sm)'
    },
    grid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '2rem',
        marginTop: '2rem'
    },
    card: {
        background: 'var(--iron-infra-panel)',
        border: '1px solid var(--iron-infra-border)',
        padding: '2rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem'
    },
    cardLabel: {
        fontSize: '0.7rem',
        letterSpacing: '2px',
        color: 'var(--iron-text-secondary)',
        marginBottom: '0.5rem'
    },
    integrityValue: {
        fontSize: '4rem',
        fontWeight: 'bold',
        lineHeight: '1',
        color: '#fff'
    },
    statusRow: {
        display: 'flex',
        justifyContent: 'space-between',
        fontSize: '0.9rem',
        marginTop: 'auto'
    },
    actions: {
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem'
    },
    button: {
        background: 'transparent',
        border: '1px solid var(--iron-brand-stable)',
        color: 'var(--iron-text-primary)',
        padding: '1rem',
        cursor: 'pointer',
        fontFamily: 'var(--font-authority)',
        letterSpacing: '1px',
        fontSize: '0.9rem',
        transition: 'all 0.2s',
        textAlign: 'center'
    },
    logContainer: {
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem',
        marginTop: '1rem'
    },
    logEntry: {
        display: 'grid',
        gridTemplateColumns: '80px 1fr 100px',
        gap: '1rem',
        fontSize: '0.8rem',
        borderBottom: '1px solid var(--iron-infra-border-dim)',
        paddingBottom: '0.5rem'
    },
    timestamp: {
        color: 'var(--iron-text-secondary)'
    },
    eventType: {
        color: 'var(--iron-brand-ascending)'
    },
    actor: {
        textAlign: 'right',
        opacity: 0.5
    }
};
