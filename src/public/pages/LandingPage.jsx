import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { SEOHead } from '../SEOHead';
import { getProtocolList } from '../../wings/legislative/ProtocolRegistry';
import { useSovereignKernel, useInstitutionalSnapshot } from '../../spine/context/SovereigntyContext';
import { useAuth } from '../../spine/context/AuthContext';

// Floating Panels
import { WhatIsIron } from './WhatIsIron';
import { InstitutionalProductivity } from './InstitutionalProductivity';
import { PersonalInstitution } from './PersonalInstitution';
import { DisciplineLawPanel } from './DisciplineLawPanel';

import { ConstitutionPanel } from './ConstitutionPanel';

export const LandingPage = () => {
    const disciplines = getProtocolList();
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
        <div className="landing-root">
            <SEOHead
                title="Sovereign Productivity System"
                description="IRON is a private sovereignty system: software that governs behavior using standing, contracts, and internal laws."
                path="/"
            />

            {/* Overlay Panel UI */}
            {activePanel && (
                <div className="landing-overlay" onClick={closePanel}>
                    <div className="landing-panel" onClick={e => e.stopPropagation()}>
                        <button onClick={closePanel} className="btn-close">CLOSE_SIG</button>
                        <div className="landing-panel-body">
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
                                    <h2 style={{ fontFamily: 'var(--font-authority)', color: 'var(--iron-brand-stable)', letterSpacing: '2px' }}>AUTHORITY_REQUIRED</h2>
                                    <p style={{ opacity: 0.7, margin: '20px 0' }}>Sovereign modules require an assertive identity. Initiate your sovereignty to begin.</p>
                                    <button onClick={handleJoin} className="btn-action">INITIATE_SOVEREIGNTY</button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            <header className="landing-header">
                <div className="landing-auth-container">
                    {currentUser ? (
                        <button onClick={logout} className="btn-auth">Sovereign_{currentUser.uid.substring(0, 4)} [DISCONNECT]</button>
                    ) : (
                        <button onClick={handleJoin} className="btn-auth">INITIATE_SOVEREIGNTY</button>
                    )}
                </div>
                <h1 className="landing-title">IRON</h1>
                <p className="landing-subtitle">Sovereign Discipline System</p>
            </header>

            <main>
                <section className="landing-section-hero">
                    <h2 className="landing-hero-head">Sovereignty is a technical problem.</h2>
                    <p className="landing-hero-text">
                        Most productivity tools ask you to be motivated. IRON asks you to be governed.
                        Activate specialized protocols to transform your commitments into sovereign law.
                    </p>
                </section>

                <section className="landing-section-registry">
                    <h2 className="landing-section-head">
                        PROTOCOL REGISTRY
                    </h2>
                    <div className="landing-registry-grid">
                        {disciplines.map(d => {
                            const isActive = activeModules.includes(d.id);
                            const cardClass = isActive ? "landing-card active" : "landing-card";
                            return (
                                <div key={d.id}
                                    onClick={() => handleCardClick(d)}
                                    className={cardClass}>
                                    <div className="landing-card-header">
                                        <h3 className="landing-card-title">{d.label}</h3>
                                        <span className="landing-card-metric">{d.primaryMetric.toUpperCase()}</span>
                                    </div>
                                    <p className="landing-card-text">
                                        {d.focus}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                </section>

                <nav className="landing-nav">
                    <div onClick={() => setActivePanel('PHILOSOPHY')} className="landing-nav-item">
                        <span className="landing-nav-label">01_PHILOSOPHY</span>
                        What is IRON?
                    </div>
                    <div onClick={() => setActivePanel('SYSTEMS')} className="landing-nav-item">
                        <span className="landing-nav-label">02_SYSTEMS</span>
                        Industrial Strength Productivity?
                    </div>
                    <div onClick={() => setActivePanel('SOVEREIGNTY')} className="landing-nav-item">
                        <span className="landing-nav-label">03_SOVEREIGNTY</span>
                        What is a Private Discipline?
                    </div>
                    <div onClick={() => setActivePanel('CONSTITUTION')} className="landing-nav-item">
                        <span className="landing-nav-label">04_CONSTITUTION</span>
                        The Iron Constitution
                    </div>
                </nav>

                <div className="landing-action-container">
                    <Link to="/app" className="btn-action">GOTO_DASHBOARD</Link>
                </div>
            </main>
        </div>
    );
};
