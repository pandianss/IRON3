import React from 'react';
import { Link } from 'react-router-dom';
import { SEOHead } from '../SEOHead';
import { getTemplateList } from '../../domain/InstitutionalTemplates';

export const InstitutionalCatalog = () => {
    const templates = getTemplateList();

    return (
        <article className="public-page" style={pageStyle}>
            <SEOHead
                title="Institutional Catalog"
                description="Explore the types of personal institutions you can run on IRON: Discipline, Fitness, Creativity, and more."
                path="/catalog"
            />

            <header style={{ marginBottom: '60px' }}>
                <Link to="/" style={{ color: 'var(--iron-text-secondary)', fontSize: '0.8rem', textDecoration: 'none' }}>← BACK TO ROOT</Link>
                <h1 style={titleStyle}>The Institutional Catalog</h1>
                <p style={{ opacity: 0.6 }}>What kind of institution will you build?</p>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
                {templates.map(t => (
                    <div key={t.id} style={cardStyle}>
                        <h3 style={{ borderBottom: '1px solid var(--iron-border)', paddingBottom: '10px', color: 'var(--iron-accent)' }}>
                            {t.label}
                        </h3>
                        <p style={{ fontSize: '0.9rem', lineHeight: '1.6', opacity: 0.8 }}>{t.focus}</p>
                        <div style={{ marginTop: '20px', fontSize: '0.7rem', fontFamily: 'var(--font-mono)', opacity: 0.5 }}>
                            PRIMARY_METRIC: {t.primaryMetric}
                        </div>
                    </div>
                ))}
            </div>

            <footer style={{ marginTop: '80px', borderTop: '1px solid var(--iron-border)', paddingTop: '40px', textAlign: 'center' }}>
                <p style={{ opacity: 0.6 }}>These templates are governed by the same Institutional Kernel.</p>
                <Link to="/app" style={actionStyle}>Begin Your Induction</Link>
            </footer>
        </article>
    );
};

const pageStyle = { maxWidth: '1000px', margin: '0 auto', padding: '60px 20px', color: '#f0f0f0' };
const titleStyle = { fontFamily: 'var(--font-authority)', fontSize: '3rem', margin: '20px 0 10px 0' };
const cardStyle = {
    background: 'var(--iron-surface-2)',
    padding: '30px',
    border: '1px solid var(--iron-border)',
    transition: 'transform 0.2s',
    cursor: 'default'
};
const actionStyle = {
    display: 'inline-block',
    padding: '15px 40px',
    background: 'var(--iron-brand-stable)',
    color: '#000',
    textDecoration: 'none',
    fontWeight: 'bold',
    fontFamily: 'var(--font-authority)',
    marginTop: '20px'
};
