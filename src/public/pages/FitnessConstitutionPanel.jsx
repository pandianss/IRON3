import React from 'react';

export const FitnessConstitutionPanel = () => {
    return (
        <div style={panelBodyStyle}>
            <h1 style={titleStyle}>IRON — Fitness Constitution v1</h1>
            <p style={{ opacity: 0.6, fontSize: '0.8rem', marginBottom: '30px', letterSpacing: '1px' }}>Founding Law of the Fitness Institution</p>

            <section style={sectionStyle}>
                <h2>Preamble</h2>
                <p>
                    The Fitness Institution exists to establish and govern a long-term, truthful, and adaptive relationship between a person and their physical condition.
                    It recognizes that physical integrity cannot be sustained by motivation, novelty, or aesthetic goals alone.
                </p>
                <p style={{ fontWeight: 'bold', color: 'var(--iron-brand-stable)' }}>It must be institutionalized.</p>
                <p>
                    The Fitness Institution therefore governs physical conduct through:
                    obligation, standing, consequence, recovery law, and institutional memory.
                </p>
            </section>

            <section style={sectionStyle}>
                <h2>Article I — Purpose</h2>
                <p>The purpose of the Fitness Institution is to protect physical integrity, maintain training continuity, and institutionalize recovery discipline.</p>
                <p>The institution does not exist to maximize intensity. It exists to sustain physical viability over time.</p>
            </section>

            <section style={sectionStyle}>
                <h2>Article III — Institutional Values</h2>
                <ul style={listStyle}>
                    <li><strong>Continuity over intensity:</strong> Long-term participation outweighs short-term extremes.</li>
                    <li><strong>Compliance over motivation:</strong> Obligation replaces emotional dependency.</li>
                    <li><strong>Recovery as law:</strong> Rest is a governed behavior, not a suggestion.</li>
                    <li><strong>Physiological truth:</strong> The institution privileges bodily reality over user preference.</li>
                </ul>
            </section>

            <section style={sectionStyle}>
                <h2>Article IX — Recovery and Rehabilitation</h2>
                <p>Recovery is a first-class institutional domain. The institution recognizes that degradation is inevitable and continuity will break.</p>
                <p style={{ fontStyle: 'italic', opacity: 0.8 }}>"Recovery is not a reset. It is a structured institutional condition."</p>
            </section>

            <section style={sectionStyle}>
                <h2>Article XII — Non-Negotiables</h2>
                <p>The following are constitutionally prohibited:</p>
                <ul style={listStyle}>
                    <li>Hiding institutional condition</li>
                    <li>Allowing cosmetic compliance</li>
                    <li>Permitting training under declared injury</li>
                    <li>Erasing breach history</li>
                </ul>
                <p style={{ marginTop: '20px', fontWeight: 'bold' }}>The institution shall always favor: safety, continuity, and truth.</p>
            </section>

            <div style={{ marginTop: '40px', padding: '20px', border: '1px solid var(--iron-brand-stable)', background: 'rgba(0, 255, 102, 0.05)' }}>
                <p style={{ margin: 0, fontSize: '0.9rem', textAlign: 'center' }}>
                    <strong>Closing Declaration:</strong> Once entered, the institution is authoritative.
                    It promises truthful, continuous, and governed physical life.
                </p>
            </div>
        </div>
    );
};

const panelBodyStyle = { color: '#f0f0f0', maxWidth: '100%', paddingBottom: '40px' };
const titleStyle = { fontFamily: 'var(--font-authority)', fontSize: '1.8rem', borderBottom: '2px solid var(--iron-brand-stable)', paddingBottom: '10px', marginTop: 0, marginBottom: '5px' };
const sectionStyle = { lineHeight: '1.7', margin: '30px 0' };
const listStyle = { paddingLeft: '20px', marginTop: '10px' };
