import React from 'react';
import { useGovernance } from '../../context/GovernanceContext';
import { CapacityMeter } from '../observatory/fitness/CapacityMeter';
import { RecoveryTimer } from '../observatory/fitness/RecoveryTimer';
import { PhysiologyMonitor } from '../../ui/components/governance/PhysiologyMonitor';

export const FitnessFocusView = ({ snapshot }) => {
    const { declare } = useGovernance();
    const physiology = snapshot?.physiology || { capacity: 100, load: 0, status: 'OPTIMAL' };

    const handleStartSession = async () => {
        // This declares the intent to start, which the kernel will pick up
        // The ActiveSurfaceFrame should then detect the session status 'PENDING'/'ACTIVE' and switch to EvidenceCapture
        await declare('START_SESSION', {
            timestamp: new Date().toISOString()
        });
    };

    return (
        <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: '20px', padding: '20px' }}>
            {/* 1. Context & Narrative */}
            <div style={{ padding: '20px', background: 'var(--iron-surface)', borderLeft: '4px solid var(--iron-accent)' }}>
                <div style={{ fontSize: '0.9rem', fontFamily: 'var(--font-authority)', marginBottom: '8px' }}>
                    DIRECTIVE: RECOVERY_ESSENTIAL
                </div>
                <div style={{ fontSize: '0.8rem', opacity: 0.7, lineHeight: '1.4' }}>
                    System integrity requires physiological calibration. Current capacity permits high-intensity output.
                    Engagement is mandatory for maintenance of ELITE status.
                </div>
            </div>

            {/* 2. Primary Action Deck */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <button
                    onClick={handleStartSession}
                    style={{
                        padding: '30px',
                        background: 'var(--iron-brand-stable)',
                        color: 'white',
                        border: 'none',
                        cursor: 'pointer',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '10px'
                    }}>
                    <div style={{ fontSize: '1.2rem', fontFamily: 'var(--font-authority)' }}>INITIATE PROTOCOL</div>
                    <div style={{ fontSize: '0.7rem', opacity: 0.8 }}>START GYM SESSION</div>
                </button>

                <button style={{
                    padding: '30px',
                    background: 'var(--iron-surface-2)',
                    color: 'var(--iron-text-primary)',
                    border: '1px solid var(--iron-border)',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '10px'
                }}>
                    <div style={{ fontSize: '1.2rem', fontFamily: 'var(--font-authority)' }}>LOG RECOVERY</div>
                    <div style={{ fontSize: '0.7rem', opacity: 0.6 }}>MANUAL SLEEP/DATA ENTRY</div>
                </button>
            </div>

            {/* 3. Telemetry Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px', flex: 1 }}>
                <div style={{ background: 'var(--iron-surface)', padding: '16px' }}>
                    <div style={{ fontSize: '0.7rem', opacity: 0.5, marginBottom: '10px' }}>PHYSIOLOGICAL STATUS</div>
                    <PhysiologyMonitor />
                </div>
                <div style={{ background: 'var(--iron-surface)', padding: '16px' }}>
                    <div style={{ fontSize: '0.7rem', opacity: 0.5, marginBottom: '10px' }}>RECOVERY LAW</div>
                    <RecoveryTimer
                        law={physiology.law}
                        era={physiology.era}
                        params={physiology.params}
                    />
                </div>
            </div>
        </div>
    );
};
