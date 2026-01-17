import React, { useState } from 'react';
import { submitEvent } from '@/interfaces';

// IVC-01 Styles
const surfaceStyle = {
    background: 'var(--iron-infra-void)',
    color: 'var(--iron-text-primary)',
    fontFamily: 'var(--font-institutional)',
    padding: '40px',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    maxWidth: '600px',
    margin: '0 auto'
};

const stepTitleStyle = {
    fontFamily: 'var(--font-constitutional)',
    fontSize: '1.5rem',
    color: 'var(--iron-signal-active)',
    marginBottom: '20px',
    borderBottom: '1px solid var(--iron-structure-border)',
    paddingBottom: '10px'
};

const inputStyle = {
    width: '100%',
    padding: '12px',
    background: 'var(--iron-infra-panel)',
    border: '1px solid var(--iron-structure-border)',
    color: 'var(--iron-text-primary)',
    fontFamily: 'var(--font-systemic)',
    marginBottom: '20px',
    marginTop: '10px'
};

const btnStyle = {
    background: 'var(--iron-signal-active)',
    color: '#000',
    border: 'none',
    padding: '12px 24px',
    fontSize: '1rem',
    fontFamily: 'var(--font-systemic)',
    fontWeight: 'bold',
    cursor: 'pointer',
    marginTop: '30px'
};

export const ActiveProtocolSurface = ({ protocol, onClose }) => {
    const [stepIndex, setStepIndex] = useState(0);
    const [evidence, setEvidence] = useState({});
    const [status, setStatus] = useState('IDLE'); // IDLE, MINING, COMPLETED
    const [verdict, setVerdict] = useState(null);

    // Fallback if no requirements defined
    const steps = protocol.requirements || [];

    const handleNext = (key, value) => {
        setEvidence(prev => ({ ...prev, [key]: value }));
        if (stepIndex < steps.length - 1) {
            setStepIndex(stepIndex + 1);
        } else {
            submitProtocol();
        }
    };

    const submitProtocol = async () => {
        setStatus('MINING');
        try {
            // Ceremonial Submission to the Sovereign Kernel
            const result = await submitEvent({
                type: 'EVIDENCE_SUBMITTED',
                payload: {
                    protocolId: protocol.id,
                    evidence,
                    venue: 'USER_TRANSCEIVER'
                },
                actor: 'USER_HOST'
            });

            setVerdict(result);
            setStatus('COMPLETED');
        } catch (e) {
            console.error("CEREMONY_FAILURE:", e);
            alert("EXECUTION FAILED: Constitutional Breach Detected.");
            setStatus('IDLE');
        }
    };

    const handleCopyId = () => {
        navigator.clipboard.writeText(verdict.id);
        alert("VERDICT ID COPIED:\n" + verdict.id);
    };

    // --- RENDER STEPS ---

    if (status === 'COMPLETED') {
        return (
            <div style={surfaceStyle}>
                <div style={{ textAlign: 'center', marginTop: '50px' }}>
                    <div style={{ fontSize: '3rem', marginBottom: '20px' }}>✅</div>
                    <h2 style={stepTitleStyle}>PROTOCOL RATIFIED</h2>
                    <p>Evidence secured and adjudicated.</p>

                    <div style={{ background: 'var(--iron-signal-integrity)', opacity: 0.9, color: '#000', padding: '20px', border: '1px solid var(--iron-signal-active)', margin: '30px 0', fontFamily: 'monospace', wordBreak: 'break-all' }}>
                        <div>CONSEQUENCE: {verdict.consequence}</div>
                        <div style={{ marginTop: '10px', fontSize: '0.8rem' }}>VERDICT: {verdict.id}</div>
                    </div>

                    <button onClick={handleCopyId} style={btnStyle}>COPY VERDICT</button>
                    <button onClick={onClose} style={{ ...btnStyle, background: 'transparent', border: '1px solid var(--iron-text-secondary)', color: 'var(--iron-text-secondary)', marginLeft: '10px' }}>CLOSE</button>
                </div>
            </div>
        );
    }

    if (steps.length === 0) return (
        <div style={surfaceStyle}>
            <h2 style={stepTitleStyle}>INSTANT RATIFICATION</h2>
            <p>This protocol requires no further evidence.</p>
            <button onClick={submitProtocol} style={btnStyle}>CONFIRM EXECUTION</button>
            <button onClick={onClose} style={{ ...btnStyle, background: 'transparent', border: '1px solid var(--iron-text-secondary)', color: 'var(--iron-text-secondary)', marginLeft: '10px' }}>CANCEL</button>
        </div>
    );

    const currentStep = steps[stepIndex];

    return (
        <div style={surfaceStyle}>
            <div style={{ fontSize: '0.8rem', color: 'var(--iron-text-tertiary)', marginBottom: '10px' }}>
                STEP {stepIndex + 1} OF {steps.length}
            </div>

            <h2 style={stepTitleStyle}>{currentStep.label}</h2>

            <div style={{ flex: 1 }}>
                {/* DYNAMIC INPUTS BASED ON TYPE */}

                {currentStep.type === 'PHOTO' && (
                    <div>
                        <p>Upload visual evidence.</p>
                        <div style={{ border: '2px dashed var(--iron-structure-border)', padding: '40px', textAlign: 'center', cursor: 'pointer' }}
                            onClick={() => handleNext(currentStep.id, 'evidence_locked_v1.jpg')}>
                            📸 TAP TO CAPTURE
                        </div>
                    </div>
                )}

                {currentStep.type === 'GPS' && (
                    <div>
                        <p>Verify physical presence.</p>
                        <button style={{ ...btnStyle, width: '100%', marginTop: '0' }}
                            onClick={() => handleNext(currentStep.id, 'lat_lon_secured')}>
                            📍 VERIFY LOCATION
                        </button>
                    </div>
                )}

                {currentStep.type === 'TAGS' && (
                    <div>
                        <p>Add metadata tags (comma separated).</p>
                        <input type="text" style={inputStyle} placeholder="#heavy, #focus" id="tagInput" />
                        <button style={btnStyle} onClick={() => handleNext(currentStep.id, document.getElementById('tagInput').value)}>
                            CONFIRM TAGS
                        </button>
                    </div>
                )}

                {['PHOTO', 'GPS', 'TAGS'].indexOf(currentStep.type) === -1 && (
                    <div>
                        <p>Acknowledge requirement.</p>
                        <button style={btnStyle} onClick={() => handleNext(currentStep.id, true)}>CONFIRM</button>
                    </div>
                )}
            </div>
        </div>
    );
};
