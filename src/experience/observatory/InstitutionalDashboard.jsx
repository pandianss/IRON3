import React from 'react';
import { InstitutionalFocusProvider, useInstitutionalFocus } from '../../context/InstitutionalFocusContext';
import { FitnessFocusView } from '../focus/FitnessFocusView';
import { InstitutionalHeader } from './InstitutionalHeader';
import { ConstitutionalStatus } from '../../ui/components/governance/ConstitutionalStatus';
import { BodyArchiveSurface } from './BodyArchiveSurface';
import { StandingBanner } from '../../ui/components/authority/StandingBanner';
import { useGovernance } from '../../context/GovernanceContext';

const InstitutionalHome = ({ snapshot }) => {
    const { orientation } = snapshot;

    return (
        <div style={dashboardStyles.home}>
            <div style={dashboardStyles.hero}>
                <div style={dashboardStyles.phaseLabel}>PHASE: {orientation.phase}</div>
                <h1 style={dashboardStyles.homeTitle}>EXISTENTIAL STATUS</h1>
            </div>

            <div style={dashboardStyles.grid}>
                <div style={dashboardStyles.mainCard}>
                    <div style={dashboardStyles.cardLabel}>STANDING INTEGRITY</div>
                    <div style={dashboardStyles.integrityValue}>{orientation.standing.integrity.label}</div>
                    <div style={{ ...dashboardStyles.integrityStatus, color: getIntegrityColor(orientation.standing.integrity.status) }}>
                        {orientation.standing.integrity.status}
                    </div>
                </div>

                <div style={dashboardStyles.mainCard}>
                    <div style={dashboardStyles.cardLabel}>CONTINUITY</div>
                    <div style={dashboardStyles.integrityValue}>{orientation.standing.continuity.label}</div>
                    <div style={dashboardStyles.integrityStatus}>CURRENT STREAK</div>
                </div>
            </div>

            <div style={dashboardStyles.historySection}>
                <div style={dashboardStyles.cardLabel}>LATEST VERDICT</div>
                <div style={dashboardStyles.verdictRow}>
                    <div style={{ fontFamily: 'var(--font-authority)', fontSize: '1.1rem' }}>SUSTAINED</div>
                    <div style={{ opacity: 0.6, fontSize: '0.8rem' }}>Integrity reinforced. Protocol successfully sealed.</div>
                </div>
            </div>

            <div style={dashboardStyles.quickActions}>
                <div style={dashboardStyles.actionCard}>
                    <div style={dashboardStyles.cardLabel}>MEMORY</div>
                    <div style={dashboardStyles.actionTitle}>BROWSE BODY ARCHIVE</div>
                </div>
                <div style={dashboardStyles.actionCard}>
                    <div style={dashboardStyles.cardLabel}>METHODS</div>
                    <div style={dashboardStyles.actionTitle}>ACCESS RECOGNIZED TOOLS</div>
                </div>
            </div>
        </div>
    );
};

const getIntegrityColor = (status) => {
    if (status === 'STABLE') return 'var(--iron-brand-stable)';
    if (status === 'WARNING') return 'var(--iron-brand-risk)';
    return 'var(--iron-brand-breach)';
};

// --- MAIN DASHBOARD ---

export const InstitutionalDashboard = ({ snapshot }) => {
    const activeModules = snapshot?.activeModules || [];

    // Status Logic for Header
    const standing = snapshot?.standing || { state: 'BOOTING', integrity: 0 };
    const identity = snapshot?.identity || { id: 'ORPHAN-SYS', epoch: 'VOID' };
    const phase = snapshot?.phase?.id || 'GENESIS';
    let status = 'OK';
    if (phase === 'GENESIS' || phase === 'PROBATION') status = 'CALIBRATION';
    if (snapshot?.diagnostics?.errors > 0 || standing.state === 'VIOLATED') status = 'CONFLICT';
    if (standing.state === 'BOOTING') status = 'BOOTING';

    const isGhost = standing.state === 'BOOTING';

    return (
        <InstitutionalFocusProvider activeModules={activeModules}>
            <DashboardContent
                snapshot={snapshot}
                isGhost={isGhost}
                identity={identity}
                status={status}
            />
        </InstitutionalFocusProvider>
    );
};

// Inner component to consume context
const DashboardContent = ({ snapshot, isGhost, identity, status }) => {
    const [view, setView] = React.useState('HOME'); // HOME | ARCHIVE | METHODS
    const { orientation } = snapshot;

    return (
        <div style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            background: 'var(--iron-surface-authority)',
            color: 'var(--iron-text-primary)',
            height: '100vh',
            overflow: 'hidden',
            filter: isGhost ? 'grayscale(0.8) contrast(1.2)' : 'none',
            opacity: isGhost ? 0.7 : 1,
        }}>
            <StandingBanner standing={orientation.standing} era={snapshot.state?.currentEra} />

            <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
                {/* 1. Sidebar (Refined for navigation) */}
                <div style={dashboardStyles.sidebar}>
                    <div
                        onClick={() => setView('HOME')}
                        style={{ ...dashboardStyles.navItem, color: view === 'HOME' ? '#fff' : '#666' }}
                    >
                        HOME
                    </div>
                    <div
                        onClick={() => setView('ARCHIVE')}
                        style={{ ...dashboardStyles.navItem, color: view === 'ARCHIVE' ? '#fff' : '#666' }}
                    >
                        BODY ARCHIVE
                    </div>
                    <div
                        onClick={() => setView('METHODS')}
                        style={{ ...dashboardStyles.navItem, color: view === 'METHODS' ? '#fff' : '#666' }}
                    >
                        RECOGNIZED METHODS
                    </div>
                    <div style={{ ...dashboardStyles.navItem, color: '#444', pointerEvents: 'none', marginTop: 'auto' }}>
                        GOVERNANCE
                    </div>
                </div>

                {/* 2. Focus Area */}
                <div style={{ flex: 1, overflowY: 'auto', background: 'var(--iron-surface-base)' }}>
                    {view === 'HOME' && <InstitutionalHome snapshot={snapshot} />}
                    {view === 'ARCHIVE' && <BodyArchiveSurface orientation={orientation} />}
                    {view === 'METHODS' && <FitnessFocusView snapshot={snapshot} />}
                </div>
            </div>
        </div>
    );
};

const dashboardStyles = {
    sidebar: {
        width: '260px',
        background: 'var(--iron-surface-2)',
        borderRight: '1px solid var(--iron-border)',
        display: 'flex',
        flexDirection: 'column',
        padding: '24px 0'
    },
    navItem: {
        padding: '16px 32px',
        fontSize: '0.8rem',
        fontFamily: 'var(--font-authority)',
        letterSpacing: '1px',
        cursor: 'pointer',
        transition: 'all 0.2s',
        textTransform: 'uppercase'
    },
    home: {
        padding: '40px',
        maxWidth: '900px',
        margin: '0 auto',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: '40px'
    },
    hero: {
        borderBottom: '1px solid var(--iron-border)',
        paddingBottom: '24px'
    },
    phaseLabel: {
        fontSize: '0.65rem',
        color: 'var(--iron-accent)',
        fontFamily: 'var(--font-mono)',
        letterSpacing: '2px',
        marginBottom: '8px'
    },
    homeTitle: {
        fontFamily: 'var(--font-authority)',
        fontSize: '2.4rem',
        letterSpacing: '2px'
    },
    grid: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '24px'
    },
    mainCard: {
        background: 'var(--iron-surface-2)',
        padding: '32px',
        border: '1px solid var(--iron-border)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '8px'
    },
    cardLabel: {
        fontSize: '0.6rem',
        opacity: 0.4,
        fontFamily: 'var(--font-mono)',
        textTransform: 'uppercase',
        letterSpacing: '1px'
    },
    integrityValue: {
        fontFamily: 'var(--font-authority)',
        fontSize: '3rem'
    },
    integrityStatus: {
        fontSize: '0.8rem',
        fontFamily: 'var(--font-authority)',
        letterSpacing: '1px'
    },
    historySection: {
        background: 'var(--iron-surface)',
        border: '1px solid var(--iron-border)',
        padding: '24px',
        borderLeft: '4px solid var(--iron-accent)'
    },
    verdictRow: {
        marginTop: '12px',
        display: 'flex',
        flexDirection: 'column',
        gap: '4px'
    },
    quickActions: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '24px'
    },
    actionCard: {
        background: 'var(--iron-surface-2)',
        padding: '24px',
        border: '1px solid var(--iron-border)',
        cursor: 'pointer',
        transition: 'all 0.2s'
    },
    actionTitle: {
        marginTop: '8px',
        fontSize: '0.9rem',
        fontFamily: 'var(--font-authority)',
        letterSpacing: '1px'
    }
};

InstitutionalDashboard.contract = {
    supportedPhases: ['initiated', 'bound', 'active', 'degrading', 'recovering', 'sovereign'],
    authorityRange: [1, 5]
};
