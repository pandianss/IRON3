import React, { useState } from 'react';
import { useSovereignKernel } from '../../../spine/context/SovereigntyContext';

export const SovereignInduction = () => {
    const kernel = useSovereignKernel();
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        primaryFriction: '',
        preferredCadence: '06:00',
        coreAnchors: [],
        singularMandate: '',
        sovereignResolve: ''
    });

    const potentialAnchors = ['RITUAL_PUNCTUALITY', 'DATA_INTEGRITY', 'EXECUTION_DISCIPLINE', 'SYSTEM_AUDIT', 'MANDATE_ADHERENCE'];

    const toggleAnchor = (a) => {
        setFormData(prev => ({
            ...prev,
            coreAnchors: prev.coreAnchors.includes(a)
                ? prev.coreAnchors.filter(i => i !== a)
                : [...prev.coreAnchors, a]
        }));
    };

    const nextStep = () => setStep(s => s + 1);

    const completeStep1 = () => {
        if (!formData.primaryFriction) return;
        kernel.ingest('BASELINE_DECLARED', { assessment: formData.primaryFriction }, 'USER_HOST');
        nextStep();
    };

    const completeStep2 = () => {
        kernel.ingest('CADENCE_SELECTED', { cadence: formData.preferredCadence }, 'USER_HOST');
        kernel.ingest('CAPACITY_DECLARED', { load: 0 }, 'USER_HOST');
        nextStep();
    };

    const completeStep3 = () => {
        if (!formData.singularMandate) return;
        kernel.ingest('MANDATE_ESTABLISHED', { mandate: formData.singularMandate }, 'USER_HOST');
        nextStep();
    };

    const completeFinal = () => {
        if (!formData.sovereignResolve) return;
        // The Sovereign Signal that births the spine
        kernel.ingest('SOVEREIGN_GENESIS_COMMITTED', { consent: true, resolve: formData.sovereignResolve }, 'USER_HOST');
    };

    return (
        <div style={containerStyle}>
            <div style={innerStyle}>
                <div style={stepIndicatorStyle}>
                    PHASE {step} / 4 • {['INTEGRITY', 'CADENCE', 'MANDATE', 'RESOLVE'][step - 1]}
                </div>

                {step === 1 && (
                    <div className="fade-in">
                        <h1 style={titleStyle}>The Assessment</h1>
                        <p style={labelStyle}>What is the primary friction point in your current governance?</p>
                        <textarea
                            value={formData.primaryFriction}
                            onChange={e => setFormData({ ...formData, primaryFriction: e.target.value })}
                            placeholder="Identify the vulnerability..."
                            style={textareaStyle}
                        />
                        <p style={subtextStyle}>In the Sovereign Spine, we identify structural weaknesses to forge resilience. This is the first act of Integrity.</p>
                        <button onClick={completeStep1} style={buttonStyle}>ACKNOWLEDGE_FRICTION</button>
                    </div>
                )}

                {step === 2 && (
                    <div className="fade-in">
                        <h1 style={titleStyle}>The Calibration</h1>
                        <p style={labelStyle}>What is your primary hour of operational synchronization?</p>
                        <input
                            type="time"
                            value={formData.preferredCadence}
                            onChange={e => setFormData({ ...formData, preferredCadence: e.target.value })}
                            style={inputStyle}
                        />

                        <p style={labelStyle}>Select core anchors for your operative cadence:</p>
                        <div style={habitGridStyle}>
                            {potentialAnchors.map(a => (
                                <button
                                    key={a}
                                    onClick={() => toggleAnchor(a)}
                                    style={formData.coreAnchors.includes(a) ? activeAnchorStyle : anchorButtonStyle}
                                >
                                    {a.replace('_', ' ')}
                                </button>
                            ))}
                        </div>
                        <p style={subtextStyle}>Predictability is the substrate of sovereignty. Your operational framework is now set.</p>
                        <button onClick={completeStep2} style={buttonStyle}>CALIBRATE_SPINE</button>
                    </div>
                )}

                {step === 3 && (
                    <div className="fade-in">
                        <h1 style={titleStyle}>The Mandate</h1>
                        <p style={labelStyle}>Establish your singular primary mandate.</p>
                        <p style={{ ...subtextStyle, marginBottom: '20px' }}>This command must be binary, verifiable, and foundational to your daily governance.</p>
                        <input
                            type="text"
                            value={formData.singularMandate}
                            onChange={e => setFormData({ ...formData, singularMandate: e.target.value })}
                            placeholder="e.g. 06:15 Ritual Execution"
                            style={inputStyle}
                        />
                        <p style={subtextStyle}>This mandate is the first law of your personal spine. It is absolute.</p>
                        <button onClick={completeStep3} style={buttonStyle}>BIND_MANDATE</button>
                    </div>
                )}

                {step === 4 && (
                    <div className="fade-in">
                        <h1 style={titleStyle}>The Resolve</h1>
                        <p style={labelStyle}>What is your ultimate resolve for establishing this spine?</p>
                        <textarea
                            value={formData.sovereignResolve}
                            onChange={e => setFormData({ ...formData, sovereignResolve: e.target.value })}
                            placeholder="Define the sovereign purpose..."
                            style={textareaStyle}
                        />
                        <p style={subtextStyle}>This resolve will be echoed as a terminal warning during system fracture. You are now prepared to ignite the Spine.</p>
                        <button onClick={completeFinal} style={buttonStyle}>IGNITE_SOVEREIGN_SPINE</button>
                    </div>
                )}
            </div>
        </div>
    );
};

SovereignInduction.contract = {
    supportedPhases: ['pre_institutional', 'initiated'],
    authorityRange: [0, 1]
};

const containerStyle = {
    height: '100vh',
    background: 'radial-gradient(circle at center, #111 0%, #000 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#f0f0f0',
    overflow: 'hidden'
};

const innerStyle = { maxWidth: '500px', width: '100%', padding: '40px' };

const stepIndicatorStyle = {
    fontFamily: 'var(--font-mono)',
    fontSize: '0.7rem',
    letterSpacing: '3px',
    color: 'var(--iron-accent)',
    marginBottom: '20px',
    opacity: 0.8
};

const titleStyle = {
    fontFamily: 'var(--font-authority)',
    fontSize: '3rem',
    margin: '0 0 30px 0',
    letterSpacing: '5px',
    textShadow: '0 0 20px rgba(var(--iron-accent-rgb), 0.3)'
};

const labelStyle = { fontSize: '1.2rem', marginBottom: '20px', opacity: 0.9 };

const subtextStyle = { fontSize: '0.9rem', opacity: 0.6, lineHeight: '1.6', margin: '20px 0' };

const textareaStyle = {
    width: '100%',
    background: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid var(--iron-border)',
    color: '#fff',
    padding: '15px',
    fontSize: '1rem',
    fontFamily: 'inherit',
    minHeight: '120px',
    outline: 'none'
};

const inputStyle = {
    width: '100%',
    background: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid var(--iron-border)',
    color: '#fff',
    padding: '12px 15px',
    fontSize: '1.1rem',
    outline: 'none'
};

const habitGridStyle = {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '10px',
    margin: '20px 0'
};

const anchorButtonStyle = {
    background: 'transparent',
    border: '1px solid #333',
    color: '#888',
    padding: '10px',
    cursor: 'pointer',
    fontSize: '0.8rem'
};

const activeAnchorStyle = {
    ...anchorButtonStyle,
    background: 'rgba(var(--iron-accent-rgb), 0.2)',
    borderColor: 'var(--iron-accent)',
    color: '#fff'
};

const buttonStyle = {
    width: '100%',
    padding: '15px',
    background: 'var(--iron-accent)',
    color: '#000',
    border: 'none',
    fontFamily: 'var(--font-authority)',
    fontSize: '1rem',
    fontWeight: 'bold',
    cursor: 'pointer',
    letterSpacing: '2px',
    marginTop: '20px'
};

const innerStyle = { maxWidth: '500px', width: '100%', padding: '40px' };

const stepIndicatorStyle = {
    fontFamily: 'var(--font-mono)',
    fontSize: '0.7rem',
    letterSpacing: '3px',
    color: '#ff4d00',
    marginBottom: '20px',
    opacity: 0.8
};

const titleStyle = {
    fontFamily: 'var(--font-authority)',
    fontSize: '3rem',
    margin: '0 0 30px 0',
    letterSpacing: '5px',
    textShadow: '0 0 20px rgba(255, 77, 0, 0.3)'
};

const labelStyle = { fontSize: '1.2rem', marginBottom: '20px', opacity: 0.9 };

const subtextStyle = { fontSize: '0.9rem', opacity: 0.6, lineHeight: '1.6', margin: '20px 0' };

const textareaStyle = {
    width: '100%',
    background: 'rgba(255, 77, 0, 0.05)',
    border: '1px solid rgba(255, 77, 0, 0.3)',
    color: '#fff',
    padding: '15px',
    fontSize: '1rem',
    fontFamily: 'inherit',
    minHeight: '120px',
    outline: 'none',
    transition: 'border-color 0.2s'
};

const inputStyle = {
    width: '100%',
    background: 'rgba(255, 77, 0, 0.05)',
    border: '1px solid rgba(255, 77, 0, 0.3)',
    color: '#fff',
    padding: '12px 15px',
    fontSize: '1.1rem',
    outline: 'none'
};

const habitGridStyle = {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '10px',
    margin: '20px 0'
};

const habitButtonStyle = {
    background: 'transparent',
    border: '1px solid #333',
    color: '#888',
    padding: '10px',
    cursor: 'pointer',
    fontSize: '0.8rem'
};

const activeHabitStyle = {
    ...habitButtonStyle,
    background: 'rgba(255, 77, 0, 0.2)',
    borderColor: '#ff4d00',
    color: '#fff'
};

const buttonStyle = {
    width: '100%',
    padding: '15px',
    background: '#ff4d00',
    color: '#000',
    border: 'none',
    fontFamily: 'var(--font-authority)',
    fontSize: '1rem',
    fontWeight: 'bold',
    cursor: 'pointer',
    letterSpacing: '2px',
    marginTop: '20px'
};
