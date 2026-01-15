import React, { useState } from 'react';
import '../../styles/InstitutionalTheme.css';

import { NarrativeRegistry } from '../../../core/protocols/NarrativeRegistry';

const InstitutionalBriefing = ({ onComplete }) => {
    const [step, setStep] = useState(0);

    const slides = [
        NarrativeRegistry.BRIEFING.SLIDE_1,
        NarrativeRegistry.BRIEFING.SLIDE_2,
        NarrativeRegistry.BRIEFING.SLIDE_3
    ];

    const next = () => {
        if (step < slides.length - 1) {
            setStep(step + 1);
        } else {
            onComplete();
        }
    };

    return (
        <div className="briefing-screen" style={{
            height: '100vh',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            padding: '40px',
            background: 'var(--civil-bg)'
        }}>
            <div style={{ maxWidth: '500px', margin: '0 auto' }}>
                <div style={{
                    fontSize: '0.8rem',
                    letterSpacing: '2px',
                    color: 'var(--civil-accent-stable)',
                    marginBottom: '24px'
                }}>
                    BRIEFING {step + 1} / {slides.length}
                </div>

                <h1 style={{
                    fontSize: '2.5rem',
                    marginBottom: '24px',
                    color: 'var(--civil-text-primary)'
                }}>
                    {slides[step].title}
                </h1>

                <p style={{
                    fontSize: '1.1rem',
                    lineHeight: '1.6',
                    color: 'var(--civil-text-secondary)',
                    marginBottom: '48px'
                }}>
                    {slides[step].content}
                </p>

                <button
                    onClick={next}
                    style={{
                        padding: '16px 32px',
                        background: 'var(--civil-text-primary)',
                        color: 'var(--civil-bg)',
                        border: 'none',
                        fontSize: '1rem',
                        fontWeight: '600',
                        cursor: 'pointer'
                    }}
                >
                    {step === slides.length - 1 ? 'ENTER THE SYSTEM' : 'ACKNOWLEDGE'}
                </button>
            </div>
        </div>
    );
};

export default InstitutionalBriefing;
