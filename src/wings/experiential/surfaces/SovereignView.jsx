import React from 'react';
import { useGovernance } from '../../../spine/context/GovernanceContext';
import '../../../ui/styles/sovereign.css';

export const SovereignView = ({ state }) => {
    const { declare } = useGovernance();
    const { phase, standing } = state;

    return (
        <div className="sovereign-container">
            {/* Header */}
            <header className="sovereign-header">
                <div className="sovereign-logo">IRON SOVEREIGNTY</div>
                <div className="sovereign-phase">
                    PHASE: <span style={{ color: 'var(--iron-brand-stable)' }}>{phase?.id || 'UNKNOWN'}</span>
                </div>
            </header>

            {/* Main Grid */}
            <main className="sovereign-grid">

                {/* 1. Standing Card */}
                <div className="sovereign-card">
                    <div className="sovereign-card-label">STANDING INTEGRITY</div>
                    <div className="sovereign-integrity">
                        100%
                    </div>
                    <div className="sovereign-status-row">
                        <span className="sovereign-card-label">STATUS</span>
                        <span style={{ color: 'var(--iron-brand-stable)' }}>STABLE</span>
                    </div>
                </div>

                {/* 2. Protocol Actions */}
                <div className="sovereign-card">
                    <div className="sovereign-card-label">DIRECTIVES</div>
                    <div className="sovereign-actions">
                        <button
                            className="sovereign-button"
                            onClick={() => declare('PROTOCOL_INITIATED', { protocol: 'STANDARD_SESSION' })}
                        >
                            INITIATE SESSION
                        </button>
                        <button
                            className="sovereign-button risk"
                            onClick={() => declare('SYSTEM_CALIBRATION', {})}
                        >
                            CALIBRATE
                        </button>
                    </div>
                </div>

                {/* 3. Audit Stream */}
                <div className="sovereign-card audit-stream">
                    <div className="sovereign-card-label">JUDICIAL AUDIT STREAM</div>
                    <div className="audit-container">
                        {state.compliance?.audit?.slice(-5).reverse().map((entry, i) => (
                            <div key={i} className="audit-entry">
                                <span className="audit-timestamp">{new Date(entry.timestamp).toLocaleTimeString()}</span>
                                <span className="audit-type">{entry.type}</span>
                                <span className="audit-actor">{entry.actorId}</span>
                            </div>
                        ))}
                        {(!state.compliance?.audit || state.compliance.audit.length === 0) && (
                            <div className="no-audit">No audit records found.</div>
                        )}
                    </div>
                </div>

            </main>
        </div>
    );
};
