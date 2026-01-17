import React, { useState } from 'react';
import { LedgerBinding } from './LedgerBinding';

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
    const [receipt, setReceipt] = useState(null);

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
        // Submit to Blockchain
        const result = await LedgerBinding.submitExecution(protocol.id, evidence);

        if (result.success) {
            setReceipt(result);
            setStatus('COMPLETED');
        } else {
            alert("EXECUTION FAILED: " + result.error);
            setStatus('IDLE');
        }
    };

    const handleShare = () => {
        const text = LedgerBinding.generateReceipt(receipt.blockHash);
        navigator.clipboard.writeText(text);
        alert("PROOF COPIED TO CLIPBOARD:\n" + text);
    };

    // --- RENDER STEPS ---

    if (status === 'COMPLETED') {
        return (
            <div style={surfaceStyle}>
                <div style={{ textAlign: 'center', marginTop: '50px' }}>
                    <div style={{ fontSize: '3rem', marginBottom: '20px' }}>✅</div>
                    <h2 style={stepTitleStyle}>PROTOCOL RATIFIED</h2>
                    <p>Evidence secured on Sovereign Ledger.</p>

                    <div style={{ background: 'var(--iron-signal-integrity)', opacity: 0.9, color: '#000', padding: '20px', border: '1px solid var(--iron-signal-active)', margin: '30px 0', fontFamily: 'monospace', wordBreak: 'break-all' }}>
                        <div>BLOCK #{receipt.blockIndex}</div>
                        <div style={{ marginTop: '10px', fontSize: '0.8rem' }}>HASH: {receipt.blockHash}</div>
                    </div>

                    <button onClick={handleShare} style={btnStyle}>SHARE PROOF</button>
                    <button onClick={onClose} style={{ ...btnStyle, background: 'transparent', border: '1px solid var(--iron-text-secondary)', color: 'var(--iron-text-secondary)', marginLeft: '10px' }}>CLOSE</button>
                </div>
            </div>
        );
    }

    if (steps.length === 0) return <div>NO REQUIREMENTS DEFINED</div>;

    const currentStep = steps[stepIndex];
    const isLast = stepIndex === steps.length - 1;

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
                        {/* Mock File Input */}
                        <div style={{ border: '2px dashed var(--iron-structure-border)', padding: '40px', textAlign: 'center', cursor: 'pointer' }}
                            onClick={() => handleNext(currentStep.id, 'mock_image_blob.jpg')}>
                            📸 TAP TO CAPTURE
                        </div>
                    </div>
                )}

                {currentStep.type === 'GPS' && (
                    <div>
                        <p>Verify physical presence.</p>
                        <button style={{ ...btnStyle, width: '100%', marginTop: '0' }}
                            onClick={() => handleNext(currentStep.id, '40.7128,-74.0060')}>
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

                {/* Fallback for others */}
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
