import React from 'react';
import { ComplianceControl } from '../../ui/components/obligation/ComplianceControl';

/**
 * No Institution Surface
 * State: Institution absent or not constructed.
 * Purpose: Communicate requirements for formation.
 */
export const NoInstitutionSurface = ({ onInitialize, onDiagnostic }) => {
    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            color: 'var(--iron-text-primary)'
        }}>
            <div className="text-sm-caps" style={{ opacity: 0.5, marginBottom: 'var(--iron-space-lg)' }}>
                INSTITUTIONAL VOID
            </div>

            <h1 style={{ fontFamily: 'var(--font-authority)', fontSize: '1.5rem', marginBottom: 'var(--iron-space-xl)' }}>
                NO INSTITUTION INITIALIZED
            </h1>

            <div style={{
                background: 'var(--iron-surface-2)',
                border: '1px solid var(--iron-border)',
                padding: 'var(--iron-space-lg)',
                marginBottom: 'var(--iron-space-xl)',
                width: '100%',
                maxWidth: '400px'
            }}>
                <StatusRow label="ENGINE PRESENCE" status={false} />
                <StatusRow label="MEMORY LEDGER" status={false} />
                <StatusRow label="CONTRACT SET" status={false} />
                <StatusRow label="STANDING ENGINE" status={false} />
            </div>

            <div style={{ width: '100%', maxWidth: '300px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <ComplianceControl
                    label="INITIALIZE INSTITUTION"
                    variant="standard"
                    onComplete={onInitialize}
                />
                <button
                    onClick={onDiagnostic}
                    style={{
                        background: 'transparent',
                        border: '1px dashed var(--iron-border)',
                        color: 'var(--iron-text-secondary)',
                        padding: '12px',
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.7rem',
                        cursor: 'pointer'
                    }}
                >
                    ENTER DIAGNOSTIC MODE
                </button>
            </div>
        </div>
    );
};

const StatusRow = ({ label, status }) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}>
        <span>{label}</span>
        <span style={{ color: status ? 'var(--iron-brand-stable)' : 'var(--iron-brand-breach)' }}>
            {status ? 'ONLINE' : 'MISSING'}
        </span>
    </div>
);
