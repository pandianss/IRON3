import React from 'react';
import { Link } from 'react-router-dom';
import { SEOHead } from '../SEOHead';
import { getDisciplineList } from '../../domain/InstitutionalTemplates';
import { useSovereignKernel } from '../../institution/InstitutionalContext';

export const LandingPage = () => {
    const disciplines = getDisciplineList();
    const kernel = useSovereignKernel();

    const handleActivate = async (id) => {
        try {
            await kernel.ingest('MODULE_ACTIVATED', { moduleId: id }, 'USER_HOST');
            alert(`Sovereign Module [${id}] Activated in Kernel.`);
        } catch (e) {
            console.error("Activation Failure:", e);
        }
    };

    return (
        <div className="public-root" style={{
            maxWidth: '1000px',
            margin: '0 auto',
            padding: '80px 20px',
            color: '#f0f0f0',
            fontFamily: 'var(--font-human)'
        }}>
            <SEOHead
                title="Sovereign Productivity System"
                description="IRON is a private discipline system: software that governs behavior using standing, contracts, and internal laws."
                path="/"
            />

            <header style={{ marginBottom: '60px', textAlign: 'center' }}>
                <h1 style={{ fontFamily: 'var(--font-authority)', fontSize: '4rem', margin: 0, letterSpacing: '8px' }}>IRON</h1>
                <p style={{ opacity: 0.6, letterSpacing: '4px', marginTop: '10px' }}>Sovereign Discipline System</p>
            </header>

            <main>
                <section style={{ marginBottom: '80px', textAlign: 'center', maxWidth: '700px', margin: '0 auto 80px auto' }}>
                    <h2 style={{ fontSize: '2.2rem', color: 'var(--iron-brand-stable)', marginBottom: '20px' }}>Discipline is a technical problem.</h2>
                    <p style={{ lineHeight: '1.6', fontSize: '1.2rem', opacity: 0.8 }}>
                        Most productivity tools ask you to be motivated. IRON asks you to be governed.
                        Activate specialized modules to transform your commitments into sovereign law.
                    </p>
                </section>

                <section style={{ marginBottom: '80px' }}>
                    <h2 style={{ fontFamily: 'var(--font-authority)', fontSize: '1.5rem', marginBottom: '40px', borderBottom: '1px solid var(--iron-border)', paddingBottom: '10px' }}>
                        THE REGISTRY
                    </h2>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
                        {disciplines.map(d => (
                            <div key={d.id} style={cardStyle}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                    <h3 style={{ margin: 0, color: 'var(--iron-accent)', fontSize: '1.1rem' }}>{d.label}</h3>
                                    <span style={{ fontSize: '0.6rem', opacity: 0.4, letterSpacing: '1px' }}>{d.primaryMetric.toUpperCase()}</span>
                                </div>
                                <p style={{ fontSize: '0.85rem', margin: '15px 0 25px 0', opacity: 0.7, lineHeight: '1.5', minHeight: '3em' }}>
                                    {d.focus}
                                </p>
                                <button
                                    onClick={() => handleActivate(d.id)}
                                    style={activateButtonStyle}
                                >
                                    ACTIVATE
                                </button>
                            </div>
                        ))}
                    </div>
                </section>

                <nav style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '30px', borderTop: '1px solid var(--iron-border)', paddingTop: '40px' }}>
                    <Link to="/what-is-iron" style={linkStyle}>
                        <span style={{ display: 'block', fontSize: '0.7rem', opacity: 0.5, marginBottom: '5px' }}>01_PHILOSOPHY</span>
                        What is IRON?
                    </Link>
                    <Link to="/institutional-productivity" style={linkStyle}>
                        <span style={{ display: 'block', fontSize: '0.7rem', opacity: 0.5, marginBottom: '5px' }}>02_SYSTEMS</span>
                        Industrial Strength Productivity?
                    </Link>
                    <Link to="/personal-institution" style={linkStyle}>
                        <span style={{ display: 'block', fontSize: '0.7rem', opacity: 0.5, marginBottom: '5px' }}>03_SOVEREIGNTY</span>
                        What is a Private Discipline?
                    </Link>
                    <Link to="/app" style={actionStyle}>GOTO_DASHBOARD</Link>
                </nav>
            </main>
        </div>
    );
};

const linkStyle = {
    color: 'var(--iron-accent)',
    textDecoration: 'none',
    fontSize: '1.1rem',
    transition: 'opacity 0.2s',
    display: 'block'
};

const cardStyle = {
    background: 'rgba(255, 255, 255, 0.03)',
    border: '1px solid var(--iron-border)',
    padding: '25px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between'
};

const activateButtonStyle = {
    background: 'transparent',
    border: '1px solid var(--iron-brand-stable)',
    color: 'var(--iron-brand-stable)',
    padding: '8px 15px',
    cursor: 'pointer',
    fontSize: '0.7rem',
    fontWeight: 'bold',
    letterSpacing: '2px',
    transition: 'all 0.2s',
    alignSelf: 'flex-start'
};

const actionStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '15px 30px',
    background: 'var(--iron-brand-stable)',
    color: '#000',
    textDecoration: 'none',
    fontWeight: 'bold',
    fontFamily: 'var(--font-authority)',
    textAlign: 'center',
    fontSize: '0.9rem'
};

