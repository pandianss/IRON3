import React, { useState, useEffect } from 'react';
import { useGovernance } from '../../context/GovernanceContext';
import '../../ui/styles/InstitutionalTheme.css';
import { StandingBanner } from '../../ui/components/authority/StandingBanner';
import { ComplianceControl } from '../../ui/components/obligation/ComplianceControl';
import { SovereignWindowKernel } from '../kernel/SovereignWindowKernel';
import { WINDOW_STATES } from '../kernel/SovereignWindow.schema';

/**
 * SOVEREIGN EVIDENCE CAPTURE
 * Role: The lived experience of the sovereign protocol.
 */
export const SovereignEvidence = ({ startTime, venue: initialVenue }) => {
    const { institutionalState, declare } = useGovernance();
    const sessionStatus = institutionalState.session.status; // 'PENDING' | 'ACTIVE'

    // --- SOVEREIGN WINDOW STATE MACHINE ---
    const [window, setWindow] = useState(
        sessionStatus === 'ACTIVE'
            ? { ...SovereignWindowKernel.createSovereignWindow(), state: WINDOW_STATES.ACTIVE, openedAt: new Date(startTime).getTime() }
            : SovereignWindowKernel.createSovereignWindow()
    );

    // --- RITUAL SUB-PHASES ---
    const [intakeStep, setIntakeStep] = useState('ORIENTATION'); // ORIENTATION | INITIAL_EVIDENCE | DECLARATION
    const [outtakeStep, setOuttakeStep] = useState('CAPTURE'); // CAPTURE | VERDICT

    // Declaration State
    const [protocolType, setProtocolType] = useState('EXECUTION');
    const [systemState, setSystemState] = useState('STABLE');
    const [intent, setIntent] = useState('');

    // Intake State
    const [venue, setVenue] = useState(initialVenue || '');
    const [initialEvidence, setInitialEvidence] = useState(null);

    // Active State
    const [elapsed, setElapsed] = useState("00:00:00");
    const [additionalEvidence, setAdditionalEvidence] = useState([]);

    // Outtake State
    const [terminalEvidence, setTerminalEvidence] = useState(null);
    const [notes, setNotes] = useState('');

    // Staging state for new evidence
    const [stagingPhoto, setStagingPhoto] = useState(null);
    const [stagingDesc, setStagingDesc] = useState('');

    const commitStaging = () => {
        if (!stagingPhoto) return;
        const newRecord = {
            id: Date.now(),
            photo: stagingPhoto,
            description: stagingDesc || "NO METADATA",
            timestamp: new Date().toISOString()
        };
        setAdditionalEvidence([...additionalEvidence, newRecord]);
        setStagingPhoto(null);
        setStagingDesc('');
    };

    // 1. Sync State Machine with External Session Status
    useEffect(() => {
        if (sessionStatus === 'ACTIVE' && window.state === WINDOW_STATES.IDLE) {
            setWindow(prev => SovereignWindowKernel.transition(prev, WINDOW_STATES.PRIMED));
            setWindow(prev => SovereignWindowKernel.transition(prev, WINDOW_STATES.OPEN));
        }
    }, [sessionStatus]);

    // 2. Visibility / Interruption Detection
    useEffect(() => {
        const handleVisibility = () => {
            if (document.hidden) {
                if (window.state === WINDOW_STATES.ACTIVE) {
                    setWindow(prev => SovereignWindowKernel.transition(prev, WINDOW_STATES.INTERRUPTED));
                }
            } else {
                if (window.state === WINDOW_STATES.INTERRUPTED) {
                    setWindow(prev => SovereignWindowKernel.transition(prev, WINDOW_STATES.ACTIVE));
                }
            }
        };

        document.addEventListener("visibilitychange", handleVisibility);
        return () => document.removeEventListener("visibilitychange", handleVisibility);
    }, [window.state]);

    // 3. Timer Logic
    useEffect(() => {
        if (window.state !== WINDOW_STATES.ACTIVE || !window.openedAt) return;
        const start = window.openedAt;

        const interval = setInterval(() => {
            const now = Date.now();
            const diff = now - start - (window.interruptionTimeMs || 0);

            const hours = Math.floor(diff / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);

            setElapsed(
                `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
            );
        }, 1000);

        return () => clearInterval(interval);
    }, [window.state, window.openedAt, window.interruptionTimeMs]);

    // --- ACTIONS ---

    const handleInitiate = async () => {
        if (!venue || !initialEvidence) {
            alert("PROTOCOL VIOLATION: VENUE AND INITIAL EVIDENCE REQUIRED.");
            return;
        }

        const primed = SovereignWindowKernel.transition(window, WINDOW_STATES.PRIMED);
        const opened = SovereignWindowKernel.transition(primed, WINDOW_STATES.OPEN);
        setWindow(opened);

        await declare('SESSION_STARTED', {
            venue,
            evidence: initialEvidence,
            windowId: opened.id,
            timestamp: new Date().toISOString()
        });
    };

    const handleTerminate = () => {
        if (window.state === WINDOW_STATES.ACTIVE || window.state === WINDOW_STATES.INTERRUPTED) {
            setWindow(prev => SovereignWindowKernel.transition(prev, WINDOW_STATES.CLOSED_VALID));
        }
    };

    const handleAcknowledgeVerdict = async () => {
        const validity = SovereignWindowKernel.computeValidity(window);
        const sealed = SovereignWindowKernel.transition(window, WINDOW_STATES.SEALED);
        setWindow(sealed);

        await declare('SESSION_ENDED', {
            notes: notes,
            evidence: terminalEvidence,
            additionalEvidence,
            intent,
            protocolType,
            systemState,
            window: {
                id: window.id,
                validity,
                history: sealed.history
            },
            endedAt: new Date().toISOString()
        });
    };

    const handleSubmit = async () => {
        if (!terminalEvidence || !notes) {
            alert("PROTOCOL VIOLATION: TERMINAL EVIDENCE AND NOTES REQUIRED.");
            return;
        }

        const validity = SovereignWindowKernel.computeValidity(window);
        const sealed = SovereignWindowKernel.transition(window, WINDOW_STATES.SEALED);
        setWindow(sealed);

        await declare('SESSION_ENDED', {
            notes: notes,
            evidence: terminalEvidence,
            additionalEvidence,
            intent,
            protocolType,
            systemState,
            window: {
                id: window.id,
                validity,
                history: sealed.history
            },
            endedAt: new Date().toISOString()
        });
    };

    // --- MOCK CAMERA INPUT ---
    const CameraButton = ({ onCapture, label, value }) => (
        <button
            onClick={() => onCapture({ id: Date.now(), type: 'EVIDENCE_STUB' })}
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
            {value ? `EVIDENCE SECURED` : `+ ${label}`}
        </button>
    );

    // --- RENDERERS ---

    const renderOrientation = () => (
        <div style={styles.ritualContainer}>
            <div style={styles.phaseNotice}>RITUAL ACT I: ORIENTATION</div>
            <h2 style={styles.ritualTitle}>SITUATE SOVEREIGNTY</h2>

            <div style={styles.orientationBox}>
                <div style={styles.statusRow}>
                    <span style={styles.statusLabel}>SPINE STATUS</span>
                    <span style={{ color: 'var(--iron-brand-stable)' }}>STABLE</span>
                </div>
                <div style={styles.statusRow}>
                    <span style={styles.statusLabel}>STANDING</span>
                    <span>{institutionalState.standing.integrity.status}</span>
                </div>
                <div style={styles.statusRow}>
                    <span style={styles.statusLabel}>CONTINUITY</span>
                    <span>{institutionalState.standing.continuity.label}</span>
                </div>
            </div>

            <p style={styles.ritualInstruction}>
                "The observer must be situated within the sovereign timeline before action occurs."
            </p>

            <ComplianceControl
                label="BEGIN PROTOCOL EXECUTION"
                variant="standard"
                onComplete={() => setIntakeStep('INITIAL_EVIDENCE')}
            />
        </div>
    );

    const renderInitialCapture = () => (
        <div style={styles.ritualContainer}>
            <div style={styles.phaseNotice}>RITUAL ACT II: PRE-STATE</div>
            <h2 style={styles.ritualTitle}>ANCHOR REALITY</h2>

            <div style={{ marginBottom: '24px' }}>
                <CameraButton
                    label="CAPTURE INITIAL EVIDENCE"
                    onCapture={setInitialEvidence}
                    value={initialEvidence}
                />
            </div>

            <p style={styles.ritualInstruction}>
                "This records the state as it stands before intervention."
            </p>

            <ComplianceControl
                label="SEAL PRE-STATE"
                variant={initialEvidence ? 'standard' : 'disabled'}
                disabled={!initialEvidence}
                onComplete={() => setIntakeStep('DECLARATION')}
            />
        </div>
    );

    const renderDeclaration = () => (
        <div style={styles.ritualContainer}>
            <div style={styles.phaseNotice}>RITUAL ACT III: COGNITIVE BINDING</div>
            <h2 style={styles.ritualTitle}>DECLARE INTENT</h2>

            <div style={styles.formSection}>
                <label style={styles.inputLabel}>PROTOCOL TYPE</label>
                <select
                    value={protocolType}
                    onChange={e => setProtocolType(e.target.value)}
                    style={styles.select}
                >
                    <option value="EXECUTION">EXECUTION</option>
                    <option value="CALIBRATION">CALIBRATION</option>
                    <option value="MAINTENANCE">MAINTENANCE</option>
                    <option value="AUDIT">AUDIT</option>
                    <option value="RECOVERY">RECOVERY</option>
                </select>
            </div>

            <div style={styles.formSection}>
                <label style={styles.inputLabel}>SYSTEM STATE</label>
                <select
                    value={systemState}
                    onChange={e => setSystemState(e.target.value)}
                    style={styles.select}
                >
                    <option value="STABLE">STABLE</option>
                    <option value="DEGRADED">DEGRADED</option>
                    <option value="FRICTIONAL">FRICTIONAL</option>
                    <option value="VOLATILE">VOLATILE</option>
                    <option value="COMPROMISED">COMPROMISED</option>
                </select>
            </div>

            <div style={styles.formSection}>
                <label style={styles.inputLabel}>SOVEREIGN INTENT</label>
                <textarea
                    placeholder="E.G. Today this subsystem will be subjected to controlled calibration..."
                    value={intent}
                    onChange={e => setIntent(e.target.value)}
                    style={styles.textarea}
                />
            </div>

            <ComplianceControl
                label="INITIATE PROTOCOL"
                variant={intent.length > 10 ? 'standard' : 'disabled'}
                disabled={intent.length <= 10}
                onComplete={handleInitiate}
            />
        </div>
    );

    const renderIntake = () => {
        if (intakeStep === 'ORIENTATION') return renderOrientation();
        if (intakeStep === 'INITIAL_EVIDENCE') return renderInitialCapture();
        if (intakeStep === 'DECLARATION') return renderDeclaration();
        return null;
    };

    const renderActive = () => (
        <div style={{ textAlign: 'center' }}>
            <div className="text-sm-caps" style={{ color: window.state === WINDOW_STATES.INTERRUPTED ? 'var(--iron-brand-breach)' : 'var(--iron-accent)', opacity: 0.8, marginBottom: 'var(--iron-space-md)' }}>
                {window.state === WINDOW_STATES.INTERRUPTED ? 'CONTINUITY INTERRUPTED' : 'PROTOCOL ACTIVE'}
            </div>

            <div className="font-numeric num-large" style={{ marginBottom: 'var(--iron-space-md)', color: window.state === WINDOW_STATES.INTERRUPTED ? 'var(--iron-brand-breach)' : 'inherit' }}>
                {elapsed}
            </div>

            {window.state === WINDOW_STATES.INTERRUPTED && (
                <div style={{ background: 'rgba(255, 0, 0, 0.1)', border: '1px solid var(--iron-brand-breach)', padding: '10px', marginBottom: '20px', color: 'var(--iron-brand-breach)', fontSize: '0.8rem' }}>
                    WARNING: Spine continuity disrupted. Return to focus immediately.
                </div>
            )}

            <div className="text-sm-caps" style={{ opacity: 0.5, marginBottom: 'var(--iron-space-xl)' }}>
                LOC: {venue || initialVenue} • INTERRUPTIONS: {window.interruptionCount}
            </div>

            <div style={{ marginBottom: 'var(--iron-space-xl)', textAlign: 'left' }}>
                <div className="text-sm-caps" style={{ marginBottom: 'var(--iron-space-sm)', opacity: 0.7 }}>
                    ADDITIONAL EVIDENCE (MAX 3)
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
                            <div style={{ width: '40px', height: '40px', background: '#333', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.6rem' }}>DATA</div>
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
                                label="ADD ACTION EVIDENCE"
                                onCapture={setStagingPhoto}
                                value={null}
                            />
                        ) : (
                            <div style={{ display: 'flex', gap: '8px', flexDirection: 'column' }}>
                                <div style={{ fontSize: '0.8rem', color: 'var(--iron-brand-stable)' }}>DATA CAPTURED</div>
                                <input
                                    type="text"
                                    placeholder="METADATA (e.g. COMPONENT_X RECALIBRATED)"
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
                label="TERMINATE PROTOCOL"
                variant="standard"
                onComplete={handleTerminate}
            />

            <div style={{ marginTop: '20px', padding: '16px', border: '1px border var(--iron-border)', opacity: 0.5, fontSize: '0.7rem' }}>
                INTENT: {intent}
            </div>
        </div>
    );

    // --- ACT V: VERDICT ---
    const renderVerdict = () => {
        const validity = SovereignWindowKernel.computeValidity(window);

        return (
            <div style={styles.ritualContainer}>
                <div style={styles.phaseNotice}>RITUAL ACT V: VERDICT</div>
                <h2 style={styles.ritualTitle}>SOVEREIGN FEEDBACK</h2>

                <div style={styles.verdictBox}>
                    <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
                        <div style={styles.photoStub}>PRE</div>
                        <div style={styles.photoStub}>POST</div>
                    </div>

                    <div style={styles.verdictRow}>
                        <span style={styles.statusLabel}>RECOGNITION</span>
                        <span>DECLARED PROTOCOL COMPLETED</span>
                    </div>
                    <div style={styles.verdictRow}>
                        <span style={styles.statusLabel}>INTERPRETATION</span>
                        <span>CONTINUITY PRESERVED. {validity.status.toUpperCase()}.</span>
                    </div>
                    <div style={styles.verdictRow}>
                        <span style={styles.statusLabel}>STANDING</span>
                        <span style={{ color: validity.valid ? 'var(--iron-brand-stable)' : 'var(--iron-brand-breach)' }}>
                            {validity.valid ? 'INTEGRITY REINFORCED' : 'RISK ELEVATED'}
                        </span>
                    </div>
                </div>

                <p style={styles.ritualInstruction}>
                    "Action concluded. Sovereignty remains."
                </p>

                <ComplianceControl
                    label="ACKNOWLEDGE & SEAL"
                    variant="standard"
                    onComplete={handleAcknowledgeVerdict}
                />
            </div>
        );
    };

    const renderOuttake = () => {
        if (outtakeStep === 'CAPTURE') {
            return (
                <div className="surface-obligation">
                    <div className="text-sm-caps" style={{ marginBottom: 'var(--iron-space-md)', color: window.state === WINDOW_STATES.CLOSED_INVALID ? 'var(--iron-brand-breach)' : 'var(--iron-brand-stable)' }}>
                        {window.state === WINDOW_STATES.CLOSED_INVALID ? 'PROTOCOL INVALIDATED' : 'PHASE 3: PROTOCOL CLOSURE'}
                    </div>

                    <div style={{ marginBottom: '20px', padding: '15px', background: 'var(--iron-surface-2)', border: '1px solid var(--iron-border)' }}>
                        <div style={{ fontSize: '0.7rem', opacity: 0.5, marginBottom: '5px' }}>DURATION RECORDED</div>
                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.2rem' }}>{(window.elapsedMs / 1000 / 60).toFixed(1)} MINUTES</div>
                        {window.state === WINDOW_STATES.CLOSED_INVALID && (
                            <div style={{ color: 'var(--iron-brand-breach)', fontSize: '0.7rem', marginTop: '10px' }}>
                                CRITICAL: Temporal integrity failed. Standing impact pending.
                            </div>
                        )}
                    </div>

                    <CameraButton
                        label="CAPTURE TERMINAL EVIDENCE"
                        onCapture={setTerminalEvidence}
                        value={terminalEvidence}
                    />

                    <div style={{ marginBottom: 'var(--iron-space-lg)' }}>
                        <input
                            type="text"
                            placeholder="FINAL OBSERVATIONS"
                            value={notes}
                            onChange={e => setNotes(e.target.value)}
                            style={{ width: '100%', background: 'transparent', border: 'none', borderBottom: '1px solid var(--iron-border)', padding: '8px 0', color: 'var(--iron-text-primary)' }}
                        />
                    </div>

                    <ComplianceControl
                        label="GENERATE VERDICT"
                        variant={terminalEvidence ? 'standard' : 'disabled'}
                        disabled={!terminalEvidence}
                        onComplete={() => setOuttakeStep('VERDICT')}
                    />
                </div>
            );
        }
        return renderVerdict();
    };

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
                {window.state === WINDOW_STATES.IDLE && renderIntake()}
                {(window.state === WINDOW_STATES.ACTIVE || window.state === WINDOW_STATES.INTERRUPTED) && renderActive()}
                {(window.state === WINDOW_STATES.CLOSED_VALID || window.state === WINDOW_STATES.CLOSED_INVALID) && renderOuttake()}
                {window.state === WINDOW_STATES.SEALED && (
                    <div style={{ textAlign: 'center', padding: '40px' }}>
                        <h2 style={{ color: 'var(--iron-brand-stable)' }}>SESSION SEALED</h2>
                        <p style={{ opacity: 0.6 }}>Data committed to sovereign archive.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

const styles = {
    ritualContainer: {
        display: 'flex',
        flexDirection: 'column',
        gap: '24px'
    },
    phaseNotice: {
        fontSize: '0.65rem',
        color: 'var(--iron-accent)',
        letterSpacing: '2px',
        opacity: 0.7,
        fontFamily: 'var(--font-mono)'
    },
    ritualTitle: {
        fontFamily: 'var(--font-authority)',
        fontSize: '1.4rem',
        textTransform: 'uppercase',
        marginBottom: '8px'
    },
    orientationBox: {
        background: 'var(--iron-surface-2)',
        border: '1px solid var(--iron-border)',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px'
    },
    statusRow: {
        display: 'flex',
        justifyContent: 'space-between',
        fontSize: '0.85rem'
    },
    statusLabel: {
        opacity: 0.5,
        fontSize: '0.7rem',
        fontFamily: 'var(--font-mono)'
    },
    ritualInstruction: {
        fontSize: '0.9rem',
        fontStyle: 'italic',
        opacity: 0.6,
        lineHeight: '1.4',
        marginBottom: '20px'
    },
    formSection: {
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        marginBottom: '16px'
    },
    inputLabel: {
        fontSize: '0.7rem',
        opacity: 0.5,
        fontFamily: 'var(--font-mono)',
        textTransform: 'uppercase'
    },
    select: {
        background: 'var(--iron-surface-2)',
        border: '1px solid var(--iron-border)',
        color: 'var(--iron-text-primary)',
        padding: '12px',
        fontFamily: 'var(--font-primary)',
        fontSize: '0.9rem'
    },
    textarea: {
        background: 'var(--iron-surface-2)',
        border: '1px solid var(--iron-border)',
        color: 'var(--iron-text-primary)',
        padding: '12px',
        fontFamily: 'var(--font-primary)',
        fontSize: '0.9rem',
        minHeight: '80px',
        resize: 'none'
    },
    verdictBox: {
        background: 'var(--iron-surface-2)',
        border: '1px solid var(--iron-border)',
        padding: '24px'
    },
    verdictRow: {
        display: 'flex',
        flexDirection: 'column',
        gap: '4px',
        marginBottom: '16px'
    },
    photoStub: {
        flex: 1,
        height: '100px',
        background: '#111',
        border: '1px solid #333',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '0.6rem',
        color: '#444'
    }
};

EvidenceCapture.contract = {
    supportedPhases: ['initiated', 'bound', 'active', 'degrading', 'recovering', 'sovereign'],
    authorityRange: [1, 5]
};
