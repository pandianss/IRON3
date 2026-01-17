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
import { validateProtocolJSON, compileGraphToProtocol } from './ProtocolCompiler';

// IVC-01 Container Style
const surfaceStyle = {
    width: '100%',
    height: '100vh',
    background: 'var(--iron-infra-void)',
    display: 'flex',
    flexDirection: 'column',
    position: 'relative'
};

const headerStyle = {
    padding: '20px',
    borderBottom: '1px solid var(--iron-structure-border)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    background: 'var(--iron-infra-base)'
};

const titleStyle = {
    fontFamily: 'var(--font-constitutional)',
    fontSize: '1.5rem',
    color: 'var(--iron-text-primary)'
};

const toolbarStyle = {
    display: 'flex',
    gap: '10px'
};

const btnStyle = {
    background: 'var(--iron-infra-panel)',
    border: '1px solid var(--iron-structure-border)',
    color: 'var(--iron-text-secondary)',
    padding: '8px 16px',
    cursor: 'pointer',
    fontSize: '0.8rem',
    fontFamily: 'var(--font-systemic)',
    transition: 'all 0.2s'
};

const nodeTypes = {
    TRIGGER: TriggerNode,
    CONSTRAINT: ConstraintNode,
    VERDICT: VerdictNode
};

// Initial State: A template protocol
const initialNodes = [
    { id: '1', type: 'TRIGGER', position: { x: 250, y: 50 }, data: { label: '06:00 AM' } },
    { id: '2', type: 'CONSTRAINT', position: { x: 250, y: 200 }, data: { label: 'Upload Gym Selfie', constraintType: 'PHOTO' } },
    { id: '3', type: 'VERDICT', position: { x: 250, y: 350 }, data: { label: 'Grant Streak', verdict: 'GRANT' } }
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
                description: protocolDescription
            });

            const jsonString = JSON.stringify(protocol, null, 2);
            // Copy to clipboard or download (simulated here with alert)
            alert("PROTOCOL EXPORTED (COPIED TO LOG):\n" + jsonString);
            console.log(jsonString);
        } catch (e) {
            alert("COMPILATION ERROR: " + e.message);
        }
    };

    const addNode = (type) => {
        const id = `${type}_${Date.now()}`;
        const newNode = {
            id,
            type,
            position: { x: Math.random() * 400 + 100, y: Math.random() * 400 + 100 },
            data: { label: `New ${type}`, verdict: 'GRANT', constraintType: 'INPUT', dataFormat: 'TEXT' }
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
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                        <input
                            type="text"
                            value={protocolTitle}
                            onChange={(e) => setProtocolTitle(e.target.value)}
                            style={{
                                background: 'transparent',
                                border: 'none',
                                color: 'var(--iron-text-primary)',
                                fontFamily: 'var(--font-constitutional)',
                                fontSize: '1.5rem',
                                width: '300px',
                                outline: 'none'
                            }}
                        />
                        <input
                            type="text"
                            value={protocolDescription}
                            onChange={(e) => setProtocolDescription(e.target.value)}
                            style={{
                                background: 'transparent',
                                border: 'none',
                                color: 'var(--iron-text-secondary)',
                                fontFamily: 'var(--font-institutional)',
                                fontSize: '0.9rem',
                                width: '400px',
                                outline: 'none'
                            }}
                        />
                    </div>
                    <div style={toolbarStyle}>
                        <button style={btnStyle} onClick={() => addNode('TRIGGER')}>+ TRIGGER</button>
                        <button style={btnStyle} onClick={() => addNode('CONSTRAINT')}>+ CONSTRAINT</button>
                        <button style={btnStyle} onClick={() => addNode('VERDICT')}>+ VERDICT</button>
                    </div>
                    <div style={toolbarStyle}>
                        <button style={{ ...btnStyle, color: 'var(--iron-signal-active)', borderColor: 'var(--iron-signal-active)' }} onClick={handleExport}>
                            EXPORT LAW
                        </button>
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
            {selectedNode && (
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
                </div>
            )}
        </div>
    );
};
