import React from 'react';

export const InstitutionalProductivity = () => {
    return (
        <div style={panelBodyStyle}>
            <h1 style={titleStyle}>Sovereign Productivity</h1>
            <section style={sectionStyle}>
                <p>
                    Traditional productivity focuses on the individual's will.
                    <strong>Sovereign Productivity</strong> focuses on the system's architecture.
                </p>
                <p>
                    Institutions endure because they don't rely on the whims of individuals; they rely on
                    <strong>Protocols, Cycles, and Audits</strong>. We apply these same principles to
                    personal achievement.
                </p>
            </section>

            <section style={sectionStyle}>
                <h2>The Shift</h2>
                <p>
                    Instead of "trying to work hard," you "operate within a governance."
                    Growth is no longer a choice you make every morning; it is the default path
                    defined by your institutional standing.
                </p>
            </section>
        </div>
    );
};

const panelBodyStyle = { color: '#f0f0f0', maxWidth: '100%' };
const titleStyle = { fontFamily: 'var(--font-authority)', fontSize: '2rem', color: 'var(--iron-accent)', marginTop: 0 };
const sectionStyle = { lineHeight: '1.7', margin: '20px 0' };

