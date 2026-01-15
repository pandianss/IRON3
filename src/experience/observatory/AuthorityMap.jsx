import React from 'react';

/**
 * Region C: Authority Map
 * Expose institutional power and territorial restrictions.
 */
export const AuthorityMap = ({ authority }) => {
    const surfaces = authority?.surfaces || {};

    return (
        <div style={{
            padding: 'var(--iron-space-lg)',
            background: 'var(--iron-surface-2)',
            border: '1px solid var(--iron-border)',
            height: '100%'
        }}>
            <h3 className="text-sm-caps" style={{ opacity: 0.5, marginBottom: 'var(--iron-space-lg)' }}>AUTHORITY MAP</h3>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <MapCell label="SYSTEM_STATE" status={surfaces['SYSTEM_STATE']} />
                <MapCell label="OBLIGATION" status={surfaces['OBLIGATION_CORRIDOR']} />
                <MapCell label="EVIDENCE" status={surfaces['EVIDENCE_CAPTURE']} />
                <MapCell label="CONSEQUENCE" status={surfaces['CONSEQUENCE_HALL']} />
            </div>

            <div style={{ marginTop: 'var(--iron-space-xl)', fontSize: '0.7rem', opacity: 0.6, fontFamily: 'var(--font-mono)' }}>
                <div style={{ marginBottom: '4px' }}>INTERACTION_LEVEL: {authority?.interactionLevel || 'GOVERNED'}</div>
                <div>RESTRICTIONS: {authority?.restrictions?.length || 0} ACTIVE</div>
            </div>
        </div>
    );
};

const MapCell = ({ label, status }) => {
    const locked = !status || status === 'HIDDEN';
    return (
        <div style={{
            border: `1px solid ${locked ? '#400' : 'var(--iron-border)'}`,
            padding: '12px',
            background: locked ? 'rgba(255,0,0,0.05)' : 'rgba(255,255,255,0.02)',
            opacity: locked ? 0.3 : 1,
            textAlign: 'center'
        }}>
            <div style={{ fontSize: '0.6rem', color: locked ? '#f88' : 'var(--iron-text-primary)' }}>{label}</div>
            <div style={{ fontSize: '0.5rem', opacity: 0.5, marginTop: '4px' }}>
                {locked ? 'LOCKED' : 'UNLOCKED'}
            </div>
        </div>
    );
};
