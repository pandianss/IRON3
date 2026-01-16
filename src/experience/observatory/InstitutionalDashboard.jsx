import React from 'react';
import { InstitutionalFocusProvider, useInstitutionalFocus } from '../../context/InstitutionalFocusContext';
import { FitnessFocusView } from '../focus/FitnessFocusView';
import { InstitutionalHeader } from './InstitutionalHeader';
import { ConstitutionalStatus } from '../../ui/components/governance/ConstitutionalStatus';
import { StandingBadge } from '../../ui/components/governance/StandingBadge';
import { RecoveryMonitor } from '../../ui/components/governance/RecoveryMonitor'; // Kept for generic view

// --- SUB-COMPONENTS ---

const ModuleSidebar = ({ activeModules, focusedId, onFocus }) => (
    <div style={{
        width: '240px',
        background: 'var(--iron-surface-2)',
        borderRight: '1px solid var(--iron-border)',
        display: 'flex',
        flexDirection: 'column'
    }}>
        <div style={{ padding: '20px', fontSize: '0.7rem', opacity: 0.5, letterSpacing: '1px' }}>
            ACTIVE INSTITUTIONS
        </div>
        {activeModules.map(mod => (
            <div
                key={mod}
                onClick={() => onFocus(mod)}
                style={{
                    padding: '16px 20px',
                    background: mod === focusedId ? 'var(--iron-surface)' : 'transparent',
                    borderLeft: mod === focusedId ? '4px solid var(--iron-accent)' : '4px solid transparent',
                    cursor: 'pointer',
                    fontFamily: 'var(--font-authority)',
                    fontSize: '0.9rem',
                    color: mod === focusedId ? 'var(--iron-text-primary)' : 'var(--iron-text-secondary)',
                    transition: 'all 0.2s'
                }}
            >
                {mod.replace('_RECOVERY', '')}
            </div>
        ))}
        {activeModules.length === 0 && (
            <div style={{ padding: '20px', opacity: 0.5, fontStyle: 'italic', fontSize: '0.8rem' }}>
                No active institutions.
            </div>
        )}
    </div>
);

const FocusArea = ({ focusedId, snapshot }) => {
    // If no focus, or generic, show generic dashboard (or maybe a summary?)
    if (!focusedId) return <div style={{ padding: 40, opacity: 0.5 }}>SELECT AN INSTITUTION</div>;

    if (focusedId === 'FITNESS_RECOVERY') {
        return <FitnessFocusView snapshot={snapshot} />;
    }

    return (
        <div style={{ padding: 40 }}>
            <h2 style={{ fontFamily: 'var(--font-authority)' }}>{focusedId}</h2>
            <p style={{ opacity: 0.6 }}>Generic Module Interface</p>
        </div>
    );
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
    const { focusedModuleId, setFocusedModuleId } = useInstitutionalFocus();
    const activeModules = snapshot?.activeModules || [];

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
            {/* Header stays global */}
            <InstitutionalHeader
                identity={identity}
                status={status}
            // We pass generic info here, specific telemetry moves to focus view
            />

            <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
                {/* 1. Sidebar */}
                <ModuleSidebar
                    activeModules={activeModules}
                    focusedId={focusedModuleId}
                    onFocus={setFocusedModuleId}
                />

                {/* 2. Focus Area */}
                <div style={{ flex: 1, overflowY: 'auto', background: 'var(--iron-surface-base)' }}>
                    <FocusArea focusedId={focusedModuleId} snapshot={snapshot} />
                </div>
            </div>
        </div>
    );
};
