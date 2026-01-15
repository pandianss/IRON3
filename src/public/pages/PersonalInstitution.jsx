import React from 'react';
import { SEOHead } from '../SEOHead';

export const PersonalInstitution = () => {
    return (
        <article className="public-page" style={pageStyle}>
            <SEOHead
                title="The Personal Institution"
                description="Software that governs behavior using standing, contracts, and consequences."
                path="/personal-institution"
            />
            <h1 style={titleStyle}>A Personal Institution</h1>
            <section style={sectionStyle}>
                <p>
                    A Personal Institution is a software-enforced structure that acts as your
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
                <ul>
                    <li><strong>Discipline:</strong> Enforced by the cost of breach.</li>
                    <li><strong>Consistency:</strong> Maintained via mandatory check-ins.</li>
                    <li><strong>Growth:</strong> Measured by the expansion of your Authority Map.</li>
                </ul>
            </section>
        </article>
    );
};

const pageStyle = { maxWidth: '800px', margin: '0 auto', padding: '60px 20px', color: '#f0f0f0' };
const titleStyle = { fontFamily: 'var(--font-authority)', fontSize: '2.5rem' };
const sectionStyle = { lineHeight: '1.7', margin: '40px 0' };
