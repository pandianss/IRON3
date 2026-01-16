import React from 'react';
import { RecoveryTimer } from './fitness/RecoveryTimer';
import { StandingRadar } from './fitness/StandingRadar';
import { HeatMap } from './HeatMap';

import { ConstitutionalStatus } from '../../ui/components/governance/ConstitutionalStatus';
import { PhysiologyMonitor } from '../../ui/components/governance/PhysiologyMonitor';
import { StandingBadge } from '../../ui/components/governance/StandingBadge';
import { AuditLog } from '../../ui/components/governance/AuditLog';
import { RecoveryMonitor } from '../../ui/components/governance/RecoveryMonitor';

import { InstitutionalHeader } from './InstitutionalHeader';
import { StandingCore } from './StandingCore'; // Keeping import just in case, but unused?
import { AuthorityMap } from './AuthorityMap';
import { ContractMonitor } from './ContractMonitor';
import { EventLedger } from './EventLedger';
import { DiagnosticsStrip } from './DiagnosticsStrip';

/**
 * THE INSTITUTIONAL OBSERVATORY
 * The primary governed surface. An institutional cockpit.
 */
export const InstitutionalDashboard = ({ snapshot }) => {
    // Map Snapshot to Regions
    const standing = snapshot?.standing || { state: 'BOOTING', integrity: 0 };
    const identity = snapshot?.identity || { id: 'ORPHAN-SYS', epoch: 'VOID' };
    const phase = snapshot?.phase?.id || 'GENESIS';

    // Status Logic
    let status = 'OK';
    if (phase === 'GENESIS' || phase === 'PROBATION') status = 'CALIBRATION';
    if (snapshot?.diagnostics?.errors > 0 || standing.state === 'VIOLATED') status = 'CONFLICT';
    if (standing.state === 'BOOTING') status = 'BOOTING';

    const isGhost = standing.state === 'BOOTING';

    // The state domain contains the physiological data if FITNESS is active
    const physiology = snapshot?.physiology || { capacity: 100, law: { isAuthorized: true } };

    // Feature Gates: Only enabled if the module has been activated in the Kernel
    const activeModules = snapshot?.activeModules || [];
    const isFitness = activeModules.includes('FITNESS_RECOVERY');

    const fitnessVectors = snapshot?.fitnessStanding;

    return (
        <div style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            background: 'var(--iron-surface-authority)',
            color: 'var(--iron-text-primary)',
            maxHeight: '100vh',
            overflow: 'hidden',
            position: 'relative',
            filter: isGhost ? 'grayscale(0.8) contrast(1.2)' : 'none',
            opacity: isGhost ? 0.7 : 1,
            transition: 'all 1s ease'
        }}>
            {/* Degradation Pulse Overlay */}
            {status === 'CONFLICT' && (
                <div style={{
                    position: 'absolute',
                    top: 0, left: 0, right: 0, bottom: 0,
                    background: 'var(--iron-brand-breach)',
                    zIndex: 0,
                    pointerEvents: 'none',
                    animation: 'iron-pulse-breach 4s infinite ease-in-out'
                }} />
            )}

            {/* A. Header */}
            <InstitutionalHeader
                identity={identity}
                status={status}
                physiology={physiology}
                isFitness={isFitness}
            />

            {/* Main Content Grid */}
            <div style={{
                flex: 1,
                display: 'grid',
                gridTemplateColumns: isFitness ? 'minmax(320px, 1fr) 1fr 1fr' : 'minmax(300px, 1fr) minmax(300px, 1fr)',
                gridTemplateRows: isFitness ? '1fr 1fr' : 'repeat(2, 1fr)',
                gap: '1px',
                background: 'var(--iron-border)',
                overflow: 'hidden'
            }}>
                {/* B. Constitutional Column (formerly Standing Core) */}
                <div style={{ background: 'var(--iron-surface)', gridRow: isFitness ? 'span 2' : 'auto', padding: '16px', overflowY: 'auto' }}>
                    {/* 1. Sovereign Status */}
                    <ConstitutionalStatus />

                    {/* 1.5. Recovery Monitor (Priority) */}
                    <RecoveryMonitor />

                    {/* 2. Standing Badge (Belt) */}
                    <StandingBadge />

                    {/* 2.5 Streak Heatmap (Provenance) */}
                    <div className="mt-4">
                        <HeatMap streak={standing.streak} />
                    </div>

                    {/* 3. Physiology (if Active) */}
                    {isFitness && (
                        <div className="mt-4">
                            <PhysiologyMonitor />
                        </div>
                    )}

                    {/* 4. Legacy Radar & Recovery (Kept for continuity) */}
                    {isFitness && (
                        <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid var(--iron-border)' }}>
                            <StandingRadar vectors={fitnessVectors} />
                        </div>
                    )}
                    {isFitness && (
                        <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid var(--iron-border)' }}>
                            <RecoveryTimer
                                law={physiology.law}
                                era={physiology.era}
                                params={physiology.params}
                            />
                        </div>
                    )}
                </div>


                {/* C. Authority Map */}
                <div style={{ background: 'var(--iron-surface)' }}>
                    <AuthorityMap authority={snapshot?.authority} />
                </div>

                {/* D. Contract Monitor */}
                <div style={{ background: 'var(--iron-surface)' }}>
                    <ContractMonitor contracts={snapshot?.contracts} />
                </div>

                {/* E. Audit Ledger (Governance) */}
                <div style={{ background: 'var(--iron-surface)' }}>
                    <AuditLog />
                </div>
            </div>

            {/* F. Diagnostics Strip */}
            <DiagnosticsStrip diagnostics={snapshot?.diagnostics} />
        </div>
    );
};
