import React, { useState, useEffect } from 'react';
import { useGovernance } from '../../context/GovernanceContext';
import '../../ui/styles/InstitutionalTheme.css';
import { StandingBanner } from '../../ui/components/authority/StandingBanner';
import { ComplianceControl } from '../../ui/components/obligation/ComplianceControl';

/**
 * Phase 2.5: Evidence Capture (Active Session Mode)
 * Role: The lived experience of the protocol.
 * Phases: INTAKE -> ACTIVE -> OUTTAKE
 */
export const EvidenceCapture = ({ startTime, venue: initialVenue }) => {
    const { institutionalState, declare } = useGovernance();
    const sessionStatus = institutionalState.session.status; // 'PENDING' | 'ACTIVE'

    // Internal UI State
    const [mode, setMode] = useState(sessionStatus === 'ACTIVE' ? 'ACTIVE' : 'INTAKE');

    // Intake State
    const [venue, setVenue] = useState(initialVenue || '');
    const [intakePhoto, setIntakePhoto] = useState(null);

    // Active State
    const [elapsed, setElapsed] = useState("00:00:00");
    const [additionalEvidence, setAdditionalEvidence] = useState([]);

    // Outtake State
    const [outtakePhoto, setOuttakePhoto] = useState(null);
    const [tags, setTags] = useState('');

    // Sync Mode with Backend Status
    useEffect(() => {
        if (sessionStatus === 'ACTIVE' && mode === 'INTAKE') {
            setMode('ACTIVE');
        }
    }, [sessionStatus]);

    // Timer Logic
    useEffect(() => {
        if (mode !== 'ACTIVE' || !startTime) return;
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
    }, [startTime, mode]);

    // --- ACTIONS ---

    const handleInitiate = async () => {
        if (!venue || !intakePhoto) {
            alert("PROTOCOL VIOLATION: VENUE AND VISUAL CHECK-IN REQUIRED.");
            return;
        }
        await declare('SESSION_STARTED', {
            venue,
            evidence: intakePhoto,
            timestamp: new Date().toISOString()
        });
    };

    const handleTerminate = () => {
        setMode('OUTTAKE');
    };

    const handleSubmit = async () => {
        if (!outtakePhoto || !tags) {
            alert("PROTOCOL VIOLATION: VISUAL CHECK-OUT AND TAGS REQUIRED.");
            return;
        }
        await declare('SESSION_ENDED', {
            tags: tags.split(',').map(t => t.trim()),
            evidence: outtakePhoto,
            additionalEvidence,
            endedAt: new Date().toISOString()
        });
    };

    // --- MOCK CAMERA INPUT ---
    const CameraButton = ({ onCapture, label, value }) => (
        <button
            onClick={() => onCapture({ id: Date.now(), type: 'PHOTO_STUB' })}
            style={{
                width: '100%',
                padding: 'var(--iron-space-lg)',
                background: value ? 'var(--iron-brand-stable-dim)' : 'var(--iron-surface)',
                border: `1px dashed ${value ? 'var(--iron-brand-stable)' : 'var(--iron-border)'}`,
                color: value ? 'var(--iron-brand-stable)' : 'var(--iron-text-secondary)',
                marginBottom: 'var(--iron-space-md)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                textTransform: 'uppercase',
                fontFamily: 'var(--font-authority)',
                fontSize: '0.8rem'
            }}
        >
            {value ? `VISUAL SECURED` : `+ ${label}`}
        </button>
    );

    // --- RENDERERS ---

    const renderIntake = () => (
        <div className="surface-obligation">
            <div className="text-sm-caps" style={{ marginBottom: 'var(--iron-space-md)', color: 'var(--iron-brand-stable)' }}>
                PHASE 1: PROTOCOL INITIATION
            </div>

            <input
                type="text"
                placeholder="DECLARE VENUE (e.g. HOME GYM)"
                value={venue}
                onChange={e => setVenue(e.target.value)}
                style={{
                    width: '100%',
                    background: 'transparent',
                    border: 'none',
                    borderBottom: '1px solid var(--iron-border)',
                    padding: '8px 0',
                    color: 'var(--iron-text-primary)',
                    fontFamily: 'var(--font-primary)',
                    marginBottom: 'var(--iron-space-lg)',
                    textTransform: 'uppercase'
                }}
            />

            <CameraButton
                label="CAPTURE CHECK-IN SELFIE"
                onCapture={setIntakePhoto}
                value={intakePhoto}
            />

            <ComplianceControl
                label="INITIATE PROTOCOL"
                variant={intakePhoto && venue ? 'standard' : 'disabled'}
                disabled={!intakePhoto || !venue}
                onComplete={handleInitiate}
            />
        </div>
    );

    const renderActive = () => (
        <div style={{ textAlign: 'center' }}>
            <div className="text-sm-caps" style={{ color: 'var(--iron-accent)', opacity: 0.8, marginBottom: 'var(--iron-space-md)' }}>
                SESSION ACTIVE
            </div>

            <div className="font-numeric num-large" style={{ marginBottom: 'var(--iron-space-md)' }}>
                {elapsed}
            </div>

            <div className="text-sm-caps" style={{ opacity: 0.5, marginBottom: 'var(--iron-space-xl)' }}>
                LOC: {venue || initialVenue}
            </div>

            <div style={{ marginBottom: 'var(--iron-space-xl)', textAlign: 'left' }}>
                <div className="text-sm-caps" style={{ marginBottom: 'var(--iron-space-sm)', opacity: 0.7 }}>
                    HOC EVIDENCE (OPTIONAL)
                </div>
                {/* Quick add photo button */}
                <CameraButton
                    label="ADD ACTION SHOT"
                    onCapture={(p) => setAdditionalEvidence([...additionalEvidence, p])}
                    value={null}
                />
                <div style={{ fontSize: '0.7rem', opacity: 0.5 }}>{additionalEvidence.length} RECORDS SECURED</div>
            </div>

            <ComplianceControl
                label="TERMINATE SESSION"
                variant="standard"
                onComplete={handleTerminate}
            />
        </div>
    );

    const renderOuttake = () => (
        <div className="surface-obligation">
            <div className="text-sm-caps" style={{ marginBottom: 'var(--iron-space-md)', color: 'var(--iron-brand-breach)' }}>
                PHASE 3: PROTOCOL CLOSURE
            </div>

            <CameraButton
                label="CAPTURE CHECK-OUT SELFIE"
                onCapture={setOuttakePhoto}
                value={outtakePhoto}
            />

            <input
                type="text"
                placeholder="TAGS (e.g. LEGS, HEAVY)"
                value={tags}
                onChange={e => setTags(e.target.value)}
                style={{
                    width: '100%',
                    background: 'transparent',
                    border: 'none',
                    borderBottom: '1px solid var(--iron-border)',
                    padding: '8px 0',
                    color: 'var(--iron-text-primary)',
                    fontFamily: 'var(--font-primary)',
                    marginBottom: 'var(--iron-space-lg)',
                    textTransform: 'uppercase'
                }}
            />

            <ComplianceControl
                label="SUBMIT RECORDS"
                variant={outtakePhoto && tags ? 'standard' : 'disabled'}
                disabled={!outtakePhoto || !tags}
                onComplete={handleSubmit}
            />
        </div>
    );

    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <StandingBanner standing={institutionalState.standing} era={institutionalState.currentEra} />

            <div style={{
                flex: 1,
                padding: 'var(--iron-space-lg)',
                maxWidth: '600px',
                margin: '0 auto',
                width: '100%'
            }}>
                {mode === 'INTAKE' && renderIntake()}
                {mode === 'ACTIVE' && renderActive()}
                {mode === 'OUTTAKE' && renderOuttake()}
            </div>
        </div>
    );
};
