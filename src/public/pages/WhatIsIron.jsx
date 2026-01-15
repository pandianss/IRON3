import React from 'react';

export const WhatIsIron = () => {
    return (
        <div style={panelBodyStyle}>
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
                <ul style={{ paddingLeft: '20px' }}>
                    <li><strong>Standing:</strong> Your reputation within your own system.</li>
                    <li><strong>Contracts:</strong> Explicit, code-enforced behavioral agreements.</li>
                    <li><strong>Consequences:</strong> Real-time degradation of the experience when law is breached.</li>
                </ul>
            </section>
        </div>
    );
};

const panelBodyStyle = { color: '#f0f0f0', maxWidth: '100%' };
const titleStyle = { fontFamily: 'var(--font-authority)', fontSize: '2rem', borderBottom: '2px solid var(--iron-brand-stable)', paddingBottom: '10px', marginTop: 0 };
const sectionStyle = { lineHeight: '1.7', margin: '20px 0' };

