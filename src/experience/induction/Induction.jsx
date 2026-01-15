import React, { useState } from 'react';
import { useSovereignKernel } from '../../institution/InstitutionalContext';

export const Induction = () => {
    const kernel = useSovereignKernel();
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        brokenPromise: '',
        startTime: '06:00',
        anchorHabits: [],
        nonNegotiable: '',
        why: ''
    });

    const habits = ['COLD_SHOWER', 'DEEP_WORK', 'JOURNALING', 'MEDITATION', 'READING', 'FASTING'];

    const toggleHabit = (h) => {
        setFormData(prev => ({
            ...prev,
            anchorHabits: prev.anchorHabits.includes(h)
                ? prev.anchorHabits.filter(i => i !== h)
                : [...prev.anchorHabits, h]
        }));
    };

    const nextStep = () => setStep(s => s + 1);

    const completeStep1 = () => {
        if (!formData.brokenPromise) return;
        kernel.ingest('BASELINE_DECLARED', { assessment: formData.brokenPromise }, 'USER_HOST');
        nextStep();
    };

    const completeStep2 = () => {
        kernel.ingest('CADENCE_SELECTED', { cadence: formData.startTime }, 'USER_HOST');
        kernel.ingest('CAPACITY_DECLARED', { load: 0 }, 'USER_HOST');
        nextStep();
    };

    const completeStep3 = () => {
        if (!formData.nonNegotiable) return;
        kernel.ingest('OATH_TAKEN', { nonNegotiable: formData.nonNegotiable }, 'USER_HOST');
        nextStep();
    };

    const completeFinal = () => {
        if (!formData.why) return;
        // The Sovereign Signal that births the institution
        kernel.ingest('GENESIS_VERDICT_SUBMITTED', { consent: true, why: formData.why }, 'USER_HOST');

        // Activate full modules once born
        kernel.ingest('MODULE_ACTIVATED', { moduleId: 'FITNESS_RECOVERY' }, 'USER_HOST');
    };

    return (
        <div className="forge-onboarding" style={containerStyle}>
            <div style={innerStyle}>
                <div style={stepIndicatorStyle}>
                    PHASE {step} / 4 • {['INTEGRITY', 'ORDER', 'OATH', 'RESOLVE'][step - 1]}
                </div>

                {step === 1 && (
                    <div className="fade-in">
                        <h1 style={titleStyle}>The Assessment</h1>
                        <p style={labelStyle}>What is the one promise to yourself that you break most often?</p>
                        <textarea
                            value={formData.brokenPromise}
                            onChange={e => setFormData({ ...formData, brokenPromise: e.target.value })}
                            placeholder="Confront your reality..."
                            style={textareaStyle}
                        />
                        <p style={subtextStyle}>In IRON, we don't set 'goals.' We make commitments. Identifying this gap is the first act of Integrity.</p>
                        <button onClick={completeStep1} style={buttonStyle}>ACKNOWLEDGE_BREACH</button>
                    </div>
                )}

                {step === 2 && (
                    <div className="fade-in">
                        <h1 style={titleStyle}>The Calibration</h1>
                        <p style={labelStyle}>What time does your day officially begin?</p>
                        <input
                            type="time"
                            value={formData.startTime}
                            onChange={e => setFormData({ ...formData, startTime: e.target.value })}
                            style={inputStyle}
                        />

                        <p style={labelStyle}>Select three anchor habits to define your order:</p>
                        <div style={habitGridStyle}>
                            {habits.map(h => (
                                <button
                                    key={h}
                                    onClick={() => toggleHabit(h)}
                                    style={formData.anchorHabits.includes(h) ? activeHabitStyle : habitButtonStyle}
                                >
                                    {h.replace('_', ' ')}
                                </button>
                            ))}
                        </div>
                        <p style={subtextStyle}>Order is the foundation of freedom. Your daily framework is now set.</p>
                        <button onClick={completeStep2} style={buttonStyle}>INSTALL_ORDER</button>
                    </div>
                )}

                {step === 3 && (
                    <div className="fade-in">
                        <h1 style={titleStyle}>The Oath</h1>
                        <p style={labelStyle}>Choose your 'Non-negotiable' action.</p>
                        <p style={{ ...subtextStyle, marginBottom: '20px' }}>This task must be so small it is impossible to fail, but so vital it cannot be skipped.</p>
                        <input
                            type="text"
                            value={formData.nonNegotiable}
                            onChange={e => setFormData({ ...formData, nonNegotiable: e.target.value })}
                            placeholder="e.g. 5 Minutes of Cold Water"
                            style={inputStyle}
                        />
                        <p style={subtextStyle}>This is your baseline. The Non-negotiable is your bond. It is non-negotiable.</p>
                        <button onClick={completeStep3} style={buttonStyle}>BIND_OATH</button>
                    </div>
                )}

                {step === 4 && (
                    <div className="fade-in">
                        <h1 style={titleStyle}>The Forging</h1>
                        <p style={labelStyle}>When the 'Heat' rises and you want to quit, what is your 'Why'?</p>
                        <textarea
                            value={formData.why}
                            onChange={e => setFormData({ ...formData, why: e.target.value })}
                            placeholder="Define your ultimate resolve..."
                            style={textareaStyle}
                        />
                        <p style={subtextStyle}>This will appear as a Resolve Alert when you miss a check-in. You are now ready to enter the Forge.</p>
                        <button onClick={completeFinal} style={buttonStyle}>IGNITE_THE_FORGE</button>
                    </div>
                )}
            </div>
        </div>
    );
};

const containerStyle = {
    height: '100vh',
    background: 'radial-gradient(circle at center, #1a0a05 0%, #000 100%)',
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
