import React, { useState, useEffect } from 'react';
import { useGovernance } from '../../context/GovernanceContext';
import '../../ui/styles/InstitutionalTheme.css';
import { StandingBanner } from '../../ui/components/authority/StandingBanner';
import { ComplianceControl } from '../../ui/components/obligation/ComplianceControl';

/**
 * Phase 2.5: Evidence Capture (Active Session Mode)
 * Role: The lived experience of the protocol.
 * Features: Live Timer, Multi-Proof Accumulation.
 */
export const EvidenceCapture = ({ startTime, venue }) => {
    const { institutionalState, declare } = useGovernance();

    // Timer State
    const [elapsed, setElapsed] = useState("00:00:00");

    // Evidence State
    const [proofs, setProofs] = useState([]); // Array of { id, tag, file }
    const [currentTag, setCurrentTag] = useState('');

    // Timer Logic
    useEffect(() => {
        if (!startTime) return;
        const start = new Date(startTime).getTime();

        const interval = setInterval(() => {
            const now = new Date().getTime();
            const diff = now - start;

            const hours = Math.floor(diff / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);

            setElapsed(
                `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
            );
        }, 1000);

        return () => clearInterval(interval);
    }, [startTime]);

    const handleAddProof = () => {
        if (proofs.length >= 10) return;

        const newProof = {
            id: Date.now(),
            tag: currentTag || 'WORKOUT',
            timestamp: new Date().toISOString(),
            type: 'PHOTO_STUB'
        };

        setProofs([...proofs, newProof]);
        setCurrentTag('');
    };

    const handleEndSession = async () => {
        if (proofs.length === 0) {
            alert("INSTITUTIONAL ERROR: VISUAL RECORD REQUIRED.");
            return;
        }

        const payload = {
            endedAt: new Date().toISOString(),
            duration: elapsed,
            evidence: proofs,
            venue: venue
        };

        // Terminate Session -> Routes to LEDGER_CLOSURE
        await declare('SESSION_ENDED', payload);
    };

    return (
        <div style={{
            minHeight: '100vh',
            background: 'var(--iron-bg-primary)',
            display: 'flex',
            flexDirection: 'column'
        }}>
            {/* AUTHORITY HEADER with Live Timer */}
            <div style={{
                borderBottom: '1px solid var(--iron-border)',
                paddingBottom: 'var(--iron-space-md)',
                background: 'var(--iron-surface)'
            }}>
                <div style={{ transform: 'scale(0.8)', transformOrigin: 'top center', marginBottom: '-20px' }}>
                    <StandingBanner standing={institutionalState.standing} era={institutionalState.currentEra} />
                </div>

                <div style={{ textAlign: 'center', marginTop: 'var(--iron-space-md)' }}>
                    <div className="text-sm-caps" style={{ color: 'var(--iron-accent)', opacity: 0.8 }}>SESSION ACTIVE</div>
                    <div className="font-numeric" style={{ fontSize: '2.5rem', letterSpacing: '2px' }}>
                        {elapsed}
                    </div>
                    <div className="text-sm-caps" style={{ opacity: 0.5 }}>AT {venue}</div>
                </div>
            </div>

            {/* ACTIVE WORKSPACE */}
            <div style={{
                flex: 1,
                padding: 'var(--iron-space-lg)',
                maxWidth: '600px',
                margin: '0 auto',
                width: '100%',
                display: 'flex',
                flexDirection: 'column'
            }}>

                {/* PROOF FEED */}
                <div style={{ flex: 1, overflowY: 'auto', marginBottom: 'var(--iron-space-lg)' }}>
                    <div className="text-sm-caps" style={{ marginBottom: 'var(--iron-space-md)', opacity: 0.7 }}>
                        EVIDENCE LOG ({proofs.length}/10)
                    </div>

                    {proofs.length === 0 && (
                        <div style={{
                            padding: 'var(--iron-space-lg)',
                            border: '1px dashed var(--iron-border)',
                            textAlign: 'center',
                            opacity: 0.5
                        }}>
                            NO EVIDENCE RECORDED
                        </div>
                    )}

                    {proofs.map((proof, idx) => (
                        <div key={proof.id} style={{
                            display: 'flex',
                            alignItems: 'center',
                            background: 'var(--iron-surface)',
                            padding: 'var(--iron-space-md)',
                            marginBottom: '8px',
                            borderLeft: '2px solid var(--iron-accent)'
                        }}>
                            <div className="font-numeric" style={{ marginRight: '12px', opacity: 0.5 }}>
                                {idx + 1 < 10 ? `0${idx + 1}` : idx + 1}
                            </div>
                            <div>
                                <div className="text-sm-caps">{proof.tag}</div>
                                <div style={{ fontSize: '0.7rem', opacity: 0.5 }}>{proof.timestamp.split('T')[1].split('.')[0]}</div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* ADD PROOF CONTROLS */}
                <div style={{
                    background: 'var(--iron-surface)',
                    padding: 'var(--iron-space-md)',
                    border: '1px solid var(--iron-border)',
                    marginBottom: 'var(--iron-space-xl)'
                }}>
                    <input
                        type="text"
                        value={currentTag}
                        onChange={(e) => setCurrentTag(e.target.value)}
                        placeholder="TAG (e.g. SQUAT, CARDIO)"
                        style={{
                            width: '100%',
                            background: 'transparent',
                            border: 'none',
                            borderBottom: '1px solid var(--iron-border)',
                            color: 'var(--iron-text-primary)',
                            padding: '8px 0',
                            fontFamily: 'var(--font-mono)',
                            marginBottom: '12px',
                            textTransform: 'uppercase'
                        }}
                    />

                    <button
                        onClick={handleAddProof}
                        disabled={proofs.length >= 10}
                        style={{
                            width: '100%',
                            padding: '12px',
                            background: 'var(--iron-bg-primary)',
                            border: '1px dashed var(--iron-accent)',
                            color: 'var(--iron-accent)',
                            fontFamily: 'var(--font-primary)',
                            letterSpacing: '1px',
                            cursor: 'pointer'
                        }}
                    >
                        + CAPTURE VISUAL
                    </button>
                </div>

                {/* TERMINATE */}
                <ComplianceControl
                    label="TERMINATE SESSION"
                    onComplete={handleEndSession}
                    variant={proofs.length > 0 ? "standard" : "disabled"}
                    disabled={proofs.length === 0}
                />

            </div>
        </div>
    );
};
