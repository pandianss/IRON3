import React, { useState, useCallback } from 'react';
import ReactFlow, {
    addEdge,
    Background,
    Controls,
    useNodesState,
    useEdgesState,
    Handle,
    Position
} from 'reactflow';
import 'reactflow/dist/style.css';
import { validateProtocolJSON, compileGraphToProtocol } from './ProtocolCompiler';
import { registerProtocol } from '../../kernel/constitution/ProtocolRegistry';

// --- IVC-01 STRICT STYLES ---

const surfaceStyle = {
    display: 'flex',
    flexDirection: 'column',
    background: 'var(--iron-infra-void)',
    color: 'var(--iron-text-primary)',
    fontFamily: 'var(--font-institutional)',
    overflow: 'hidden',
    height: '100vh'
};

const headerStyle = {
    padding: '16px 24px',
    borderBottom: '1px solid var(--iron-structure-border)',
    background: 'var(--iron-infra-base)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 10
};

const toolbarStyle = {
    display: 'flex',
    gap: '12px',
    alignItems: 'center'
};

const btnStyle = {
    padding: '8px 16px',
    background: 'var(--iron-infra-raised)',
    border: '1px solid var(--iron-structure-border)',
    color: 'var(--iron-text-primary)',
    cursor: 'pointer',
    fontFamily: 'var(--font-systemic)',
    fontSize: '0.75rem',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    borderRadius: '2px',
    outline: 'none',
    transition: 'all 0.2s'
};

// --- SOVEREIGN NODE COMPONENTS ---

const baseNodeStyle = {
    padding: '12px 16px',
    background: 'var(--iron-infra-panel)',
    color: 'var(--iron-text-primary)',
    borderRadius: '2px',
    border: '1px solid var(--iron-structure-border)',
    boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
    fontFamily: 'var(--font-institutional)',
    fontSize: '0.85rem',
    minWidth: '180px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    position: 'relative' // Needed for Handle positioning
};

const TriggerNode = ({ data }) => (
    <div style={{ ...baseNodeStyle, borderLeft: '3px solid var(--iron-signal-active)' }}>
        <div style={{ fontSize: '1.2rem', opacity: 0.8 }}>⚡</div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '0.65rem', color: 'var(--iron-signal-active)', fontFamily: 'var(--font-systemic)', letterSpacing: '1px' }}>TRIGGER</span>
            <span style={{ fontWeight: 500 }}>{data.label}</span>
        </div>
        <Handle type="source" position={Position.Bottom} style={{ background: 'var(--iron-signal-active)' }} />
    </div>
);

const ConstraintNode = ({ data }) => (
    <div style={{ ...baseNodeStyle, borderLeft: '3px solid var(--iron-signal-risk)' }}>
        <Handle type="target" position={Position.Top} style={{ background: 'var(--iron-signal-risk)' }} />
        <div style={{ fontSize: '1.2rem', opacity: 0.8 }}>🔒</div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '0.65rem', color: 'var(--iron-signal-risk)', fontFamily: 'var(--font-systemic)', letterSpacing: '1px' }}>CONSTRAINT</span>
            <span style={{ fontWeight: 500 }}>{data.label}</span>
        </div>
        <Handle type="source" position={Position.Bottom} style={{ background: 'var(--iron-signal-risk)' }} />
    </div>
);

const VerdictNode = ({ data }) => (
    <div style={{ ...baseNodeStyle, borderLeft: '3px solid var(--iron-signal-integrity)' }}>
        <Handle type="target" position={Position.Top} style={{ background: 'var(--iron-signal-integrity)' }} />
        <div style={{ fontSize: '1.2rem', opacity: 0.8 }}>⚖️</div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '0.65rem', color: 'var(--iron-signal-integrity)', fontFamily: 'var(--font-systemic)', letterSpacing: '1px' }}>VERDICT</span>
            <span style={{ fontWeight: 500 }}>{data.label}</span>
        </div>
    </div>
);

const DecisionNode = ({ data }) => (
    <div style={{ ...baseNodeStyle, border: '1px solid var(--iron-text-secondary)', borderRadius: '16px' }}>
        <Handle type="target" position={Position.Top} style={{ background: 'var(--iron-text-secondary)' }} />
        <div style={{ fontSize: '1.2rem', opacity: 0.8 }}>🧠</div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '0.65rem', color: 'var(--iron-text-secondary)', fontFamily: 'var(--font-systemic)', letterSpacing: '1px' }}>DECISION</span>
            <span style={{ fontWeight: 500 }}>{data.label}</span>
        </div>
        <Handle type="source" position={Position.Bottom} id="true" style={{ left: '30%', background: 'var(--iron-signal-integrity)' }} />
        <Handle type="source" position={Position.Bottom} id="false" style={{ left: '70%', background: 'var(--iron-signal-risk)' }} />
    </div>
);

const nodeTypes = {
    TRIGGER: TriggerNode,
    CONSTRAINT: ConstraintNode,
    VERDICT: VerdictNode,
    DECISION: DecisionNode
};

// --- INITIAL STATE ---

const initialNodes = [
    { id: '1', type: 'TRIGGER', position: { x: 250, y: 50 }, data: { label: '06:00 AM' } },
    { id: '2', type: 'CONSTRAINT', position: { x: 250, y: 200 }, data: { label: 'Upload Gym Selfie', constraintType: 'PHOTO' } },
    { id: '3', type: 'VERDICT', position: { x: 250, y: 350 }, data: { label: 'Grant Streak', verdict: 'GRANT' } }
];

const initialEdges = [
    { id: 'e1-2', source: '1', target: '2', animated: true, style: { stroke: 'var(--iron-text-tertiary)' } },
    { id: 'e2-3', source: '2', target: '3', animated: true, style: { stroke: 'var(--iron-text-tertiary)' } }
];

const emojiPalette = ['🛡️', '⚔️', '⚖️', '👁️', '🔒', '🗝️', '🏛️', '🩸', '🕸️', '⏳', '⚡', '🧠'];

export const ProtocolBuilderSurface = ({ embedded = false }) => {
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
    const [selectedNodeId, setSelectedNodeId] = useState(null);
    const [protocolTitle, setProtocolTitle] = useState("NEW PROTOCOL");
    const [protocolDescription, setProtocolDescription] = useState("Describe the sovereign intent...");
    const [protocolDomain, setProtocolDomain] = useState("BIO_REGIME");

    const onConnect = useCallback((params) => setEdges((eds) => addEdge({ ...params, animated: true, style: { stroke: 'var(--iron-signal-active)', strokeWidth: 1.5 } }, eds)), [setEdges]);

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

    const handleRegister = () => {
        try {
            const graph = { nodes, edges };
            const protocol = compileGraphToProtocol(graph, {
                title: protocolTitle,
                description: protocolDescription,
                domain: protocolDomain
            });

            const success = registerProtocol(protocol);
            if (success) {
                alert(`PROTOCOL "${protocol.title}" RATIFIED.\nID: ${protocol.id}`);
            } else {
                alert("REGISTRY ERROR: Could not ratify protocol.");
            }
        } catch (e) {
            alert("COMPILATION ERROR: " + e.message);
        }
    };

    const handleExport = () => {
        try {
            const graph = { nodes, edges };
            const protocol = compileGraphToProtocol(graph, {
                title: protocolTitle,
                description: protocolDescription,
                domain: protocolDomain
            });
            const jsonString = JSON.stringify(protocol, null, 2);
            alert("PROTOCOL EXPORTED (COPIED TO CONSOLE):\n" + jsonString);
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
            id, type,
            position: { x: Math.random() * 200 + 100, y: Math.random() * 200 + 100 },
            data: baseData
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
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1 }}>
                        <input
                            type="text"
                            value={protocolTitle}
                            onChange={(e) => setProtocolTitle(e.target.value)}
                            placeholder="PROTOCOL TITLE"
                            style={{
                                background: 'transparent', border: 'none',
                                borderBottom: '1px solid var(--iron-structure-border)',
                                color: 'var(--iron-signal-active)',
                                fontFamily: 'var(--font-constitutional)', fontSize: '1.25rem',
                                width: '100%', outline: 'none'
                            }}
                        />
                        <input
                            type="text"
                            value={protocolDescription}
                            onChange={(e) => setProtocolDescription(e.target.value)}
                            placeholder="Describe the Sovereign Intent..."
                            style={{
                                background: 'transparent', border: 'none',
                                color: 'var(--iron-text-secondary)',
                                fontFamily: 'var(--font-institutional)', fontSize: '0.8rem',
                                width: '100%', outline: 'none'
                            }}
                        />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '10px', marginLeft: '40px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <span style={{ fontSize: '0.65rem', color: 'var(--iron-text-tertiary)', fontFamily: 'var(--font-systemic)' }}>TYPE</span>
                            <select
                                value={protocolDomain}
                                onChange={(e) => setProtocolDomain(e.target.value)}
                                style={{
                                    background: 'var(--iron-infra-panel)', border: '1px solid var(--iron-structure-border)',
                                    color: 'var(--iron-text-secondary)', fontFamily: 'var(--font-systemic)',
                                    fontSize: '0.75rem', padding: '4px'
                                }}
                            >
                                <option value="BIO_REGIME">BIO-REGIME</option>
                                <option value="CAPITAL_COMMAND">CAPITAL-COMMAND</option>
                                <option value="PROFESSIONAL_WARFARE">PROFESSIONAL-WARFARE</option>
                                <option value="COGNITIVE_SECURITY">COGNITIVE-SECURITY</option>
                            </select>
                        </div>
                        <div style={toolbarStyle}>
                            <button style={btnStyle} onClick={() => addNode('TRIGGER')}>+ TRIGGER</button>
                            <button style={btnStyle} onClick={() => addNode('CONSTRAINT')}>+ CONSTRAINT</button>
                            <button style={btnStyle} onClick={() => addNode('VERDICT')}>+ VERDICT</button>
                            <button style={{ ...btnStyle, color: 'var(--iron-signal-integrity)', borderColor: 'var(--iron-signal-integrity)' }} onClick={handleRegister}>REGISTER</button>
                            <button style={{ ...btnStyle, color: 'var(--iron-signal-active)', borderColor: 'var(--iron-signal-active)' }} onClick={handleExport}>EXPORT</button>
                        </div>
                    </div>
                </div>

                <div style={{ flex: 1 }}>
                    <ReactFlow
                        nodes={nodes} edges={edges}
                        onNodesChange={onNodesChange} onEdgesChange={onEdgesChange}
                        onConnect={onConnect} onNodeClick={onNodeClick} onEdgeClick={onEdgeClick}
                        nodeTypes={nodeTypes}
                        fitView
                        style={{ background: 'var(--iron-infra-void)' }}
                    >
                        <Background color="#1A1E24" gap={20} size={1} />
                        <Controls style={{ fill: 'var(--iron-text-secondary)', background: 'var(--iron-infra-panel)', border: '1px solid var(--iron-structure-border)' }} />
                    </ReactFlow>
                </div>
            </div>

            {/* Inspector Panel */}
            {selectedNode && (
                <div style={{
                    width: '320px', background: 'var(--iron-infra-panel)',
                    borderLeft: '1px solid var(--iron-structure-border)',
                    padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px'
                }}>
                    <div style={{ fontFamily: 'var(--font-constitutional)', fontSize: '1.2rem', color: 'var(--iron-signal-active)', borderBottom: '1px solid var(--iron-structure-border)', paddingBottom: '12px' }}>
                        NODE INSPECTOR
                    </div>
                    {/* ... Inspector Content (Keep simplified for brevity, assume similar structure but styled) ... */}
                    <div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--iron-text-tertiary)', marginBottom: '8px', fontFamily: 'var(--font-systemic)' }}>LABEL</div>
                        <input
                            type="text"
                            value={selectedNode.data.label}
                            onChange={(e) => updateLabel(e.target.value)}
                            style={{
                                width: '100%', background: 'var(--iron-infra-void)',
                                border: '1px solid var(--iron-structure-border)', color: 'var(--iron-text-primary)',
                                padding: '8px', fontFamily: 'var(--font-institutional)', fontSize: '0.9rem'
                            }}
                        />
                    </div>

                    <button onClick={deleteNode} style={{ ...btnStyle, background: 'var(--iron-signal-breach-dim)', color: 'var(--iron-signal-breach)', borderColor: 'var(--iron-signal-breach)', marginTop: 'auto' }}>
                        DELETE NODE
                    </button>
                </div>
            )}
        </div>
    );
};
