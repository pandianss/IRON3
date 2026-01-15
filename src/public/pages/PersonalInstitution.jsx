import React from 'react';

export const PersonalInstitution = () => {
    return (
        <div style={panelBodyStyle}>
            <h1 style={titleStyle}>A Private Discipline</h1>
            <section style={sectionStyle}>
                <p>
                    A Private Discipline is a software-enforced structure that acts as your
                    Behavioral Sovereignty.
                </p>
                <p>
                    It is composed of a <strong>Sovereign Ledger</strong>—an immutable record of
                    every act—and a <strong>Standing Engine</strong> that derives your status
                    from that ledger.
                </p>
            </section>

            <section style={sectionStyle}>
                <h2>Mechanics of Governance</h2>
                <ul style={{ paddingLeft: '20px' }}>
                    <li><strong>Discipline:</strong> Enforced by the cost of breach.</li>
                    <li><strong>Consistency:</strong> Maintained via mandatory check-ins.</li>
                    <li><strong>Growth:</strong> Measured by the expansion of your Authority Map.</li>
                </ul>
            </section>
        </div>
    );
};

const panelBodyStyle = { color: '#f0f0f0', maxWidth: '100%' };
const titleStyle = { fontFamily: 'var(--font-authority)', fontSize: '2rem', marginTop: 0 };
const sectionStyle = { lineHeight: '1.7', margin: '20px 0' };

