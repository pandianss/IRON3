import React from 'react';
import { useGovernance } from '../../../context/GovernanceContext';

/**
 * CONSTITUTIONAL AUDIT LOG
 * Replaces the ephemeral Event Ledger with the Append-Only Governance Record.
 */
export const AuditLog = () => {
    const { institutionalState } = useGovernance();
    const history = institutionalState?.compliance?.audit || [];
    // If no audit log, maybe fallback to operational ledger?
    // But we want to show GOVERNANCE decisions.

    // Sort reverse chronological
    const tail = [...history].reverse().slice(0, 15);

    return (
        <div style={{
            padding: 'var(--iron-space-lg)',
            background: 'var(--iron-surface-2)',
            border: '1px solid var(--iron-border)',
            height: '100%',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column'
        }}>
            <h3 className="text-sm-caps" style={{ opacity: 0.5, marginBottom: 'var(--iron-space-lg)' }}>
                CONSTITUTIONAL AUDIT
            </h3>

            <div style={{
                flex: 1,
                overflowY: 'auto',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.7rem'
            }}>
                {tail.map((entry, i) => {
                    const isDecision = entry.type === 'DECISION';
                    const isViolation = isDecision && !entry.allowed;
                    const color = isViolation ? 'var(--iron-brand-breach)' : 'var(--iron-accent)';

                    return (
                        <div key={i} style={{
                            padding: '8px 0',
                            borderBottom: '1px solid #222',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '4px'
                        }}>
                            <div className="flex justify-between">
                                <span style={{ color: isViolation ? 'red' : color, fontWeight: isViolation ? 'bold' : 'normal' }}>
                                    {isDecision ? (isViolation ? 'BLOCKED' : 'ALLOWED') : entry.type}
                                </span>
                                <span style={{ opacity: 0.5 }}>
                                    {new Date(entry.timestamp).toLocaleTimeString()}
                                </span>
                            </div>

                            <div style={{ opacity: 0.8 }}>
                                {entry.action}
                            </div>

                            {isViolation && entry.reasons && (
                                <div style={{ color: 'red', fontSize: '0.6rem', marginTop: '2px' }}>
                                    ⚠ {entry.reasons.join(', ')}
                                </div>
                            )}
                        </div>
                    );
                })}

                {tail.length === 0 && <div style={{ opacity: 0.4 }}>NO AUDIT RECORDS</div>}
            </div>
        </div>
    );
};
