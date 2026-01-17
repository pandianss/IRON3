import React, { useState } from 'react';
import { ProtocolBuilderSurface } from '../../runtime/legislative-tools/ProtocolBuilderSurface';
import { getProtocolList, registerProtocol, SOVEREIGN_DOMAINS } from '../../kernel/constitution/ProtocolRegistry';
import { validateProtocolJSON } from '../../runtime/legislative-tools/ProtocolCompiler';

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

    // Group protocols by Domain
    const protocolsByDomain = protocols
        .filter(p => p && (p.domain || p.category)) // Safety Check
        .reduce((acc, p) => {
            const domain = p.domain || 'SYSTEM_LOGISTICS';
            if (!acc[domain]) acc[domain] = [];
            acc[domain].push(p);
            return acc;
        }, {});

    const handleImport = () => {
        const jsonStr = prompt("PASTE PROTOCOL MANIFEST (JSON): \n\nThis will become Sovereign Law.");
        if (!jsonStr) return;

        try {
            const protocol = JSON.parse(jsonStr);
            const validation = validateProtocolJSON(protocol);

            if (!validation.valid) {
                alert("IMPORT REJECTED: " + validation.error);
                return;
            }

            // Register via Registry (which now calls LawArchive)
            if (registerProtocol(protocol)) {
                setLastUpdate(Date.now());
                alert(`PROTOCOL RATIFIED: ${protocol.title}\n\nIt is now Sovereign Law.`);
            } else {
                alert("RATIFICATION FAILED: Persistence Error.");
            }
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

            {/* Builder Zone at TOP */}
            <div style={{ height: '60vh', borderBottom: '4px solid var(--iron-structure-border)' }}>
                <ProtocolBuilderSurface embedded={true} />
            </div>

            {/* Marketplace: Organized by Sovereign Domain */}
            <div style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto', width: '100%' }}>

                {Object.values(SOVEREIGN_DOMAINS).map(domain => {
                    const domainProtocols = protocolsByDomain[domain.id] || [];
                    if (domainProtocols.length === 0) return null;

                    return (
                        <div key={domain.id} style={{ marginBottom: '40px' }}>
                            <div style={sectionTitle}>
                                {domain.label}
                                <span style={{ marginLeft: '10px', fontSize: '0.8rem', color: 'var(--iron-text-tertiary)', fontFamily: 'var(--font-institutional)', textTransform: 'none' }}>
                                    // {domain.description}
                                </span>
                            </div>
                            <div style={gridStyle}>
                                {domainProtocols.map(p => (
                                    <div key={p.id} style={cardStyle} className="legislature-card">
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                                            <span style={cardMetric}>{p.userCount.toLocaleString()} CITIZENS</span>
                                            {p.isCustom && <span style={{ color: 'var(--iron-signal-active)', fontSize: '0.7rem' }}>CUSTOM</span>}
                                        </div>
                                        <h3 style={{ margin: '0 0 10px 0', fontSize: '1.1rem', color: 'var(--iron-text-primary)' }}>{p.title || p.label}</h3>
                                        <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--iron-text-secondary)', lineHeight: '1.5' }}>{p.focus || p.description}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })}

            </div>
        </div>
    );
};
