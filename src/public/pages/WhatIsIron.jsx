import React from 'react';
import { SEOHead } from '../SEOHead';

export const WhatIsIron = () => {
    return (
        <article className="public-page" style={pageStyle}>
            <SEOHead
                title="What is IRON"
                description="Discover the behavioral governing system that turns consistency into law."
                path="/what-is-iron"
            />
            <h1 style={titleStyle}>What is IRON?</h1>
            <section style={sectionStyle}>
                <p>IRON is not an app. It is a <strong>Behavioral Governing System</strong>.</p>
                <p>
                    Traditional apps are advisory. They provide lists, charts, and notifications.
                    They depend on your mood to function.
                </p>
                <p>
                    IRON is <strong>mandatory</strong>. It utilizes an internal Institutional State
                    to govern your access to information and features based on your actual performance.
                    It turns your commitments into "Laws" that are monitored by the Institutional Kernel.
                </p>
            </section>

            <section style={sectionStyle}>
                <h2>Core Principles</h2>
                <ul>
                    <li><strong>Standing:</strong> Your reputation within your own system.</li>
                    <li><strong>Contracts:</strong> Explicit, code-enforced behavioral agreements.</li>
                    <li><strong>Consequences:</strong> Real-time degradation of the experience when law is breached.</li>
                </ul>
            </section>
        </article>
    );
};

const pageStyle = { maxWidth: '800px', margin: '0 auto', padding: '60px 20px', color: '#f0f0f0' };
const titleStyle = { fontFamily: 'var(--font-authority)', fontSize: '2.5rem', borderBottom: '2px solid var(--iron-brand-stable)', paddingBottom: '10px' };
const sectionStyle = { lineHeight: '1.7', margin: '40px 0' };
