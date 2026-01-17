import React, { useState, useCallback } from 'react';
import ReactFlow, {
    addEdge,
    Background,
    Controls,
    useNodesState,
    useEdgesState,
    applyNodeChanges,
    applyEdgeChanges
} from 'reactflow';
import 'reactflow/dist/style.css';

import TriggerNode from './nodes/TriggerNode';
import ConstraintNode from './nodes/ConstraintNode';
import VerdictNode from './nodes/VerdictNode';
import DecisionNode from './nodes/DecisionNode';
import { validateProtocolJSON, compileGraphToProtocol } from './ProtocolCompiler';

// ... (Styles remain the same)

const nodeTypes = {
    TRIGGER: TriggerNode,
    CONSTRAINT: ConstraintNode,
    VERDICT: VerdictNode,
    DECISION: DecisionNode
};

// Initial State: A template protocol
const initialNodes = [
    { id: '1', type: 'TRIGGER', position: { x: 250, y: 50 }, data: { label: '06:00 AM' }, style: { borderRadius: '12px', overflow: 'hidden', border: '1px solid rgba(255, 255, 255, 0.2)' } },
    { id: '2', type: 'CONSTRAINT', position: { x: 250, y: 200 }, data: { label: 'Upload Gym Selfie', constraintType: 'PHOTO' }, style: { borderRadius: '12px', overflow: 'hidden', border: '1px solid rgba(255, 255, 255, 0.2)' } },
    { id: '3', type: 'VERDICT', position: { x: 250, y: 350 }, data: { label: 'Grant Streak', verdict: 'GRANT' }, style: { borderRadius: '12px', overflow: 'hidden', border: '1px solid rgba(255, 255, 255, 0.2)' } }
];

const initialEdges = [
    { id: 'e1-2', source: '1', target: '2', animated: true, style: { stroke: 'var(--iron-text-secondary)' } },
    { id: 'e2-3', source: '2', target: '3', animated: true, style: { stroke: 'var(--iron-text-secondary)' } }
];

const emojiPalette = ['🛡️', '⚔️', '⚖️', '👁️', '🔒', '🗝️', '🏛️', '🩸', '🕸️', '⏳', '⚡', '🧠'];

export const ProtocolBuilderSurface = ({ embedded = false }) => {
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
    const [selectedNodeId, setSelectedNodeId] = useState(null);
    const [protocolTitle, setProtocolTitle] = useState("NEW PROTOCOL");
    const [protocolDescription, setProtocolDescription] = useState("Describe the sovereign intent...");
    const [protocolDomain, setProtocolDomain] = useState("BIO_REGIME");

    const onConnect = useCallback((params) => setEdges((eds) => addEdge({ ...params, animated: true, style: { stroke: 'var(--iron-text-secondary)' } }, eds)), [setEdges]);

    const onNodeClick = (e, node) => {
        setSelectedNodeId(node.id);
    };

    const updateLabel = (newLabel) => {
        setNodes((nds) => nds.map((node) => {
            if (node.id === selectedNodeId) {
                return { ...node, data: { ...node.data, label: newLabel } };
            }
            return node;
        }));
    };

    const appendEmoji = (emoji) => {
        const node = nodes.find(n => n.id === selectedNodeId);
        if (node) {
            updateLabel((node.data.label || '') + ' ' + emoji);
        }
    };

    const handleExport = () => {
        try {
            const graph = { nodes, edges };
            // Compile to strictly validated Schema
            const protocol = compileGraphToProtocol(graph, {
                title: protocolTitle,
                description: protocolDescription,
                domain: protocolDomain
            });

            const jsonString = JSON.stringify(protocol, null, 2);
            // Copy to clipboard or download (simulated here with alert)
            alert("PROTOCOL EXPORTED (COPIED TO LOG):\n" + jsonString);
            console.log(jsonString);
        } catch (e) {
            alert("COMPILATION ERROR: " + e.message);
        }
    };

    const deleteNode = () => {
        if (selectedNodeId) {
            if (window.confirm("CONFIRM DESTRUCTION: Are you sure you want to delete this node?")) {
                setNodes((nds) => nds.filter((n) => n.id !== selectedNodeId));
                setEdges((eds) => eds.filter((e) => e.source !== selectedNodeId && e.target !== selectedNodeId));
                setSelectedNodeId(null);
            }
        }
    };

    const onEdgeClick = (evt, edge) => {
        evt.stopPropagation();
        if (window.confirm("CONFIRM UNBINDING: Sever this connection?")) {
            setEdges((eds) => eds.filter((e) => e.id !== edge.id));
        }
    };

    const performAutoLayout = () => {
        const triggers = nodes.filter(n => n.type === 'TRIGGER').map((n, i) => ({ ...n, position: { x: 50, y: 50 + (i * 150) } }));
        const decisions = nodes.filter(n => n.type === 'DECISION').map((n, i) => ({ ...n, position: { x: 350, y: 50 + (i * 200) } }));
        const constraints = nodes.filter(n => n.type === 'CONSTRAINT').map((n, i) => ({ ...n, position: { x: 650, y: 50 + (i * 200) } }));
        const verdicts = nodes.filter(n => n.type === 'VERDICT').map((n, i) => ({ ...n, position: { x: 950, y: 50 + (i * 150) } }));

        setNodes([...triggers, ...decisions, ...constraints, ...verdicts]);
    };

    const addNode = (type) => {
        const id = `${type}_${Date.now()}`;
        const baseData = { verdict: 'GRANT', constraintType: 'INPUT', dataFormat: 'TEXT' };

        // Better Defaults
        if (type === 'TRIGGER') {
            baseData.label = 'Morning Ritual';
            baseData.time = '07:00';
            baseData.description = 'Executes daily';
        } else if (type === 'CONSTRAINT') {
            baseData.label = 'New Constraint';
            baseData.constraintType = 'INPUT';
        } else if (type === 'DECISION') {
            baseData.label = 'Condition?';
        } else {
            baseData.label = 'Final Verdict';
            baseData.verdict = 'GRANT';
        }

        const newNode = {
            id,
            type,
            position: { x: Math.random() * 200 + 100, y: Math.random() * 200 + 100 },
            data: baseData,
            style: { borderRadius: '12px', overflow: 'visible', border: 'none', background: 'transparent' } // Custom Style for Decision
        };
        setNodes((nds) => nds.concat(newNode));
        setSelectedNodeId(id);
    };

    const selectedNode = nodes.find(n => n.id === selectedNodeId);

    return (
        <div style={{ ...surfaceStyle, height: embedded ? '100%' : '100vh', flexDirection: 'row' }}>

            {/* Canvas Area */}
            <div style={{ flex: 1, position: 'relative', display: 'flex', flexDirection: 'column' }}>
                <div style={headerStyle}>

                    {/* LEFT: Identity (Title, Desc) */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
                        <input
                            type="text"
                            value={protocolTitle}
                            onChange={(e) => setProtocolTitle(e.target.value)}
                            placeholder="PROTOCOL TITLE"
                            className="builder-input-title"
                            style={{
                                background: 'rgba(255,255,255,0.03)',
                                border: '1px solid transparent',
                                borderBottom: '1px solid var(--iron-structure-border)',
                                color: 'var(--iron-signal-active)',
                                fontFamily: 'var(--font-constitutional)',
                                fontSize: '1.5rem',
                                width: '100%',
                                padding: '5px 10px',
                                outline: 'none',
                                transition: 'all 0.2s'
                            }}
                            onFocus={(e) => e.target.style.border = '1px solid var(--iron-signal-active)'}
                            onBlur={(e) => e.target.style.border = '1px solid transparent'}
                        />
                        <input
                            type="text"
                            value={protocolDescription}
                            onChange={(e) => setProtocolDescription(e.target.value)}
                            placeholder="Describe the Sovereign Intent..."
                            style={{
                                background: 'transparent',
                                border: '1px solid transparent',
                                borderBottom: '1px solid rgba(255,255,255,0.1)',
                                color: 'var(--iron-text-secondary)',
                                fontFamily: 'var(--font-institutional)',
                                fontSize: '0.9rem',
                                width: '100%',
                                padding: '5px 10px',
                                outline: 'none'
                            }}
                        />
                    </div>

                    {/* RIGHT: Meta & Controls */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '10px', marginLeft: '40px' }}>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <span style={{ fontSize: '0.7rem', color: 'var(--iron-text-tertiary)', fontFamily: 'var(--font-systemic)' }}>DOMAIN SEQUENCE</span>
                            <select
                                value={protocolDomain}
                                onChange={(e) => setProtocolDomain(e.target.value)}
                                style={{
                                    background: 'var(--iron-infra-panel)',
                                    border: '1px solid var(--iron-structure-border)',
                                    color: 'var(--iron-text-secondary)',
                                    fontFamily: 'var(--font-systemic)',
                                    fontSize: '0.8rem',
                                    padding: '5px',
                                    width: '180px',
                                    cursor: 'pointer'
                                }}
                            >
                                <option value="BIO_REGIME">BIO-REGIME</option>
                                <option value="CAPITAL_COMMAND">CAPITAL-COMMAND</option>
                                <option value="PROFESSIONAL_WARFARE">PROFESSIONAL-WARFARE</option>
                                <option value="COGNITIVE_SECURITY">COGNITIVE-SECURITY</option>
                                <option value="SOCIAL_ALLIANCE">SOCIAL-ALLIANCE</option>
                                <option value="SPIRIT_ANCHOR">SPIRIT-ANCHOR</option>
                                <option value="SKILL_ACQUISITION">SKILL-ACQUISITION</option>
                                <option value="SYSTEM_LOGISTICS">SYSTEM-LOGISTICS</option>
                            </select>
                        </div>

                        <div style={toolbarStyle}>
                            <div style={{ display: 'flex', border: '1px solid var(--iron-structure-border)', borderRadius: '4px', overflow: 'hidden' }}>
                                <button style={{ ...btnStyle, border: 'none', borderRight: '1px solid var(--iron-structure-border)' }} onClick={() => addNode('TRIGGER')}>+ TRIGGER</button>
                                <button style={{ ...btnStyle, border: 'none', borderRight: '1px solid var(--iron-structure-border)' }} onClick={() => addNode('DECISION')}>+ DECISION</button>
                                <button style={{ ...btnStyle, border: 'none', borderRight: '1px solid var(--iron-structure-border)' }} onClick={() => addNode('CONSTRAINT')}>+ CONSTRAINT</button>
                                <button style={{ ...btnStyle, border: 'none' }} onClick={() => addNode('VERDICT')}>+ VERDICT</button>
                            </div>

                            <button style={{ ...btnStyle, background: 'var(--iron-infra-void)', color: 'var(--iron-text-secondary)', borderColor: 'var(--iron-text-secondary)', marginLeft: '10px' }} onClick={performAutoLayout}>
                                ORGANIZE
                            </button>

                            <button style={{ ...btnStyle, background: 'var(--iron-infra-void)', color: 'var(--iron-signal-active)', borderColor: 'var(--iron-signal-active)', marginLeft: '10px' }} onClick={handleExport}>
                                EXPORT LAW
                            </button>
                        </div>
                    </div>
                </div>

                <div style={{ flex: 1 }}>
                    <ReactFlow
                        nodes={nodes}
                        edges={edges}
                        onNodesChange={onNodesChange}
                        onEdgesChange={onEdgesChange}
                        onConnect={onConnect}
                        onNodeClick={onNodeClick}
                        onEdgeClick={onEdgeClick}
                        nodeTypes={nodeTypes}
                        fitView
                        style={{ background: 'var(--iron-infra-void)' }}
                    >
                        <Background color="#222" gap={20} />
                        <Controls style={{ fill: 'var(--iron-text-secondary)', background: 'var(--iron-infra-panel)', border: '1px solid var(--iron-structure-border)' }} />
                    </ReactFlow>
                </div>
            </div>

            {/* Inspector Panel (Right Side) */}
            {
                selectedNode && (
                    <div style={{
                        width: '300px',
                        background: 'var(--iron-infra-panel)',
                        borderLeft: '1px solid var(--iron-structure-border)',
                        padding: '20px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '20px'
                    }}>
                        <div style={{ fontFamily: 'var(--font-constitutional)', color: 'var(--iron-signal-active)', borderBottom: '1px solid var(--iron-structure-border)', paddingBottom: '10px' }}>
                            NODE INSPECTOR
                        </div>

                        <div>
                            <div style={{ fontSize: '0.7rem', color: 'var(--iron-text-tertiary)', marginBottom: '5px' }}>ID</div>
                            <div style={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>{selectedNode.id}</div>
                        </div>

                        <div>
                            <div style={{ fontSize: '0.7rem', color: 'var(--iron-text-tertiary)', marginBottom: '5px' }}>LABEL</div>
                            <input
                                type="text"
                                value={selectedNode.data.label}
                                onChange={(e) => updateLabel(e.target.value)}
                                style={{
                                    width: '100%',
                                    background: 'var(--iron-infra-void)',
                                    border: '1px solid var(--iron-structure-border)',
                                    color: 'var(--iron-text-primary)',
                                    padding: '8px',
                                    fontFamily: 'var(--font-institutional)'
                                }}
                            />
                        </div>

                        <div>
                            <div style={{ fontSize: '0.7rem', color: 'var(--iron-text-tertiary)', marginBottom: '5px' }}>SOVEREIGN SYMBOLS</div>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                                {emojiPalette.map(emoji => (
                                    <button
                                        key={emoji}
                                        onClick={() => appendEmoji(emoji)}
                                        style={{
                                            background: 'transparent',
                                            border: '1px solid var(--iron-structure-border)',
                                            color: '#fff',
                                            cursor: 'pointer',
                                            fontSize: '1.2rem',
                                            padding: '5px',
                                            borderRadius: '4px'
                                        }}
                                    >
                                        {emoji}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {selectedNode.type === 'TRIGGER' && (
                            <div>
                                <div style={{ fontSize: '0.7rem', color: 'var(--iron-text-tertiary)', marginBottom: '5px' }}>TRIGGER TIME</div>
                                <input
                                    type="time"
                                    value={selectedNode.data.time || '07:00'}
                                    onChange={(e) => {
                                        setNodes((nds) => nds.map((n) => {
                                            if (n.id === selectedNode.id) {
                                                // Update both time AND label for visibility
                                                return {
                                                    ...n,
                                                    data: {
                                                        ...n.data,
                                                        time: e.target.value,
                                                        label: e.target.value // Auto-update label to match time
                                                    }
                                                };
                                            }
                                            return n;
                                        }));
                                    }}
                                    style={{
                                        width: '100%',
                                        background: 'var(--iron-infra-void)',
                                        border: '1px solid var(--iron-structure-border)',
                                        color: 'var(--iron-signal-active)',
                                        padding: '8px',
                                        fontFamily: 'monospace',
                                        fontSize: '1.2rem',
                                        textAlign: 'center'
                                    }}
                                />
                            </div>
                        )}

                        {selectedNode.type === 'CONSTRAINT' && (
                            <div>
                                <div style={{ fontSize: '0.7rem', color: 'var(--iron-text-tertiary)', marginBottom: '5px' }}>TYPE</div>
                                <select
                                    value={selectedNode.data.constraintType}
                                    onChange={(e) => {
                                        setNodes((nds) => nds.map((n) => {
                                            if (n.id === selectedNode.id) return { ...n, data: { ...n.data, constraintType: e.target.value } };
                                            return n;
                                        }));
                                    }}
                                    style={{ width: '100%', background: 'var(--iron-infra-void)', color: '#fff', border: '1px solid var(--iron-structure-border)', padding: '5px', marginBottom: '10px' }}
                                >
                                    <option value="TIME">TIME DEADLINE</option>
                                    <option value="GPS">GPS LOCATION</option>
                                    <option value="PHOTO">PHOTO EVIDENCE</option>
                                    <option value="TAGS">TAGS & LABELS</option>
                                    <option value="INPUT">DATA INPUT</option>
                                    <option value="BLOCKER">APP BLOCKER</option>
                                </select>

                                {selectedNode.data.constraintType === 'INPUT' && (
                                    <div>
                                        <div style={{ fontSize: '0.7rem', color: 'var(--iron-text-tertiary)', marginBottom: '5px' }}>DATA FORMAT</div>
                                        <select
                                            value={selectedNode.data.dataFormat || 'TEXT'}
                                            onChange={(e) => {
                                                setNodes((nds) => nds.map((n) => {
                                                    if (n.id === selectedNode.id) return { ...n, data: { ...n.data, dataFormat: e.target.value } };
                                                    return n;
                                                }));
                                            }}
                                            style={{ width: '100%', background: 'var(--iron-infra-void)', color: 'var(--iron-signal-active)', border: '1px solid var(--iron-structure-border)', padding: '5px' }}
                                        >
                                            <option value="TEXT">TEXT (Abc)</option>
                                            <option value="NUMBER">NUMBER (123)</option>
                                            <option value="CURRENCY">CURRENCY ($)</option>
                                            <option value="DURATION">DURATION (h:mm)</option>
                                            <option value="BOOLEAN">CHECKBOX (Yes/No)</option>
                                        </select>
                                    </div>
                                )}
                            </div>
                        )}

                        {selectedNode.type === 'VERDICT' && (
                            <div>
                                <div style={{ fontSize: '0.7rem', color: 'var(--iron-text-tertiary)', marginBottom: '5px' }}>VERDICT</div>
                                <select
                                    value={selectedNode.data.verdict}
                                    onChange={(e) => {
                                        setNodes((nds) => nds.map((n) => {
                                            if (n.id === selectedNode.id) return { ...n, data: { ...n.data, verdict: e.target.value } };
                                            return n;
                                        }));
                                    }}
                                    style={{ width: '100%', background: 'var(--iron-infra-void)', color: '#fff', border: '1px solid var(--iron-structure-border)', padding: '5px' }}
                                >
                                    <option value="GRANT">GRANT (VALID)</option>
                                    <option value="DENY">DENY (INVALID)</option>
                                </select>
                            </div>
                        )}

                        <div style={{ marginTop: 'auto', borderTop: '1px solid var(--iron-structure-border)', paddingTop: '20px' }}>
                            <button
                                onClick={deleteNode}
                                style={{
                                    width: '100%',
                                    background: 'var(--iron-brand-breach)', // Red
                                    border: 'none',
                                    color: '#000',
                                    padding: '10px',
                                    cursor: 'pointer',
                                    fontFamily: 'var(--font-systemic)',
                                    fontWeight: 'bold',
                                    letterSpacing: '1px'
                                }}
                            >
                                DELETE NODE
                            </button>
                        </div>
                    </div>
                )
            }
        </div >
    );
};
