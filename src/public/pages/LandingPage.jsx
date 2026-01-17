import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { SEOHead } from '../SEOHead';
import { getProtocolList } from '../../wings/legislative/ProtocolRegistry';
import { useSovereignKernel, useInstitutionalSnapshot } from '../../spine/context/SovereigntyContext';
import { useAuth } from '../../spine/context/AuthContext';
import '../../ui/styles/landing.css';

// Floating Panels
import { WhatIsIron } from './WhatIsIron';
import { InstitutionalProductivity } from './InstitutionalProductivity';
import { PersonalInstitution } from './PersonalInstitution';
import { DisciplineLawPanel } from './DisciplineLawPanel';

import { ConstitutionPanel } from './ConstitutionPanel';
import { LanguageSwitcher } from './LanguageSwitcher';
import { LegislatureSurface } from '../../wings/legislative/LegislatureSurface';

export const LandingPage = () => {
    const { t } = useTranslation();
    const disciplines = getProtocolList();
    const kernel = useSovereignKernel();
    const snapshot = useInstitutionalSnapshot();
    const activeModules = snapshot?.activeModules || [];

    const navigate = useNavigate();
    const [activePanel, setActivePanel] = useState(null); // 'philosophy' | 'systems' | 'constitution'
    const [showBuilder, setShowBuilder] = useState(false);
    const { currentUser, login, logout } = useAuth();
    const isAuthenticated = !!currentUser;

    const handleToggleModule = async (e, id) => {
        if (e) e.stopPropagation();

        if (!isAuthenticated) {
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

    if (showBuilder) {
        return (
            <div style={{ position: 'fixed', inset: 0, zIndex: 2000, background: 'var(--iron-infra-void)' }}>
                <LegislatureSurface onClose={() => setShowBuilder(false)} />
            </div>
        );
    }

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
                        <button onClick={closePanel} className="btn-close">{t('landing.action.close')}</button>
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
                                    <h2 style={{ fontFamily: 'var(--font-authority)', color: 'var(--iron-brand-stable)', letterSpacing: '2px' }}>
                                        {t('landing.auth.required_title')}
                                    </h2>
                                    <p style={{ opacity: 0.7, margin: '20px 0' }}>
                                        {t('landing.auth.required_text')}
                                    </p>
                                    <button onClick={handleJoin} className="btn-action">{t('landing.auth.initiate')}</button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            <header className="landing-header">
                <div className="landing-auth-container">
                    {currentUser ? (
                        <button onClick={logout} className="btn-auth">
                            {t('landing.auth.disconnect', { id: currentUser.uid.substring(0, 4) })}
                        </button>
                    ) : (
                        <button onClick={handleJoin} className="btn-auth">{t('landing.auth.initiate')}</button>
                    )}
                </div>
                <h1 className="landing-title">{t('landing.title')}</h1>
                <p className="landing-subtitle">{t('landing.subtitle')}</p>
            </header>

            <main>
                <section className="landing-section-hero">
                    <h2 className="landing-hero-head">{t('landing.hero.head')}</h2>
                    <p className="landing-hero-text">
                        {t('landing.hero.text')}
                    </p>
                </section>

                <section className="landing-section-registry">
                    <h2 className="landing-section-head">
                        {t('landing.registry.head')}
                    </h2>

                    {!currentUser ? (
                        <div className="landing-registry-lock">
                            <div className="landing-lock-icon">🔒</div>
                            <div className="landing-lock-title">{t('landing.registry.classified_title')}</div>
                            <div className="landing-lock-text">
                                {t('landing.registry.classified_text').split('\n').map((line, i) => (
                                    <React.Fragment key={i}>
                                        {line}
                                        <br />
                                    </React.Fragment>
                                ))}
                            </div>
                            <button onClick={handleJoin} className="btn-action" style={{ marginTop: '20px', width: 'auto' }}>
                                {t('landing.registry.authenticate')}
                            </button>
                        </div>
                    ) : (
                        disciplines.length > 0 ? (
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
                        ) : (
                            <div style={{ textAlign: 'center', padding: '60px', opacity: 0.5, border: '1px dashed var(--iron-infra-border)' }}>
                                <div style={{ fontSize: '2rem', marginBottom: '20px' }}>∅</div>
                                <div style={{ fontFamily: 'var(--font-authority)', letterSpacing: '2px' }}>{t('landing.registry.empty_title')}</div>
                                <div style={{ marginTop: '10px' }}>{t('landing.registry.empty_text')}</div>
                            </div>
                        )
                    )}
                </section>

                <nav className="landing-nav">
                    <div onClick={() => setActivePanel('PHILOSOPHY')} className="landing-nav-item">
                        <span className="landing-nav-label">01_PHILOSOPHY</span>
                        {t('landing.nav.philosophy')}
                    </div>
                    <div onClick={() => setActivePanel('SYSTEMS')} className="landing-nav-item">
                        <span className="landing-nav-label">02_SYSTEMS</span>
                        {t('landing.nav.systems')}
                    </div>
                    <div onClick={() => setActivePanel('SOVEREIGNTY')} className="landing-nav-item">
                        <span className="landing-nav-label">03_SOVEREIGNTY</span>
                        {t('landing.nav.sovereignty')}
                    </div>
                    <a className="landing-nav-item" onClick={() => setActivePanel('CONSTITUTION')}>
                        <span className="landing-nav-label">04_CONSTITUTION</span>
                        {t('landing.nav.constitution')}
                    </a>

                    <a className="landing-nav-item" onClick={() => setShowBuilder(true)} style={{ color: 'var(--iron-signal-active)' }}>
                        <span className="landing-nav-label">LEGISLATURE</span>
                        IX. PROTOCOL BUILDER
                    </a>
                </nav>

            </main>

            <footer style={{ marginTop: '60px', paddingBottom: '40px', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '20px' }}>
                <LanguageSwitcher />
            </footer>
        </div>
    );
};
