import React from 'react';

export const ConstitutionPanel = () => {
    return (
        <div style={{ color: '#f0f0f0', maxWidth: '100%', paddingBottom: '40px' }}>
            <h1 style={{ fontFamily: 'var(--font-authority)', fontSize: '2rem', borderBottom: '2px solid var(--iron-brand-stable)', paddingBottom: '20px', marginBottom: '30px' }}>
                The IRON Constitution
            </h1>

            <section style={{ marginBottom: '40px', fontStyle: 'italic', opacity: 0.8, borderLeft: '3px solid var(--iron-accent)', paddingLeft: '20px' }}>
                <p>IRON is not a fitness application. IRON is a behavioural institution.</p>
                <p>Its purpose is to establish, govern, and preserve personal discipline through enforceable commitments, permanent records, and escalating accountability.</p>
            </section>

            <Article title="Article I — Sovereignty of the Ledger">
                The Behavioural Ledger is the single source of truth. All user state must be derivable exclusively from ledger history. The ledger records only facts: events that have occurred under system authority.
            </Article>

            <Article title="Article II — Standing as Supreme Authority">
                Every user exists in exactly one Standing at any time. Standing governs what actions are permitted, what screens are accessible, and what tone the system adopts. If Standing cannot justify an experience, that experience must not exist.
            </Article>

            <Article title="Article III — Contractual Entry">
                Entry into IRON occurs only through Induction. A contract defines minimum obligations, evaluation rules, and failure conditions. Without a contract, no user is considered a member.
            </Article>

            <Article title="Article IV — Daily Governance">
                IRON is organised around institutional days. Each day may create obligations. Every governed day must be closed by ledger entry. An open day is an unresolved institutional state.
            </Article>

            <Article title="Article V — Irreversibility">
                All institutional outcomes leave permanent record. Failures must produce historical facts. No mechanism may erase institutional history. Progress accumulates. Failure scars.
            </Article>

            <Article title="Article VI — Escalation of Commitment">
                Continued compliance must increase institutional weight. Stability must never reduce consequence. Time strengthens authority.
            </Article>

            <Article title="Article VII — Breach and Recovery">
                Breach is a formal institutional event. Recovery is not a reset; it is a governed process with defined cost. The system must always remember the difference between continuity and repair.
            </Article>

            <Article title="Article VIII — Experience Subordination">
                The interface exists to expose system reality. UI may not soften outcomes, conceal standing, or simulate progress. The interface is a window, not a playground.
            </Article>

            <Article title="Article IX — Institutional Voice">
                IRON communicates as a system, not a motivator. Language must be precise, non-sentimental, and consequence-oriented. Praise is replaced by confirmation.
            </Article>

            <Article title="Article X — Product Law">
                Retention is not a feature. It is the result of governance. Any component that does not strengthen behavioural authority violates this Constitution.
            </Article>

            <div style={{ marginTop: '60px', textAlign: 'center', opacity: 0.5, fontSize: '0.8rem' }}>
                <p>ESTABLISHED 2026</p>
                <p>SOVEREIGN DISCIPLINE SYSTEM</p>
            </div>
        </div>
    );
};

const Article = ({ title, children }) => (
    <div style={{ marginBottom: '40px' }}>
        <h3 style={{ color: 'var(--iron-brand-stable)', fontFamily: 'var(--font-authority)', fontSize: '1.2rem', marginBottom: '10px' }}>{title}</h3>
        <p style={{ lineHeight: '1.6', opacity: 0.9 }}>{children}</p>
    </div>
);
