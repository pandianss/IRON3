import React from 'react';
import { Link } from 'react-router-dom';
import { SEOHead } from '../SEOHead';

export const LandingPage = () => {
    return (
        <div className="public-root" style={{
            maxWidth: '800px',
            margin: '0 auto',
            padding: '80px 20px',
            color: '#f0f0f0',
            fontFamily: 'var(--font-human)'
        }}>
            <SEOHead
                title="Personal Institutional System"
                description="IRON is a personal institutional system: software that governs behavior using standing, contracts, and consequences."
                path="/"
            />

            <header style={{ marginBottom: '60px' }}>
                <h1 style={{ fontFamily: 'var(--font-authority)', fontSize: '3rem', margin: 0 }}>IRON</h1>
                <p style={{ opacity: 0.6, letterSpacing: '2px' }}>Personal Institutional System</p>
            </header>

            <main>
                <section style={{ marginBottom: '80px' }}>
                    <h2 style={{ fontSize: '2rem', color: 'var(--iron-brand-stable)' }}>Discipline is a technical problem.</h2>
                    <p style={{ lineHeight: '1.6', fontSize: '1.2rem' }}>
                        Most productivity tools ask you to be motivated. IRON asks you to be governed.
                        We build personal institutions that transform consistency from a struggle into a law.
                    </p>
                </section>

                <nav style={{ display: 'grid', gap: '20px' }}>
                    <Link to="/what-is-iron" style={linkStyle}>What is IRON?</Link>
                    <Link to="/institutional-productivity" style={linkStyle}>What is Institutional Productivity?</Link>
                    <Link to="/personal-institution" style={linkStyle}>What is a Personal Institution?</Link>
                    <Link to="/app" style={actionStyle}>Access Dashboard</Link>
                </nav>
            </main>
        </div>
    );
};

const linkStyle = {
    color: 'var(--iron-accent)',
    textDecoration: 'none',
    fontSize: '1.1rem',
    borderBottom: '1px solid transparent',
    transition: 'border 0.2s'
};

const actionStyle = {
    marginTop: '40px',
    display: 'inline-block',
    padding: '15px 30px',
    background: 'var(--iron-brand-stable)',
    color: '#000',
    textDecoration: 'none',
    fontWeight: 'bold',
    fontFamily: 'var(--font-authority)',
    textAlign: 'center'
};
