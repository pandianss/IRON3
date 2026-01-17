import React, { useMemo } from 'react';
import { buildStandingViewModel } from '../experience/kernel/standingViewModel';

export function InstitutionStatusBar({ institution }) {
    const standing = useMemo(() => {
        if (!institution) return null;
        return buildStandingViewModel({ state: institution, compliance: institution.compliance });
    }, [institution]);

    if (!standing) return (
        <div className="iron-status-bar" style={styles.bar}>
            <strong>IRON</strong> | BOOTING...
        </div>
    );

    return (
        <div className="iron-status-bar" style={{
            ...styles.bar,
            borderColor: standing.integrity.status === 'CRITICAL' ? '#f44' : '#333'
        }}>
            <div style={styles.section}>
                <strong>IRON</strong>
                <span style={styles.divider}>|</span>
                <span style={styles.phase}>{standing.stage}</span>
            </div>

            <div style={styles.section}>
                <ActiveTimer session={institution?.session} />
                <span style={styles.divider}>|</span>
                <span style={{ color: getStatusColor(standing.integrity.status) }}>
                    INTEGRITY: {standing.integrity.label}
                </span>
                <span style={styles.divider}>|</span>
                <span>HEALTH: {standing.health.label}</span>
                <span style={styles.divider}>|</span>
                <span style={styles.streak}>{standing.continuity.label} STREAK</span>
            </div>

            {standing.risk.verdictPending && (
                <div style={styles.verdict}>VERDICT PENDING</div>
            )}
        </div>
    );
}

function ActiveTimer({ session }) {
    const [elapsed, setElapsed] = React.useState(0);
    const isActive = session?.status === 'ACTIVE' || session?.status === 'INTERRUPTED';
    const isInterrupted = session?.status === 'INTERRUPTED';

    React.useEffect(() => {
        if (!isActive || !session?.startTime) {
            setElapsed(0);
            return;
        }

        const interval = setInterval(() => {
            const start = new Date(session.startTime).getTime();
            setElapsed(Date.now() - start);
        }, 1000);

        return () => clearInterval(interval);
    }, [isActive, session?.startTime]);

    if (!isActive) return null;

    const minutes = Math.floor(elapsed / 60000);
    const seconds = Math.floor((elapsed % 60000) / 1000);

    return (
        <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            color: isInterrupted ? '#f44' : '#4f4',
            fontFamily: 'monospace',
            fontWeight: 'bold',
            animation: isInterrupted ? 'pulse 1s infinite' : 'none'
        }}>
            <span style={{ fontSize: '0.6rem', opacity: 0.6 }}>DISCIPLINE:</span>
            <span>{minutes}:{seconds.toString().padStart(2, '0')}</span>
        </div>
    );
}

const getStatusColor = (status) => {
    switch (status) {
        case 'STABLE': return '#4f4';
        case 'WARNING': return '#fb0';
        case 'CRITICAL': return '#f44';
        default: return '#fff';
    }
};

const styles = {
    bar: {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        padding: '0 16px',
        height: '32px',
        background: '#000',
        color: '#fff',
        fontFamily: 'monospace',
        fontSize: '0.75rem',
        borderBottom: '1px solid #333',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        letterSpacing: '0.05em'
    },
    section: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px'
    },
    divider: {
        opacity: 0.3
    },
    phase: {
        color: 'var(--iron-accent, #aaa)',
        textTransform: 'uppercase'
    },
    streak: {
        fontWeight: 'bold'
    },
    verdict: {
        background: '#f44',
        color: '#fff',
        padding: '2px 8px',
        fontSize: '0.65rem',
        fontWeight: 'bold',
        borderRadius: '2px',
        animation: 'pulse 1s infinite'
    }
};
