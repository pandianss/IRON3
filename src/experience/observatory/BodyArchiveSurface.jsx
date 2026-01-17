import React from 'react';
import { useGovernance } from '../../context/GovernanceContext';
import { StandingBanner } from '../../ui/components/authority/StandingBanner';

/**
 * BODY ARCHIVE SURFACE (FIT-UX-01)
 * The long-term institutional memory of the body.
 */
export const BodyArchiveSurface = ({ orientation }) => {
    const { institutionalState } = useGovernance();

    // Mock archive data based on history
    const archive = institutionalState.history || [
        {
            date: '2026-01-16',
            dayType: 'STRENGH',
            duration: 52,
            verdict: 'SUSTAINED',
            integrity: 92,
            intent: 'Today this body will be subjected to controlled stress in service of strength continuity.'
        },
        {
            date: '2026-01-15',
            dayType: 'REPAIR',
            duration: 30,
            verdict: 'RECOVERED',
            integrity: 88,
            intent: 'Focusing on inflammatory reduction and joint maintenance.'
        }
    ];

    return (
        <div style={styles.container}>
            <StandingBanner standing={orientation.standing} era={institutionalState.currentEra} />

            <div style={styles.content}>
                <div style={styles.header}>
                    <h2 style={styles.title}>INSTITUTIONAL MEMORY</h2>
                    <div style={styles.subtitle}>“The body does not forget what time has witnessed.”</div>
                </div>

                <div style={styles.timeline}>
                    {archive.map((entry, i) => (
                        <div key={i} style={styles.timelineEntry}>
                            <div style={styles.entryHeader}>
                                <div style={styles.entryDate}>{entry.date}</div>
                                <div style={{
                                    ...styles.entryVerdict,
                                    color: entry.verdict === 'SUSTAINED' ? 'var(--iron-brand-stable)' : 'var(--iron-accent)'
                                }}>
                                    {entry.verdict}
                                </div>
                            </div>

                            <div style={styles.entryGrid}>
                                <div style={styles.imageColumn}>
                                    <div style={styles.photoPair}>
                                        <div style={styles.photoBox}>BEFORE</div>
                                        <div style={styles.photoBox}>AFTER</div>
                                    </div>
                                </div>

                                <div style={styles.dataColumn}>
                                    <div style={styles.dataLabel}>INTENT</div>
                                    <div style={styles.intentText}>{entry.intent}</div>

                                    <div style={styles.metricsRow}>
                                        <div style={styles.metric}>
                                            <span style={styles.metricLabel}>DURATION</span>
                                            <span style={styles.metricValue}>{entry.duration}m</span>
                                        </div>
                                        <div style={styles.metric}>
                                            <span style={styles.metricLabel}>INTEGRITY</span>
                                            <span style={styles.metricValue}>{entry.integrity}%</span>
                                        </div>
                                        <div style={styles.metric}>
                                            <span style={styles.metricLabel}>TYPE</span>
                                            <span style={styles.metricValue}>{entry.dayType}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

BodyArchiveSurface.contract = {
    supportedPhases: ['active', 'sovereign'],
    authorityRange: [3, 5]
};

const styles = {
    container: {
        minHeight: '100vh',
        background: 'var(--iron-surface-base)',
        color: 'var(--iron-text-primary)'
    },
    content: {
        padding: 'var(--iron-space-xl) var(--iron-space-lg)',
        maxWidth: '800px',
        margin: '0 auto'
    },
    header: {
        marginBottom: '40px',
        textAlign: 'center'
    },
    title: {
        fontFamily: 'var(--font-authority)',
        fontSize: '1.8rem',
        letterSpacing: '2px',
        marginBottom: '8px'
    },
    subtitle: {
        fontSize: '0.8rem',
        opacity: 0.5,
        fontStyle: 'italic'
    },
    timeline: {
        display: 'flex',
        flexDirection: 'column',
        gap: '40px'
    },
    timelineEntry: {
        background: 'var(--iron-surface-2)',
        border: '1px solid var(--iron-border)',
        padding: '24px'
    },
    entryHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'baseline',
        marginBottom: '20px',
        borderBottom: '1px solid var(--iron-border)',
        paddingBottom: '12px'
    },
    entryDate: {
        fontFamily: 'var(--font-mono)',
        fontSize: '0.9rem',
        opacity: 0.8
    },
    entryVerdict: {
        fontFamily: 'var(--font-authority)',
        fontSize: '0.8rem',
        letterSpacing: '1px'
    },
    entryGrid: {
        display: 'grid',
        gridTemplateColumns: '1fr 1.5fr',
        gap: '24px'
    },
    imageColumn: {
        display: 'flex',
        flexDirection: 'column'
    },
    photoPair: {
        display: 'flex',
        gap: '8px',
        height: '140px'
    },
    photoBox: {
        flex: 1,
        background: '#000',
        border: '1px solid #333',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '0.6rem',
        color: '#444',
        fontFamily: 'var(--font-mono)'
    },
    dataColumn: {
        display: 'flex',
        flexDirection: 'column',
        gap: '12px'
    },
    dataLabel: {
        fontSize: '0.6rem',
        opacity: 0.4,
        fontFamily: 'var(--font-mono)',
        textTransform: 'uppercase'
    },
    intentText: {
        fontSize: '0.85rem',
        lineHeight: '1.4',
        opacity: 0.9
    },
    metricsRow: {
        marginTop: 'auto',
        display: 'flex',
        gap: '24px',
        paddingTop: '16px',
        borderTop: '1px dashed #333'
    },
    metric: {
        display: 'flex',
        flexDirection: 'column',
        gap: '4px'
    },
    metricLabel: {
        fontSize: '0.55rem',
        opacity: 0.4,
        fontFamily: 'var(--font-mono)'
    },
    metricValue: {
        fontSize: '0.8rem',
        fontFamily: 'var(--font-authority)'
    }
};
