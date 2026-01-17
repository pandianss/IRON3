import React, { useState } from 'react';
import { ProtocolBuilderSurface } from './builder/ProtocolBuilderSurface';
import { getProtocolList, registerProtocol } from './ProtocolRegistry';
import { validateProtocolJSON } from './builder/ProtocolCompiler';

// IVC-01 Styles
const containerStyle = {
    background: 'var(--iron-infra-void)',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    color: 'var(--iron-text-primary)',
    fontFamily: 'var(--font-institutional)',
    overflowY: 'auto'
};

const headerBar = {
    padding: '20px',
    borderBottom: '1px solid var(--iron-structure-border)',
    background: 'var(--iron-infra-base)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 10
};

const sectionTitle = {
    fontFamily: 'var(--font-constitutional)',
    fontSize: '1.2rem',
    color: 'var(--iron-signal-active)',
    marginBottom: '20px',
    borderBottom: '1px solid var(--iron-structure-border)',
    paddingBottom: '10px',
    marginTop: '40px'
};

const gridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '20px'
};

const cardStyle = {
    background: 'var(--iron-infra-panel)',
    border: '1px solid var(--iron-structure-border)',
    padding: '20px',
    cursor: 'pointer',
    transition: 'all 0.2s'
};

const cardMetric = {
    fontSize: '0.7rem',
    color: 'var(--iron-text-tertiary)',
    fontFamily: 'var(--font-systemic)',
    letterSpacing: '1px',
    marginBottom: '10px',
    display: 'block'
};

export const LegislatureSurface = ({ onClose }) => {
    // Force re-render on update
    const [lastUpdate, setLastUpdate] = useState(Date.now());

    const protocols = getProtocolList();
    const official = protocols.filter(p => p.category === 'OFFICIAL');
    const popular = protocols.filter(p => p.category === 'POPULAR');
    const privateLaws = protocols.filter(p => p.category === 'PRIVATE');

    // Mock Favorites
    const favorites = [];

    const handleImport = () => {
        const jsonStr = prompt("PASTE PROTOCOL MANIFEST (JSON):");
        if (!jsonStr) return;

        try {
            const protocol = JSON.parse(jsonStr);
            const validation = validateProtocolJSON(protocol);

            if (!validation.valid) {
                alert("IMPORT REJECTED: " + validation.error);
                return;
            }

            registerProtocol(protocol);
            setLastUpdate(Date.now()); // Trigger refresh
            alert("PROTOCOL RATIFIED: " + protocol.title);
        } catch (e) {
            alert("INVALID MANIFEST: " + e.message);
        }
    };

    return (
        <div style={containerStyle}>
            {/* Header */}
            <div style={headerBar}>
                <div style={{ fontFamily: 'var(--font-constitutional)', fontSize: '1.5rem' }}>SOVEREIGN LEGISLATURE</div>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                        onClick={handleImport}
                        style={{ background: 'var(--iron-signal-active)', border: 'none', color: '#000', padding: '8px 16px', cursor: 'pointer', fontFamily: 'var(--font-systemic)', fontWeight: 'bold' }}
                    >
                        IMPORT LAW
                    </button>
                    <button
                        onClick={onClose}
                        style={{ background: 'transparent', border: '1px solid var(--iron-brand-breach)', color: 'var(--iron-brand-breach)', padding: '8px 16px', cursor: 'pointer', fontFamily: 'var(--font-systemic)' }}
                    >
                        CLOSE
                    </button>
                </div>
            </div>

            {/* Builder Zone (Prominent) */}
            <div style={{ height: '60vh', borderBottom: '4px solid var(--iron-structure-border)' }}>
                <ProtocolBuilderSurface embedded={true} />
            </div>

            {/* Marketplace */}
            <div style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto', width: '100%' }}>

                {/* Favorites */}
                <div style={sectionTitle}>FAVORITE PROTOCOLS</div>
                {favorites.length > 0 ? (
                    <div style={gridStyle}>
                        {/* Render favorites */}
                    </div>
                ) : (
                    <div style={{ opacity: 0.5, border: '1px dashed var(--iron-infra-border)', padding: '20px', textAlign: 'center', fontSize: '0.8rem' }}>
                        No protocols pinned to favorites.
                    </div>
                )}

                {/* Official */}
                <div style={sectionTitle}>OFFICIAL PROTOCOLS</div>
                <div style={gridStyle}>
                    {official.map(p => (
                        <div key={p.id} style={cardStyle} className="legislature-card">
                            <span style={cardMetric}>USERS: {p.userCount.toLocaleString()}</span>
                            <h3 style={{ margin: '0 0 10px 0', fontSize: '1.1rem', color: 'var(--iron-text-primary)' }}>{p.label}</h3>
                            <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--iron-text-secondary)', lineHeight: '1.5' }}>{p.focus}</p>
                        </div>
                    ))}
                </div>

                {/* Private / Imported */}
                {privateLaws.length > 0 && (
                    <>
                        <div style={sectionTitle}>PRIVATE LAWS (IMPORTED)</div>
                        <div style={gridStyle}>
                            {privateLaws.map(p => (
                                <div key={p.id} style={cardStyle} className="legislature-card">
                                    <span style={{ ...cardMetric, color: 'var(--iron-signal-risk)' }}>PRIVATE • CUSTOM</span>
                                    <h3 style={{ margin: '0 0 10px 0', fontSize: '1.1rem', color: 'var(--iron-text-primary)' }}>{p.title || p.label}</h3>
                                    <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--iron-text-secondary)', lineHeight: '1.5' }}>
                                        {p.requirements?.length} Constraints
                                    </p>
                                </div>
                            ))}
                        </div>
                    </>
                )}

                {/* Popular */}
                <div style={sectionTitle}>POPULAR BY CONSENSUS</div>
                <div style={gridStyle}>
                    {popular.map(p => (
                        <div key={p.id} style={cardStyle} className="legislature-card">
                            <span style={cardMetric}>USERS: {p.userCount.toLocaleString()}</span>
                            <h3 style={{ margin: '0 0 10px 0', fontSize: '1.1rem', color: 'var(--iron-text-primary)' }}>{p.label}</h3>
                            <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--iron-text-secondary)', lineHeight: '1.5' }}>{p.focus}</p>
                        </div>
                    ))}
                </div>

            </div>
        </div>
    );
};
