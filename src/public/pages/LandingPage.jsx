import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { SEOHead } from '../SEOHead';
import { getProtocolList, SOVEREIGN_DOMAINS } from '../../wings/legislative/ProtocolRegistry';
import { useSovereignKernel } from '../../spine/context/SovereigntyContext'; // Still needed for writes
import { useKernelProjection } from '../projection/useKernelProjection'; // NEW: KPL Read
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
import { ActiveProtocolSurface } from '../wings/executive/ActiveProtocolSurface';

export const LandingPage = () => {
    const { t } = useTranslation();
    const disciplines = getProtocolList();
    const kernel = useSovereignKernel();  // Command Channel (Write)

    // KPL Consumption (Read-Only)
    const { institution, sovereignty } = useKernelProjection();
    const activeModules = sovereignty.activeLaws || [];

    const navigate = useNavigate();
    const [activePanel, setActivePanel] = useState(null); // 'philosophy' | 'systems' | 'constitution'
    const [activeTag, setActiveTag] = useState('ALL'); // 'ALL' | DomainID
    const [showBuilder, setShowBuilder] = useState(false);
    const [executionMode, setExecutionMode] = useState(null); // Protocol Object if executing
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

    if (executionMode) {
        return (
            <div style={{ position: 'fixed', inset: 0, zIndex: 2000, background: 'var(--iron-infra-void)' }}>
                <ActiveProtocolSurface
                    protocol={executionMode}
                    onClose={() => setExecutionMode(null)}
                />
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
                <div className="landing-auth-container" style={{ display: 'flex', gap: '15px' }}>
                    <button
                        onClick={() => setShowBuilder(true)}
                        className="btn-auth"
                        style={{
                            background: 'transparent',
                            border: '1px solid var(--iron-signal-active)',
                            color: 'var(--iron-signal-active)'
                        }}
                    >
                        LEGISLATURE
                    </button>

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
                    <div style={{ marginTop: '30px' }}>
                        <button
                            onClick={() => setShowBuilder(true)}
                            style={{
                                background: 'transparent',
                                border: '1px solid var(--iron-signal-active)',
                                color: 'var(--iron-signal-active)',
                                padding: '12px 24px',
                                fontFamily: 'var(--font-systemic)',
                                cursor: 'pointer',
                                fontSize: '1rem',
                                letterSpacing: '1px'
                            }}
                        >
                            BUILD SOVEREIGN LAW
                        </button>
                    </div>
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
                        <div className="landing-registry-container">
                            {/* TAG BAR - Sovereign Domains */}
                            <div className="landing-tag-bar" style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '20px', marginBottom: '20px' }}>
                                <button
                                    onClick={() => setActiveTag('ALL')}
                                    style={{
                                        background: activeTag === 'ALL' ? 'var(--iron-signal-active)' : 'transparent',
                                        color: activeTag === 'ALL' ? '#000' : 'var(--iron-text-secondary)',
                                        border: activeTag === 'ALL' ? 'none' : '1px solid var(--iron-structure-border)',
                                        padding: '5px 15px',
                                        borderRadius: '20px',
                                        fontSize: '0.8rem',
                                        cursor: 'pointer',
                                        whiteSpace: 'nowrap',
                                        fontFamily: 'var(--font-systemic)'
                                    }}
                                >
                                    ALL DOMAINS
                                </button>
                                {Object.values(SOVEREIGN_DOMAINS).map(domain => (
                                    <button
                                        key={domain.id}
                                        onClick={() => setActiveTag(domain.id)}
                                        style={{
                                            background: activeTag === domain.id ? 'var(--iron-signal-active)' : 'transparent',
                                            color: activeTag === domain.id ? '#000' : 'var(--iron-text-secondary)',
                                            border: activeTag === domain.id ? 'none' : '1px solid var(--iron-structure-border)',
                                            padding: '5px 15px',
                                            borderRadius: '20px',
                                            fontSize: '0.8rem',
                                            cursor: 'pointer',
                                            whiteSpace: 'nowrap',
                                            fontFamily: 'var(--font-systemic)'
                                        }}
                                    >
                                        {domain.label}
                                    </button>
                                ))}
                            </div>

                            {/* SECTIONS */}

                            {/* 1. LAST USED (Active) */}
                            {activeModules.length > 0 && (activeTag === 'ALL' || disciplines.some(d => activeModules.includes(d.id) && d.domain === activeTag)) && (
                                <div style={{ marginBottom: '40px' }}>
                                    <div style={{ fontFamily: 'var(--font-constitutional)', fontSize: '1rem', color: 'var(--iron-signal-active)', marginBottom: '15px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '5px' }}>
                                        LAST USED (ACTIVE)
                                    </div>
                                    <div className="landing-registry-grid">
                                        {disciplines.filter(d => activeModules.includes(d.id) && (activeTag === 'ALL' || d.domain === activeTag)).map(d => (
                                            <div key={d.id} className="landing-card active" style={{ position: 'relative' }}>
                                                <div onClick={() => handleCardClick(d)}>
                                                    <div className="landing-card-header">
                                                        <h3 className="landing-card-title">{d.label}</h3>
                                                        <span className="landing-card-metric">{(d.primaryMetric || 'UNKNOWN').toUpperCase()}</span>
                                                    </div>
                                                    <div className="landing-card-tag" style={{ fontSize: '0.6rem', color: 'var(--iron-text-tertiary)', marginBottom: '5px' }}>{SOVEREIGN_DOMAINS[d.domain || 'SYSTEM_LOGISTICS']?.label}</div>
                                                    <p className="landing-card-text">{d.focus || d.description}</p>
                                                </div>
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); setExecutionMode(d); }}
                                                    style={{
                                                        width: '100%',
                                                        marginTop: '15px',
                                                        background: 'var(--iron-signal-active)',
                                                        border: 'none',
                                                        padding: '8px',
                                                        cursor: 'pointer',
                                                        fontWeight: 'bold',
                                                        fontFamily: 'var(--font-systemic)'
                                                    }}
                                                >
                                                    EXECUTE PROTOCOL
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* 2. POPULAR (Top 5 by User Count) */}
                            <div style={{ marginBottom: '40px' }}>
                                <div style={{ fontFamily: 'var(--font-constitutional)', fontSize: '1rem', color: 'var(--iron-text-primary)', marginBottom: '15px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '5px' }}>
                                    POPULAR
                                </div>
                                <div className="landing-registry-grid">
                                    {disciplines
                                        .filter(d => activeTag === 'ALL' || d.domain === activeTag)
                                        .sort((a, b) => b.userCount - a.userCount)
                                        .slice(0, 5)
                                        .map(d => (
                                            <div key={d.id} onClick={() => handleCardClick(d)} className={`landing-card ${activeModules.includes(d.id) ? 'active' : ''}`}>
                                                <div className="landing-card-header">
                                                    <h3 className="landing-card-title">{d.label}</h3>
                                                    <span className="landing-card-metric">{(d.primaryMetric || 'UNKNOWN').toUpperCase()}</span>
                                                </div>
                                                <div className="landing-card-tag" style={{ fontSize: '0.6rem', color: 'var(--iron-text-tertiary)', marginBottom: '5px' }}>{SOVEREIGN_DOMAINS[d.domain || 'SYSTEM_LOGISTICS']?.label}</div>
                                                <p className="landing-card-text">{d.focus || d.description}</p>
                                            </div>
                                        ))}
                                </div>
                            </div>

                            {/* 3. LATEST (Mock Reverse + Domain Filter) */}
                            <div style={{ marginBottom: '40px' }}>
                                <div style={{ fontFamily: 'var(--font-constitutional)', fontSize: '1rem', color: 'var(--iron-text-primary)', marginBottom: '15px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '5px' }}>
                                    LATEST
                                </div>
                                <div className="landing-registry-grid">
                                    {[...disciplines].reverse()
                                        .filter(d => activeTag === 'ALL' || d.domain === activeTag)
                                        .slice(0, 5)
                                        .map(d => (
                                            <div key={d.id} onClick={() => handleCardClick(d)} className={`landing-card ${activeModules.includes(d.id) ? 'active' : ''}`}>
                                                <div className="landing-card-header">
                                                    <h3 className="landing-card-title">{d.label}</h3>
                                                    <span className="landing-card-metric">{(d.primaryMetric || 'UNKNOWN').toUpperCase()}</span>
                                                </div>
                                                <div className="landing-card-tag" style={{ fontSize: '0.6rem', color: 'var(--iron-text-tertiary)', marginBottom: '5px' }}>{SOVEREIGN_DOMAINS[d.domain || 'SYSTEM_LOGISTICS']?.label}</div>
                                                <p className="landing-card-text">{d.focus || d.description}</p>
                                            </div>
                                        ))}
                                </div>
                            </div>

                        </div>
                    )}
                </section>

            </main>

            <footer style={{ marginTop: '60px', paddingBottom: '40px', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '20px' }}>
                <LanguageSwitcher />
            </footer>
        </div >
    );
};
