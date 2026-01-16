import React from 'react';

export const DisciplineLawPanel = ({ discipline, isActive, onToggle }) => {
    if (!discipline || !discipline.law) return <div>NO_LAW_FOUND</div>;

    const { law } = discipline;

    return (
        <div style={panelBodyStyle}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                <h1 style={titleStyle}>{law.title}</h1>
                <div style={{ marginLeft: '20px' }}>
                    {isActive ? (
                        <button
                            onClick={(e) => onToggle(e, discipline.id)}
                            style={{ ...activateButtonStyle, borderColor: 'var(--iron-brand-breach)', color: 'var(--iron-brand-breach)' }}
                        >
                            SUSPEND PROTOCOL
                        </button>
                    ) : (
                        <button
                            onClick={(e) => onToggle(e, discipline.id)}
                            style={activateButtonStyle}
                        >
                            ACTIVATE PROTOCOL
                        </button>
                    )}
                </div>
            </div>

            <p style={{ opacity: 0.6, fontSize: '0.8rem', marginBottom: '30px', letterSpacing: '1px' }}>{law.preamble}</p>

            {law.articles && law.articles.map((article, idx) => (
                <section key={idx} style={sectionStyle}>
                    <h2 style={{ fontSize: '1.1rem', color: 'var(--iron-accent)', marginBottom: '10px' }}>
                        Article {idx + 1} — {article.title}
                    </h2>
                    <p>{article.content}</p>
                </section>
            ))}

            <div style={{ marginTop: '40px', padding: '20px', border: '1px solid var(--iron-brand-stable)', background: 'rgba(0, 255, 102, 0.05)' }}>
                <p style={{ margin: 0, fontSize: '0.9rem', textAlign: 'center' }}>
                    <strong>Closing Declaration:</strong> Once entered, the institution is authoritative.
                    It promises truthful, continuous, and governed life.
                </p>
            </div>
        </div>
    );
};

const activateButtonStyle = {
    background: 'transparent',
    border: '1px solid var(--iron-brand-stable)',
    color: 'var(--iron-brand-stable)',
    padding: '10px 20px',
    cursor: 'pointer',
    fontSize: '0.8rem',
    fontWeight: 'bold',
    letterSpacing: '2px',
    transition: 'all 0.2s',
    fontFamily: 'var(--font-mono)'
};

const panelBodyStyle = { color: '#f0f0f0', maxWidth: '100%', paddingBottom: '40px' };
const titleStyle = { fontFamily: 'var(--font-authority)', fontSize: '1.5rem', borderBottom: '2px solid var(--iron-brand-stable)', paddingBottom: '10px', marginTop: 0, marginBottom: '5px' };
const sectionStyle = { lineHeight: '1.7', margin: '30px 0' };
