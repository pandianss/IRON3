import React from 'react';
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
    const identity = {
        id: snapshot?.identity?.id || 'SIGMA-9',
        epoch: snapshot?.identity?.epoch || '2025',
        phase: snapshot?.phase || 'OPERATIONAL'
    };
    const status = snapshot?.diagnostics?.errors > 0 ? 'CONFLICT' : 'OK';

    return (
        <div style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            background: 'var(--iron-surface-authority)',
            color: 'var(--iron-text-primary)',
            maxHeight: '100vh',
            overflow: 'hidden'
        }}>
            {/* A. Header */}
            <InstitutionalHeader identity={identity} status={status} />

            {/* Main Content Grid */}
            <div style={{
                flex: 1,
                display: 'grid',
                gridTemplateColumns: 'minmax(300px, 1fr) minmax(300px, 1fr)',
                gridTemplateRows: 'repeat(2, 1fr)',
                gap: '1px',
                background: 'var(--iron-border)',
                overflow: 'hidden'
            }}>
                {/* B. Standing Core */}
                <div style={{ background: 'var(--iron-surface)' }}>
                    <StandingCore standing={snapshot?.standing} />
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
