import React from 'react';
import { useGovernance } from '../../context/GovernanceContext';
import { StandingBanner } from '../../ui/components/authority/StandingBanner';
import { ComplianceControl } from '../../ui/components/obligation/ComplianceControl';

/**
 * THRESHOLD SURFACE (FIT-UX-01)
 * The landing experience for the institution.
 * Reinforces identity, standing, and the continuity of the body.
 */
export const ThresholdSurface = ({ orientation }) => {
    const { institutionalState, declare } = useGovernance();
    const { standing, phase } = orientation;

    // We assume yesterday's verdict or last significant event is in the state
    const isGenesis = !institutionalState.history || institutionalState.history.length === 0;

    const lastVerdict = isGenesis ? {
        type: 'GENESIS',
        summary: 'Institutional lifecycle initiated. No previous records found.'
    } : {
        type: institutionalState.history[0].verdict || 'SUSTAINED',
        summary: institutionalState.history[0].summary || 'Continuity preserved through previous discipline.'
    };

    const handleEnterRitual = async () => {
        // This triggers the ritual flow
        await declare('INIT_RITUAL', {
            timestamp: new Date().toISOString()
        });
    };

    return (
        <div style={styles.container}>
            <StandingBanner standing={standing} era={institutionalState.currentEra} />

            <div style={styles.content}>
                <div style={styles.entryNotice}>
                    “YOU ARE ENTERING THE INSTITUTION.”
                </div>

                <div style={styles.mainGrid}>
                    <div style={styles.statBox}>
                        <div style={styles.statLabel}>INSTITUTIONAL PHASE</div>
                        <div style={styles.statValue}>{phase.replace('_', ' ')}</div>
                    </div>

                    <div style={styles.statBox}>
                        <div style={styles.statLabel}>CONTINUITY</div>
                        <div style={styles.statValue}>{standing.continuity.label}</div>
                    </div>
                </div>

                <div style={styles.verdictSection}>
                    <div style={styles.statLabel}>PREVIOUS VERDICT</div>
                    <div style={styles.verdictContent}>
                        <div style={{ color: 'var(--iron-accent)', fontFamily: 'var(--font-authority)', marginBottom: '8px' }}>
                            {lastVerdict.type}
                        </div>
                        <div style={{ opacity: 0.7, fontSize: '0.85rem' }}>
                            {lastVerdict.summary}
                        </div>
                    </div>
                </div>

                <div style={styles.postureSection}>
                    <div style={styles.statLabel}>RISK POSTURE</div>
                    <div style={{
                        color: standing.risk.level === 'HIGH' ? 'var(--iron-brand-breach)' : 'var(--iron-brand-stable)',
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.9rem',
                        marginTop: '8px'
                    }}>
                        {standing.risk.level} • {standing.integrity.label} INTEGRITY
                    </div>
                </div>

                <div style={styles.actionArea}>
                    <ComplianceControl
                        label="ENTER BODY RECORD"
                        variant="standard"
                        onComplete={handleEnterRitual}
                    />
                </div>
            </div>
        </div>
    );
};

ThresholdSurface.contract = {
    supportedPhases: ['initiated', 'bound', 'active', 'degrading', 'recovering', 'sovereign'],
    authorityRange: [1, 5]
};

const styles = {
    container: {
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        background: 'var(--iron-surface-authority)',
        color: 'var(--iron-text-primary)'
    },
    content: {
        flex: 1,
        padding: 'var(--iron-space-xl) var(--iron-space-lg)',
        maxWidth: '600px',
        margin: '0 auto',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: '24px'
    },
    entryNotice: {
        fontFamily: 'var(--font-authority)',
        fontSize: '0.75rem',
        letterSpacing: '2px',
        opacity: 0.5,
        textAlign: 'center',
        marginBottom: '20px'
    },
    mainGrid: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '16px'
    },
    statBox: {
        background: 'var(--iron-surface-2)',
        padding: '16px',
        border: '1px solid var(--iron-border)'
    },
    statLabel: {
        fontSize: '0.65rem',
        opacity: 0.5,
        letterSpacing: '1px',
        marginBottom: '8px',
        textTransform: 'uppercase',
        fontFamily: 'var(--font-mono)'
    },
    statValue: {
        fontFamily: 'var(--font-authority)',
        fontSize: '1.1rem',
        textTransform: 'uppercase'
    },
    verdictSection: {
        background: 'var(--iron-surface)',
        padding: '20px',
        border: '1px solid var(--iron-border)',
        borderLeft: '4px solid var(--iron-accent)'
    },
    verdictContent: {
        marginTop: '8px'
    },
    postureSection: {
        padding: '16px',
        background: 'var(--iron-surface-2)',
        border: '1px solid var(--iron-border)'
    },
    actionArea: {
        marginTop: 'auto',
        paddingTop: '40px'
    }
};
