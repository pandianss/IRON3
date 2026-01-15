import React from 'react';
import { ComplianceControl } from './ComplianceControl';
import '../../styles/InstitutionalTheme.css';

/**
 * B2. Contract Card
 * Role: A single binding requirement.
 * Visual Law: Framed, Progression visible.
 */
export const ContractCard = ({ title, type, onComplete, onFail, onRest }) => {
    // type: 'PRACTICE' | 'CHECKIN'

    return (
        <div className="surface-obligation">
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 'var(--iron-space-md)',
                borderBottom: '1px solid var(--iron-border)',
                paddingBottom: 'var(--iron-space-sm)'
            }}>
                <span className="text-sm-caps" style={{
                    color: 'var(--iron-accent)',
                    fontWeight: 'bold',
                    letterSpacing: '0.1em'
                }}>
                    REQUIRED ACTION
                </span>
                <span className="font-numeric" style={{
                    opacity: 0.3,
                    fontSize: '1.5rem',
                    lineHeight: 1
                }}>
                    01
                </span>
            </div>

            <h2 className="font-authority" style={{
                fontSize: '1.5rem',
                marginBottom: 'var(--iron-space-md)'
            }}>
                {title}
            </h2>

            <div className="space-y-sm">
                <ComplianceControl
                    label="CONFIRM EXECUTION"
                    variant="standard"
                    onComplete={onComplete}
                />

                {onRest && (
                    <ComplianceControl
                        label="DECLARE REST"
                        variant="rest"
                        onComplete={onRest}
                    />
                )}

                {onFail && (
                    <div style={{ marginTop: 'var(--iron-space-lg)', textAlign: 'center' }}>
                        <button
                            className="btn-institutional btn-breach-action"
                            style={{ border: 'none', opacity: 0.6, fontSize: '0.8rem' }}
                            onClick={onFail}
                        >
                            REGISTER FAILURE
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};
