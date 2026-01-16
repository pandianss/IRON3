import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { SEOHead } from '../SEOHead';
import { getDisciplineList } from '../../domain/InstitutionalTemplates';
import { useSovereignKernel, useInstitutionalSnapshot } from '../../institution/InstitutionalContext';
import { useAuth } from '../../context/AuthContext';

// Floating Panels
import { WhatIsIron } from './WhatIsIron';
import { InstitutionalProductivity } from './InstitutionalProductivity';
import { PersonalInstitution } from './PersonalInstitution';
import { DisciplineLawPanel } from './DisciplineLawPanel';

import { ConstitutionPanel } from './ConstitutionPanel';

export const LandingPage = () => {
    const disciplines = getDisciplineList();
    const kernel = useSovereignKernel();
    const snapshot = useInstitutionalSnapshot();
    const activeModules = snapshot?.activeModules || [];

    const [activePanel, setActivePanel] = useState(null);
    const navigate = useNavigate();
    const { currentUser, login, logout } = useAuth();

    const handleToggleModule = async (e, id) => {
        if (e) e.stopPropagation();

        if (!currentUser) {
            setActivePanel('AUTH_REQUIRED');
            return;
        }

        const isActive = activeModules.includes(id);

        try {
            if (isActive) {
                console.log("Deactivating Module:", id);
                await kernel.ingest('MODULE_DEACTIVATED', { moduleId: id }, 'USER_HOST');
            } else {
                await kernel.ingest('MODULE_ACTIVATED', { moduleId: id }, 'USER_HOST');
                // navigate('/app'); // Don't auto-navigate if toggling from panel? 
                // Actually the original code navigated on activate. 
                // The user said "activate button can show up as a floating button". 
                // Maybe we should stay on the page if activated from panel?
                // For now, I'll keep the navigate behavior consistent if that's what's expected, 
                // but usually activation implies you want to start using it. 
                // However, if they are just reading, maybe they don't want to jump.
                // Let's remove the navigate for now to keep them in the flow unless they explicitly click "Dashboard".
            }
        } catch (e) {
            console.error("Module Toggle Failure:", e);
        }
    };

    const handleJoin = () => {
        login(); // Generic join/login for demo
        navigate('/app'); // Direct to induction
    };

    const handleCardClick = (discipline) => {
        setActivePanel({ type: 'LAW', discipline });
    };

    const closePanel = () => setActivePanel(null);

    return (
        <div className="public-root" style={{
            maxWidth: '1000px',
            margin: '0 auto',
            padding: '80px 20px',
            color: '#f0f0f0',
            fontFamily: 'var(--font-human)',
            position: 'relative'
        }}>
            <SEOHead
                title="Sovereign Productivity System"
                description="IRON is a private discipline system: software that governs behavior using standing, contracts, and internal laws."
                path="/"
            />

            {/* Overlay Panel UI */}
            {activePanel && (
                <div style={overlayContainerStyle} onClick={closePanel}>
                    <div style={panelWrapperStyle} onClick={e => e.stopPropagation()}>
                        <button onClick={closePanel} style={closeButtonStyle}>CLOSE_SIG</button>
                        <div style={panelBodyContainerStyle}>
                            {activePanel === 'PHILOSOPHY' && <WhatIsIron />}
                            {activePanel === 'SYSTEMS' && <InstitutionalProductivity />}
                            {activePanel === 'SOVEREIGNTY' && <PersonalInstitution />}
                            {activePanel === 'CONSTITUTION' && <ConstitutionPanel />}
                            {activePanel?.type === 'LAW' && (
                                <DisciplineLawPanel
                                    discipline={activePanel.discipline}
                                    isActive={activeModules.includes(activePanel.discipline.id)}
                                    onToggle={handleToggleModule}
                                />
                            )}
                            {activePanel === 'AUTH_REQUIRED' && (
                                <div style={{ textAlign: 'center', padding: '20px' }}>
                                    <h2 style={{ fontFamily: 'var(--font-authority)', color: 'var(--iron-brand-stable)', letterSpacing: '2px' }}>AUTHENTICATION_REQUIRED</h2>
                                    <p style={{ opacity: 0.7, margin: '20px 0' }}>Institutional modules require a sovereign identity. Join the institution to begin your governance.</p>
                                    <button onClick={handleJoin} style={actionStyle}>JOIN_THE_INSTITUTION</button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            <header style={{ marginBottom: '60px', textAlign: 'center', position: 'relative' }}>
                <div style={{ position: 'absolute', top: 0, right: 0 }}>
                    {currentUser ? (
                        <button onClick={logout} style={authButtonStyle}>Citizen_{currentUser.uid.substring(0, 4)} [DISCONNECT]</button>
                    ) : (
                        <button onClick={handleJoin} style={authButtonStyle}>JOIN_THE_INSTITUTION</button>
                    )}
                </div>
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
                        {disciplines.map(d => {
                            const isActive = activeModules.includes(d.id);
                            return (
                                <div key={d.id}
                                    onClick={() => handleCardClick(d)}
                                    style={{
                                        ...cardStyle,
                                        border: isActive ? '1px solid var(--iron-brand-stable)' : '1px solid var(--iron-border)',
                                        background: isActive ? 'rgba(0, 255, 102, 0.05)' : 'rgba(255, 255, 255, 0.03)',
                                        boxShadow: isActive ? '0 0 20px rgba(0, 255, 102, 0.1)' : 'none',
                                        cursor: 'pointer'
                                    }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                        <h3 style={{ margin: 0, color: isActive ? 'var(--iron-brand-stable)' : 'var(--iron-accent)', fontSize: '1.1rem' }}>{d.label}</h3>
                                        <span style={{ fontSize: '0.6rem', opacity: 0.4, letterSpacing: '1px' }}>{d.primaryMetric.toUpperCase()}</span>
                                    </div>
                                    <p style={{ fontSize: '0.85rem', margin: '15px 0 25px 0', opacity: 0.7, lineHeight: '1.5', minHeight: '3em' }}>
                                        {d.focus}
                                    </p>
                                    {/* Action buttons removed from card face */}
                                </div>
                            );
                        })}
                    </div>
                </section>

                <nav style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '30px', borderTop: '1px solid var(--iron-border)', paddingTop: '40px' }}>
                    <div onClick={() => setActivePanel('PHILOSOPHY')} style={navItemStyle}>
                        <span style={{ display: 'block', fontSize: '0.7rem', opacity: 0.5, marginBottom: '5px' }}>01_PHILOSOPHY</span>
                        What is IRON?
                    </div>
                    <div onClick={() => setActivePanel('SYSTEMS')} style={navItemStyle}>
                        <span style={{ display: 'block', fontSize: '0.7rem', opacity: 0.5, marginBottom: '5px' }}>02_SYSTEMS</span>
                        Industrial Strength Productivity?
                    </div>
                    <div onClick={() => setActivePanel('SOVEREIGNTY')} style={navItemStyle}>
                        <span style={{ block: 'block', fontSize: '0.7rem', opacity: 0.5, marginBottom: '5px' }}>03_SOVEREIGNTY</span>
                        What is a Private Discipline?
                    </div>
                    <div onClick={() => setActivePanel('CONSTITUTION')} style={navItemStyle}>
                        <span style={{ display: 'block', fontSize: '0.7rem', opacity: 0.5, marginBottom: '5px' }}>04_CONSTITUTION</span>
                        The Iron Constitution
                    </div>
                    <Link to="/app" style={actionStyle}>GOTO_DASHBOARD</Link>
                </nav>
            </main>
        </div>
    );
};

const navItemStyle = {
    color: 'var(--iron-accent)',
    textDecoration: 'none',
    fontSize: '1.1rem',
    transition: 'opacity 0.2s',
    display: 'block',
    cursor: 'pointer'
};

const overlayContainerStyle = {
    position: 'fixed',
    top: 0, left: 0, right: 0, bottom: 0,
    background: 'rgba(0,0,0,0.85)',
    backdropFilter: 'blur(8px)',
    zIndex: 1000,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px'
};

const panelWrapperStyle = {
    background: 'var(--iron-surface-2)',
    border: '1px solid var(--iron-border)',
    maxWidth: '700px',
    width: '100%',
    maxHeight: '80vh',
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    boxShadow: '0 20px 50px rgba(0,0,0,0.5)'
};

const closeButtonStyle = {
    position: 'absolute',
    top: '-30px',
    right: 0,
    background: 'transparent',
    border: 'none',
    color: 'var(--iron-brand-breach)',
    fontFamily: 'var(--font-mono)',
    fontSize: '0.7rem',
    cursor: 'pointer',
    letterSpacing: '2px'
};

const panelBodyContainerStyle = {
    padding: '40px',
    overflowY: 'auto'
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
    fontSize: '0.9rem',
    cursor: 'pointer',
    width: '100%',
    border: 'none'
};

const authButtonStyle = {
    background: 'transparent',
    border: '1px solid var(--iron-border)',
    color: 'var(--iron-accent)',
    padding: '5px 10px',
    fontSize: '0.6rem',
    fontFamily: 'var(--font-mono)',
    cursor: 'pointer',
    letterSpacing: '1px'
};

