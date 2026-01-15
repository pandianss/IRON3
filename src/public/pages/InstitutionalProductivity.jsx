import React from 'react';
import { SEOHead } from '../SEOHead';

export const InstitutionalProductivity = () => {
    return (
        <article className="public-page" style={pageStyle}>
            <SEOHead
                title="Institutional Productivity"
                description="Learn why systemic consistency beats individual motivation every time."
                path="/institutional-productivity"
            />
            <h1 style={titleStyle}>Institutional Productivity</h1>
            <section style={sectionStyle}>
                <p>
                    Traditional productivity focuses on the individual's will.
                    <strong>Institutional Productivity</strong> focuses on the system's architecture.
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
        </article>
    );
};

const pageStyle = { maxWidth: '800px', margin: '0 auto', padding: '60px 20px', color: '#f0f0f0' };
const titleStyle = { fontFamily: 'var(--font-authority)', fontSize: '2.5rem', color: 'var(--iron-accent)' };
const sectionStyle = { lineHeight: '1.7', margin: '40px 0' };
