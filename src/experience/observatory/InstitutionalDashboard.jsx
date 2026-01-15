import React from 'react';
import { RecoveryTimer } from './fitness/RecoveryTimer';

import { InstitutionalHeader } from './InstitutionalHeader';
import { StandingCore } from './StandingCore';
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
    const phase = standing.state;

    // Status Logic
    let status = 'OK';
    if (phase === 'ABSENT' || phase === 'NO_INSTITUTION' || phase === 'BOOTING') status = 'OFFLINE';
    if (snapshot?.diagnostics?.errors > 0 || phase === 'DEGRADED') status = 'CONFLICT';
    if (phase === 'BOOTING') status = 'BOOTING';

    const isGhost = phase === 'ABSENT' || phase === 'NO_INSTITUTION' || phase === 'BOOTING';

    // The state domain contains the physiological data if FITNESS is active
    const physiology = snapshot?.physiology || { capacity: 100, law: { isAuthorized: true } };

    // Feature Gates: Only enabled if the module has been activated in the Kernel
    const activeModules = snapshot?.activeModules || [];
    const isFitness = activeModules.includes('FITNESS_RECOVERY');

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
                gridTemplateColumns: isFitness ? 'minmax(300px, 1fr) 1fr 1fr' : 'minmax(300px, 1fr) minmax(300px, 1fr)',
                gridTemplateRows: isFitness ? '1fr 1fr' : 'repeat(2, 1fr)',
                gap: '1px',
                background: 'var(--iron-border)',
                overflow: 'hidden'
            }}>
                {/* B. Standing Core */}
                <div style={{ background: 'var(--iron-surface)', gridRow: isFitness ? 'span 2' : 'auto' }}>
                    <StandingCore standing={snapshot?.standing} />
                    {isFitness && (
                        <div style={{ padding: '20px', borderTop: '1px solid var(--iron-border)' }}>
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

                {/* E. Event Ledger */}
                <div style={{ background: 'var(--iron-surface)' }}>
                    <EventLedger events={snapshot?.ledger} />
                </div>
            </div>

            {/* F. Diagnostics Strip */}
            <DiagnosticsStrip diagnostics={snapshot?.diagnostics} />
        </div>
    );
};
