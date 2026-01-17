import React from 'react';
import { useTranslation, Trans } from 'react-i18next';

export const WhatIsIron = () => {
    const { t } = useTranslation();

    return (
        <div style={panelBodyStyle}>
            <h1 style={titleStyle}>{t('landing.panels.philosophy.title')}</h1>
            <section style={sectionStyle}>
                <p>
                    <Trans i18nKey="landing.panels.philosophy.intro">
                        IRON is not an app. It is a <strong>Behavioral Governing System</strong>.
                    </Trans>
                </p>
                <p>{t('landing.panels.philosophy.p1')}</p>
                <p>
                    <Trans i18nKey="landing.panels.philosophy.p2">
                        IRON is <strong>mandatory</strong>. It utilizes an internal Institutional State
                        to govern your access to information and features based on your actual performance.
                        It turns your commitments into "Laws" that are monitored by the Institutional Kernel.
                    </Trans>
                </p>
            </section>

            <section style={sectionStyle}>
                <h2>{t('landing.panels.philosophy.principles_title')}</h2>
                <ul style={{ paddingLeft: '20px' }}>
                    <li>
                        <Trans i18nKey="landing.panels.philosophy.principle_1">
                            <strong>Standing:</strong> Your reputation within your own system.
                        </Trans>
                    </li>
                    <li>
                        <Trans i18nKey="landing.panels.philosophy.principle_2">
                            <strong>Contracts:</strong> Explicit, code-enforced behavioral agreements.
                        </Trans>
                    </li>
                    <li>
                        <Trans i18nKey="landing.panels.philosophy.principle_3">
                            <strong>Consequences:</strong> Real-time degradation of the experience when law is breached.
                        </Trans>
                    </li>
                </ul>
            </section>
        </div>
    );
};

const panelBodyStyle = { color: '#f0f0f0', maxWidth: '100%' };
const titleStyle = { fontFamily: 'var(--font-authority)', fontSize: '2rem', borderBottom: '2px solid var(--iron-brand-stable)', paddingBottom: '10px', marginTop: 0 };
const sectionStyle = { lineHeight: '1.7', margin: '20px 0' };

