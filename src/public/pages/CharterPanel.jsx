import React from 'react';
import { useTranslation } from 'react-i18next';

export const CharterPanel = () => {
    const { t } = useTranslation();

    const articles = [];
    for (let i = 1; i <= 10; i++) {
        const articleKey = `landing.panels.charter.articles.${i}`;
        articles.push({
            id: i,
            title: t(`${articleKey}.title`),
            content: t(`${articleKey}.content`),
            functions: t(`${articleKey}.functions`, { returnObjects: true }),
            rules: t(`${articleKey}.rules`, { returnObjects: true }),
            principles: t(`${articleKey}.principles`, { returnObjects: true }),
            to_enter: t(`${articleKey}.to_enter`, { returnObjects: true }),
            issued: t(`${articleKey}.issued`, { returnObjects: true }),
            standing: t(`${articleKey}.standing`, { returnObjects: true }),
            recovery: t(`${articleKey}.recovery`, { returnObjects: true }),
            nature: t(`${articleKey}.nature`, { returnObjects: true }),
            purpose: t(`${articleKey}.purpose`, { returnObjects: true }),
            footer: t(`${articleKey}.footer`)
        });
    }

    return (
        <div className="charter-container" style={containerStyle}>
            <header style={headerStyle}>
                <h1 style={titleStyle}>{t('landing.panels.charter.title')}</h1>
                <p style={subtitleStyle}>{t('landing.panels.charter.subtitle')}</p>
            </header>

            <section style={preambleStyle}>
                <h2 style={sectionHeaderStyle}>PREAMBLE</h2>
                {Object.values(t('landing.panels.charter.preamble', { returnObjects: true })).map((line, i) => (
                    <p key={i} style={textStyle}>{line}</p>
                ))}
            </section>

            <div style={dividerStyle} />

            {articles.map((article) => (
                <article key={article.id} style={articleStyle}>
                    <h2 style={articleTitleStyle}>{article.title}</h2>
                    <p style={textStyle}>{article.content}</p>

                    {Array.isArray(article.functions) && (
                        <ul style={listStyle}>
                            {article.functions.map((item, i) => <li key={i}>{item}</li>)}
                        </ul>
                    )}

                    {Array.isArray(article.rules) && (
                        <ul style={listStyle}>
                            {article.rules.map((item, i) => <li key={i}>{item}</li>)}
                        </ul>
                    )}

                    {Array.isArray(article.principles) && (
                        <ul style={listStyle}>
                            {article.principles.map((item, i) => (
                                <li key={i} dangerouslySetInnerHTML={{ __html: item.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
                            ))}
                        </ul>
                    )}

                    {Array.isArray(article.to_enter) && (
                        <div style={{ marginTop: '10px' }}>
                            <strong style={subLabelStyle}>To enter IRON is to:</strong>
                            <ul style={listStyle}>
                                {article.to_enter.map((item, i) => <li key={i}>{item}</li>)}
                            </ul>
                        </div>
                    )}

                    {Array.isArray(article.issued) && (
                        <div style={{ marginTop: '10px' }}>
                            <strong style={subLabelStyle}>Upon entry, the subject is issued:</strong>
                            <ul style={listStyle}>
                                {article.issued.map((item, i) => <li key={i}>{item}</li>)}
                            </ul>
                        </div>
                    )}

                    {article.nature && Array.isArray(article.nature) && (
                        <div style={{ marginTop: '10px' }}>
                            <strong style={subLabelStyle}>The ledger is:</strong>
                            <ul style={listStyle}>
                                {article.nature.map((item, i) => <li key={i}>{item}</li>)}
                            </ul>
                        </div>
                    )}

                    {article.standing && (
                        <div style={{ marginTop: '10px' }}>
                            {Array.isArray(article.standing.represents) && (
                                <>
                                    <strong style={subLabelStyle}>Standing represents:</strong>
                                    <ul style={listStyle}>
                                        {article.standing.represents.map((item, i) => <li key={i}>{item}</li>)}
                                    </ul>
                                </>
                            )}
                            {Array.isArray(article.standing.states) && (
                                <>
                                    <strong style={subLabelStyle}>Standing can be:</strong>
                                    <ul style={listStyle}>
                                        {article.standing.states.map((item, i) => <li key={i}>{item}</li>)}
                                    </ul>
                                </>
                            )}
                        </div>
                    )}

                    {Array.isArray(article.recovery) && (
                        <div style={{ marginTop: '10px' }}>
                            <strong style={subLabelStyle}>Recovery requires:</strong>
                            <ul style={listStyle}>
                                {article.recovery.map((item, i) => <li key={i}>{item}</li>)}
                            </ul>
                        </div>
                    )}

                    {Array.isArray(article.purpose) && (
                        <ul style={listStyle}>
                            {article.purpose.map((item, i) => <li key={i}>{item}</li>)}
                        </ul>
                    )}

                    {article.footer && article.footer !== articleKey + '.footer' && (
                        <p style={footerTextStyle}>{article.footer}</p>
                    )}
                </article>
            ))}

            <div style={dividerStyle} />

            <section style={closingStyle}>
                <h2 style={sectionHeaderStyle}>CLOSING STATEMENT</h2>
                {Object.values(t('landing.panels.charter.closing', { returnObjects: true })).map((line, i) => (
                    <p key={i} style={{ ...textStyle, textAlign: 'center', fontWeight: i === 0 ? 'bold' : 'normal' }}>{line}</p>
                ))}
            </section>
        </div>
    );
};

const containerStyle = {
    color: 'var(--iron-text-primary)',
    maxWidth: '800px',
    margin: '0 auto',
    padding: '40px 20px',
    fontFamily: 'var(--font-institutional)',
    lineHeight: '1.6'
};

const headerStyle = {
    textAlign: 'center',
    marginBottom: '60px',
    borderBottom: '1px solid var(--iron-structure-border)',
    paddingBottom: '30px'
};

const titleStyle = {
    fontFamily: 'var(--font-constitutional)',
    fontSize: '2.5rem',
    letterSpacing: '2px',
    color: 'var(--iron-signal-active)',
    marginBottom: '10px',
    textTransform: 'uppercase'
};

const subtitleStyle = {
    fontFamily: 'var(--font-systemic)',
    fontSize: '1rem',
    color: 'var(--iron-text-secondary)',
    letterSpacing: '4px'
};

const preambleStyle = {
    marginBottom: '40px'
};

const sectionHeaderStyle = {
    fontFamily: 'var(--font-systemic)',
    fontSize: '0.9rem',
    color: 'var(--iron-text-tertiary)',
    letterSpacing: '3px',
    marginBottom: '20px',
    textAlign: 'center'
};

const articleStyle = {
    marginBottom: '50px',
    paddingLeft: '20px',
    borderLeft: '1px solid var(--iron-structure-border-dim)'
};

const articleTitleStyle = {
    fontFamily: 'var(--font-constitutional)',
    fontSize: '1.4rem',
    color: 'var(--iron-signal-active)',
    marginBottom: '15px'
};

const textStyle = {
    fontSize: '1.05rem',
    marginBottom: '15px',
    opacity: 0.9
};

const listStyle = {
    paddingLeft: '20px',
    marginBottom: '15px',
    listStyleType: 'square',
    color: 'var(--iron-text-secondary)'
};

const subLabelStyle = {
    display: 'block',
    fontSize: '0.9rem',
    color: 'var(--iron-text-primary)',
    marginBottom: '5px',
    textTransform: 'uppercase',
    letterSpacing: '1px'
};

const footerTextStyle = {
    fontSize: '0.95rem',
    fontStyle: 'italic',
    marginTop: '15px',
    color: 'var(--iron-text-secondary)',
    borderTop: '1px solid var(--iron-structure-border-dim)',
    paddingTop: '10px'
};

const dividerStyle = {
    height: '1px',
    background: 'linear-gradient(90deg, transparent, var(--iron-structure-border), transparent)',
    margin: '40px 0'
};

const closingStyle = {
    marginTop: '60px',
    padding: '30px',
    background: 'var(--iron-infra-panel)',
    border: '1px solid var(--iron-structure-border)',
    borderRadius: 'var(--iron-radius-md)'
};
