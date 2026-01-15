import React, { useState } from 'react';
import { useGovernance } from '../../context/GovernanceContext';
import { useStanding } from '../../ui/hooks/useStanding';
import '../../ui/styles/InstitutionalTheme.css';

// Primitives
import { StandingBanner } from '../../ui/components/authority/StandingBanner';
import { ContractCard } from '../../ui/components/obligation/ContractCard';
import { ComplianceControl } from '../../ui/components/obligation/ComplianceControl';

/**
 * Phase 2.2: Compliance Chambers
 * Role: The Ante-Chamber. Preparation and Initiation.
 */
export const ObligationCorridor = ({ obligations, mode = 'STANDARD' }) => {
    const { institutionalState, declare } = useGovernance();
    const interpretation = useStanding();

    const [venue, setVenue] = useState('');
    const [isStarting, setIsStarting] = useState(false);

    const handleInitiate = async () => {
        if (!venue.trim()) return; // Validation

        setIsStarting(true);
        const payload = {
            venue: venue,
            startedAt: new Date().toISOString()
        };

        // Start Session -> Routes to EVIDENCE_CAPTURE (Active Mode)
        await declare('SESSION_STARTED', payload);
    };

    const handleRest = async () => {
        await declare('REST_TAKEN');
    };

    return (
        <div style={{
            minHeight: '100vh',
            background: 'var(--iron-bg-primary)',
            display: 'flex',
            flexDirection: 'column'
        }}>
            {/* COMPACT AUTHORITY */}
            <div style={{ transform: 'scale(0.8)', transformOrigin: 'top center', marginBottom: '-20px' }}>
                <StandingBanner standing={institutionalState.standing} era={institutionalState.currentEra} />
            </div>

            {/* CHAMBER FLOOR */}
            <div style={{
                flex: 1,
                padding: 'var(--iron-space-lg)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                maxWidth: '600px',
                margin: '0 auto',
                width: '100%'
            }}>
                <div style={{ width: '100%' }}>
                    <div className="text-sm-caps" style={{
                        marginBottom: 'var(--iron-space-lg)',
                        textAlign: 'center',
                        color: 'var(--iron-accent)'
                    }}>
                        ACTIVE PROTOCOL
                    </div>

                    <div className="surface-obligation">
                        {/* Contract Header */}
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginBottom: 'var(--iron-space-md)',
                            borderBottom: '1px solid var(--iron-border)',
                            paddingBottom: 'var(--iron-space-sm)'
                        }}>
                            <span className="text-sm-caps" style={{ color: 'var(--iron-accent)', fontWeight: 'bold' }}>
                                REQUIRED ACTION
                            </span>
                            <span className="font-numeric" style={{ opacity: 0.3, fontSize: '1.5rem', lineHeight: 1 }}>01</span>
                        </div>

                        <h2 className="font-authority" style={{ fontSize: '1.75rem', marginBottom: 'var(--iron-space-lg)' }}>
                            DAILY PRACTICE
                        </h2>

                        {/* Venue Input (Mandatory Start Requirement) */}
                        <div className="space-y-sm" style={{ marginBottom: 'var(--iron-space-lg)' }}>
                            <label className="text-sm-caps" style={{ display: 'block', opacity: 0.7 }}>VENUE / LOCATION</label>
                            <input
                                type="text"
                                value={venue}
                                onChange={(e) => setVenue(e.target.value)}
                                placeholder="ENTER VENUE TO UNLOCK"
                                style={{
                                    width: '100%',
                                    background: 'var(--iron-surface)',
                                    border: venue ? '1px solid var(--iron-accent)' : '1px solid var(--iron-border)',
                                    color: 'var(--iron-text-primary)',
                                    padding: '12px',
                                    fontFamily: 'var(--font-mono)',
                                    textTransform: 'uppercase'
                                }}
                            />
                        </div>

                        {/* Action Controls */}
                        <ComplianceControl
                            label={isStarting ? "INITIALIZING..." : "INITIATE PROTOCOL"}
                            onComplete={handleInitiate}
                            variant={venue ? "standard" : "disabled"}
                            disabled={!venue || isStarting}
                        />

                        <div style={{ marginTop: 'var(--iron-space-md)' }}>
                            <ComplianceControl
                                label="DECLARE REST"
                                variant="rest"
                                onComplete={handleRest}
                            />
                        </div>

                    </div>
                </div>
            </div>

        </div>
    );
};
