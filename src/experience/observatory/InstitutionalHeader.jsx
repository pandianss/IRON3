import React from 'react';
import { CapacityMeter } from './fitness/CapacityMeter';


/**
 * Region A: Institutional Header
 * Establish identity and liveness.
 */
export const InstitutionalHeader = ({ identity, status, physiology, isFitness }) => {
    return (
        <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: 'var(--iron-space-md) var(--iron-space-lg)',
            borderBottom: '1px solid var(--iron-border)',
            background: 'var(--iron-surface)',
            color: 'var(--iron-text-primary)'
        }}>
            <div style={{ flex: 1 }}>
                <div style={{ fontSize: '0.6rem', opacity: 0.5, fontFamily: 'var(--font-mono)' }}>INSTITUTION_ID</div>
                <div style={{ fontFamily: 'var(--font-authority)', letterSpacing: '2px' }}>
                    {identity?.id || 'SIGMA-9'} <span style={{ opacity: 0.3, fontSize: '0.8rem' }}>// {identity?.epoch || '2025'}</span>
                </div>
            </div>

            <div style={{ flex: 1, textAlign: 'center' }}>
                <div style={{ fontSize: '0.6rem', opacity: 0.5 }}>CURRENT PHASE</div>
                <div style={{ fontVariant: 'small-caps', color: 'var(--iron-accent)' }}>
                    {identity?.phase || 'OPERATIONAL'}
                </div>
            </div>

            {isFitness && (
                <div style={{ flex: 1, padding: '0 20px', borderLeft: '1px solid #222', borderRight: '1px solid #222' }}>
                    <CapacityMeter physiology={physiology} />
                </div>
            )}

            <div style={{ flex: 1, textAlign: 'right' }}>
                <div style={{ fontSize: '0.6rem', opacity: 0.5 }}>SYSTEM STATUS</div>
                <div style={{
                    color: status === 'CONFLICT' ? 'var(--iron-brand-breach)' : 'var(--iron-brand-stable)',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.8rem'
                }}>
                    ● {status || 'OK'}
                </div>
            </div>
        </div>
    );
};
