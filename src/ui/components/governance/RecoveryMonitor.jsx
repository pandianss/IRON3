
import React from 'react';
import { useGovernance } from '../../../context/GovernanceContext.jsx';

const PHASE_CONFIG = {
    'STABILIZATION': {
        color: '#f59e0b', // Amber
        label: 'STABILIZATION',
        desc: 'Halt Decline. Control Stress.',
        next: 'RECONSTITUTION'
    },
    'RECONSTITUTION': {
        color: '#3b82f6', // Blue
        label: 'RECONSTITUTION',
        desc: 'Rebuild Continuity. Consistency is key.',
        next: 'REINTEGRATION'
    },
    'REINTEGRATION': {
        color: '#8b5cf6', // Violet
        label: 'REINTEGRATION',
        desc: 'Prove readiness for higher standing.',
        next: 'REVALIDATION'
    },
    'REVALIDATION': {
        color: '#10b981', // Emerald
        label: 'REVALIDATION',
        desc: 'Final proof of sustained trajectory.',
        next: 'COMPLETED'
    }
};

export const RecoveryMonitor = () => {
    const { state } = useGovernance();
    const standing = state.standing || {};
    const recovery = standing.recovery || { phase: null, daysInPhase: 0 };

    // Only show if in Recovery Mode or Degraded
    const isDegraded = standing.state === 'DEGRADED' || standing.state === 'BREACHED';
    const hasActiveRecovery = recovery.phase && recovery.phase !== 'COMPLETED';

    if (!isDegraded && !hasActiveRecovery) return null;

    const currentPhase = recovery.phase || 'STABILIZATION';
    const config = PHASE_CONFIG[currentPhase] || PHASE_CONFIG['STABILIZATION'];

    return (
        <div style={{
            padding: '1rem',
            background: 'rgba(20, 20, 30, 0.95)',
            border: `1px solid ${config.color}`,
            borderRadius: '8px',
            marginBottom: '1rem',
            color: '#e0e0e0',
            fontFamily: 'monospace'
        }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.8rem', opacity: 0.7, textTransform: 'uppercase' }}>CONSTITUTIONAL RECOVERY</span>
                <span style={{
                    background: config.color,
                    color: '#000',
                    padding: '2px 6px',
                    borderRadius: '4px',
                    fontSize: '0.75rem',
                    fontWeight: 'bold'
                }}>
                    {config.label}
                </span>
            </div>

            <div style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                Day {recovery.daysInPhase || 0}
            </div>

            <div style={{ fontSize: '0.9rem', marginBottom: '1rem', opacity: 0.9 }}>
                Mandate: {config.desc}
            </div>

            {/* Phase Progress Bar */}
            <div style={{ display: 'flex', gap: '4px', height: '4px', opacity: 0.5 }}>
                {Object.keys(PHASE_CONFIG).map((p, idx) => {
                    const isActive = p === currentPhase;
                    const isPast = Object.keys(PHASE_CONFIG).indexOf(p) < Object.keys(PHASE_CONFIG).indexOf(currentPhase);
                    return (
                        <div key={p} style={{
                            flex: 1,
                            background: isActive || isPast ? config.color : '#333',
                            borderRadius: '2px'
                        }} />
                    );
                })}
            </div>

            <div style={{ marginTop: '0.5rem', fontSize: '0.75rem', textAlign: 'right', opacity: 0.6 }}>
                Next: {config.next}
            </div>
        </div>
    );
};
