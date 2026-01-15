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
    const [tags, setTags] = useState([]);
    const [currentTag, setCurrentTag] = useState('');

    // Staging state for new evidence (Active Phase)
    const [stagingPhoto, setStagingPhoto] = useState(null);
    const [stagingDesc, setStagingDesc] = useState('');

    const commitStaging = () => {
        if (!stagingPhoto) return;
        const newRecord = {
            id: Date.now(),
            photo: stagingPhoto,
            description: stagingDesc || "NO DESCRIPTION",
            timestamp: new Date().toISOString()
        };
        setAdditionalEvidence([...additionalEvidence, newRecord]);
        setStagingPhoto(null);
        setStagingDesc('');
    };

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
        if (!outtakePhoto || tags.length === 0) {
            alert("PROTOCOL VIOLATION: VISUAL CHECK-OUT AND TAGS REQUIRED.");
            return;
        }
        await declare('SESSION_ENDED', {
            tags: tags,
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
                    HOC EVIDENCE (OPTIONAL - MAX 3)
                </div>

                {/* List of Captured Evidence */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
                    {additionalEvidence.map(record => (
                        <div key={record.id} style={{
                            background: 'var(--iron-surface-2)',
                            padding: '8px',
                            border: '1px solid var(--iron-border)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px'
                        }}>
                            <div style={{ width: '40px', height: '40px', background: '#333', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.6rem' }}>IMG</div>
                            <div style={{ flex: 1 }}>
                                <div style={{ fontSize: '0.8rem', fontFamily: 'var(--font-mono)' }}>{record.description}</div>
                                <div style={{ fontSize: '0.6rem', opacity: 0.5 }}>{new Date(record.timestamp).toLocaleTimeString()}</div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Add New Evidence Form */}
                {additionalEvidence.length < 3 && (
                    <div style={{ border: '1px dashed var(--iron-border)', padding: '12px' }}>
                        {!stagingPhoto ? (
                            <CameraButton
                                label="ADD ACTION SHOT"
                                onCapture={setStagingPhoto}
                                value={null}
                            />
                        ) : (
                            <div style={{ display: 'flex', gap: '8px', flexDirection: 'column' }}>
                                <div style={{ fontSize: '0.8rem', color: 'var(--iron-brand-stable)' }}>IMAGE CAPTURED</div>
                                <input
                                    type="text"
                                    placeholder="DESCRIPTION (e.g. SET 3 WEIGHT)"
                                    value={stagingDesc}
                                    onChange={e => setStagingDesc(e.target.value)}
                                    style={{
                                        width: '100%',
                                        background: 'transparent',
                                        border: '1px solid var(--iron-border)',
                                        padding: '8px',
                                        color: 'var(--iron-text-primary)',
                                        fontFamily: 'var(--font-primary)'
                                    }}
                                />
                                <div style={{ display: 'flex', gap: '8px' }}>
                                    <button onClick={commitStaging} style={{ flex: 1, padding: '8px', background: 'var(--iron-brand-stable)', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-authority)', fontSize: '0.8rem' }}>CONFIRM</button>
                                    <button onClick={() => { setStagingPhoto(null); setStagingDesc(''); }} style={{ flex: 1, padding: '8px', background: 'transparent', border: '1px solid var(--iron-border)', color: '#fff', cursor: 'pointer', fontFamily: 'var(--font-authority)', fontSize: '0.8rem' }}>CANCEL</button>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>

            <ComplianceControl
                label="TERMINATE SESSION"
                variant="standard"
                onComplete={handleTerminate}
            />
        </div>
    );

    const handleAddTag = () => {
        if (!currentTag.trim()) return;
        if (!tags.includes(currentTag.trim().toUpperCase())) {
            setTags([...tags, currentTag.trim().toUpperCase()]);
        }
        setCurrentTag('');
    };

    const handleRemoveTag = (tagToRemove) => {
        setTags(tags.filter(t => t !== tagToRemove));
    };

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

            {/* Keyword Input Area */}
            <div style={{ marginBottom: 'var(--iron-space-lg)' }}>
                <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                    <input
                        type="text"
                        placeholder="ADD TAG (e.g. LEGS)"
                        value={currentTag}
                        onChange={e => setCurrentTag(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && handleAddTag()}
                        style={{
                            flex: 1,
                            background: 'transparent',
                            border: 'none',
                            borderBottom: '1px solid var(--iron-border)',
                            padding: '8px 0',
                            color: 'var(--iron-text-primary)',
                            fontFamily: 'var(--font-primary)',
                            textTransform: 'uppercase'
                        }}
                    />
                    <button
                        onClick={handleAddTag}
                        style={{
                            background: 'var(--iron-surface-2)',
                            border: '1px solid var(--iron-border)',
                            color: 'var(--iron-text-primary)',
                            padding: '0 16px',
                            cursor: 'pointer',
                            fontFamily: 'var(--font-mono)'
                        }}
                    >
                        +
                    </button>
                </div>

                {/* Chips Container */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {tags.map(tag => (
                        <div key={tag} style={{
                            background: 'rgba(255,255,255,0.1)',
                            border: '1px solid var(--iron-border)',
                            padding: '4px 8px',
                            fontSize: '0.7rem',
                            fontFamily: 'var(--font-mono)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px'
                        }}>
                            {tag}
                            <span
                                onClick={() => handleRemoveTag(tag)}
                                style={{ cursor: 'pointer', opacity: 0.5, fontWeight: 'bold' }}
                            >
                                x
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            <ComplianceControl
                label="SUBMIT RECORDS"
                variant={outtakePhoto && tags.length > 0 ? 'standard' : 'disabled'}
                disabled={!outtakePhoto || tags.length === 0}
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
