import React from 'react';
import { useTranslation, Trans } from 'react-i18next';

export const ConstitutionPanel = () => {
    const { t } = useTranslation();

    const articles = [];
    for (let i = 1; i <= 10; i++) {
        articles.push({
            id: i,
            title: t(`landing.panels.constitution.articles.${i}.title`),
            content: t(`landing.panels.constitution.articles.${i}.content`)
        });
    }

    return (
        <div style={{ color: '#f0f0f0', maxWidth: '100%', paddingBottom: '40px' }}>
            <h1 style={{ fontFamily: 'var(--font-authority)', fontSize: '2rem', borderBottom: '2px solid var(--iron-brand-stable)', paddingBottom: '20px', marginBottom: '30px' }}>
                {t('landing.panels.constitution.title')}
            </h1>

            <section style={{ marginBottom: '40px', fontStyle: 'italic', opacity: 0.8, borderLeft: '3px solid var(--iron-accent)', paddingLeft: '20px' }}>
                <p>{t('landing.panels.constitution.intro_1')}</p>
                <p>{t('landing.panels.constitution.intro_2')}</p>
            </section>

            {articles.map((article) => (
                <Article key={article.id} title={article.title}>
                    {article.content}
                </Article>
            ))}

            <div style={{ marginTop: '60px', textAlign: 'center', opacity: 0.5, fontSize: '0.8rem' }}>
                <p>{t('landing.panels.constitution.footer_1')}</p>
                <p>{t('landing.panels.constitution.footer_2')}</p>
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
