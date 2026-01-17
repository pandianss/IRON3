import React, { useMemo } from 'react';
import ReactFlow, { Background, Handle, Position, MarkerType } from 'reactflow';
import 'reactflow/dist/style.css';

// --- VISUAL STYLES ---
const nodeStyle = {
    background: 'var(--iron-infra-panel)',
    border: '1px solid var(--iron-structure-border)',
    color: 'var(--iron-text-primary)',
    padding: '10px 16px',
    borderRadius: '4px',
    fontFamily: 'var(--font-institutional)',
    textAlign: 'center',
    width: 180,
    fontSize: '0.85rem',
    boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
    justifyContent: 'center',
    alignItems: 'center'
};

const labelStyle = {
    fontSize: '0.65rem',
    color: 'var(--iron-text-tertiary)',
    letterSpacing: '1px',
    fontFamily: 'var(--font-systemic)',
    textTransform: 'uppercase'
};

const titleStyle = {
    fontWeight: 600,
    letterSpacing: '0.5px'
};

const groupStyle = {
    ...nodeStyle,
    background: 'rgba(0,0,0,0.2)',
    borderStyle: 'dashed',
    width: 'auto',
    height: 'auto',
    alignItems: 'flex-start',
    padding: '24px',
    gap: '12px'
};

// --- CUSTOM NODES ---
const SpineNode = ({ data }) => (
    <div style={{ ...nodeStyle, borderColor: data.color || 'var(--iron-structure-border)' }}>
        <span style={{ ...labelStyle, color: data.color || 'var(--iron-text-tertiary)' }}>{data.type}</span>
        <div style={titleStyle}>{data.label}</div>
        {data.handles?.map((h, i) => (
            <Handle key={i} type={h.type} position={h.position} id={h.id} style={{ background: data.color, width: '8px', height: '8px' }} />
        ))}
    </div>
);

const GroupNode = ({ data }) => (
    <div style={{ position: 'relative', width: data.width, height: data.height, border: `1px dashed ${data.color}`, borderRadius: '8px', background: 'rgba(0,0,0,0.1)' }}>
        <div style={{ position: 'absolute', top: -12, left: 12, background: 'var(--iron-infra-base)', padding: '0 8px', fontSize: '0.7rem', color: data.color, fontFamily: 'var(--font-systemic)' }}>
            {data.label}
        </div>
    </div>
);

const nodeTypes = {
    spine: SpineNode,
    group: GroupNode
};

export const SpineVisualizer = () => {
    const nodes = useMemo(() => [
        // --- GROUPS ---
        { id: 'g_const', type: 'group', position: { x: 300, y: -20 }, data: { label: 'SUPREME LAW', width: 200, height: 100, color: 'var(--iron-brand-gold)' }, style: { zIndex: -1 } },
        { id: 'g_leg', type: 'group', position: { x: 0, y: 150 }, data: { label: 'LEGISLATIVE WING', width: 220, height: 350, color: 'var(--iron-signal-active)' }, style: { zIndex: -1 } },
        { id: 'g_kern', type: 'group', position: { x: 300, y: 150 }, data: { label: 'IRON KERNEL', width: 220, height: 350, color: 'var(--iron-brand-crimson)' }, style: { zIndex: -1 } },
        { id: 'g_exec', type: 'group', position: { x: 600, y: 150 }, data: { label: 'EXECUTIVE WING', width: 220, height: 350, color: 'var(--iron-signal-integrity)' }, style: { zIndex: -1 } },

        // --- CONSTITUTION ---
        {
            id: 'constitution', type: 'spine', position: { x: 310, y: 10 },
            data: {
                type: 'CODE', label: 'Constitution', color: 'var(--iron-brand-gold)',
                handles: [{ type: 'source', position: Position.Bottom, id: 'b' }]
            }
        },

        // --- LEGISLATIVE ---
        {
            id: 'builder', type: 'spine', position: { x: 20, y: 200 },
            data: {
                type: 'INTERFACE', label: 'Protocol Builder', color: 'var(--iron-signal-active)',
                handles: [{ type: 'source', position: Position.Bottom, id: 'b' }]
            }
        },
        {
            id: 'registry', type: 'spine', position: { x: 20, y: 350 },
            data: {
                type: 'STORE', label: 'Protocol Registry', color: 'var(--iron-signal-active)',
                handles: [{ type: 'target', position: Position.Top, id: 't' }, { type: 'source', position: Position.Right, id: 'r' }]
            }
        },

        // --- KERNEL ---
        {
            id: 'gate', type: 'spine', position: { x: 320, y: 200 },
            data: {
                type: 'FILTER', label: 'Compliance Gate', color: 'var(--iron-brand-crimson)',
                handles: [{ type: 'target', position: Position.Top, id: 't' }, { type: 'target', position: Position.Left, id: 'l' }, { type: 'source', position: Position.Bottom, id: 'b' }]
            }
        },
        id: 'court', type: 'spine', position: { x: 320, y: 350 },
        data: {
            type: 'ENGINE', label: 'Iron Court', color: 'var(--iron-brand-crimson)',
            handles: [
                { type: 'target', position: Position.Top, id: 't' },
                { type: 'source', position: Position.Bottom, id: 'b' },
                // Distributed Source Handles for Executive Wing
                { type: 'source', position: Position.Right, id: 'r_session', style: { top: '30%' } },
                { type: 'source', position: Position.Right, id: 'r_standing', style: { top: '50%' } },
                { type: 'source', position: Position.Right, id: 'r_contract', style: { top: '70%' } }
            ]
        }
        },
    {
        id: 'ledger', type: 'spine', position: { x: 320, y: 500 }, // Moved down
        data: {
            type: 'MEMORY', label: 'Sovereign Ledger', color: 'var(--iron-text-secondary)',
            handles: [{ type: 'target', position: Position.Top, id: 't' }]
        }
    },

    // --- EXECUTIVE ---
    {
        id: 'session', type: 'spine', position: { x: 620, y: 200 },
        data: {
            type: 'RUNTIME', label: 'Session Engine', color: 'var(--iron-signal-integrity)',
            handles: [{ type: 'target', position: Position.Left, id: 'l' }]
        }
    },
    {
        id: 'standing', type: 'spine', position: { x: 620, y: 350 },
        data: {
            type: 'STATE', label: 'Standing Engine', color: 'var(--iron-signal-integrity)',
            handles: [{ type: 'target', position: Position.Left, id: 'l' }]
        }
    },
    {
        id: 'contracts', type: 'spine', position: { x: 620, y: 500 },
        data: {
            type: 'BINDING', label: 'Contract Engine', color: 'var(--iron-signal-integrity)',
            handles: [{ type: 'target', position: Position.Left, id: 'l' }]
        }
    },

    ], []);

const edges = useMemo(() => [
    // Law Flow
    { id: 'c-g', source: 'constitution', sourceHandle: 'b', target: 'gate', targetHandle: 't', animated: false, markerEnd: { type: MarkerType.ArrowClosed }, style: { stroke: 'var(--iron-brand-gold)' } },

    // Protocol Flow
    { id: 'b-r', source: 'builder', sourceHandle: 'b', target: 'registry', targetHandle: 't', animated: true, style: { stroke: 'var(--iron-signal-active)' } },
    { id: 'r-g', source: 'registry', sourceHandle: 'r', target: 'gate', targetHandle: 'l', animated: true, label: 'Ratification', style: { stroke: 'var(--iron-signal-active)' } },

    // Kernel Flow
    { id: 'g-c', source: 'gate', sourceHandle: 'b', target: 'court', targetHandle: 't', animated: true, style: { stroke: 'var(--iron-brand-crimson)', strokeWidth: 2 } },
    { id: 'c-l', source: 'court', sourceHandle: 'b', target: 'ledger', targetHandle: 't', animated: true, label: 'Events', style: { stroke: 'var(--iron-text-tertiary)' } },

    // Executive Flow (Verdicts)
    { id: 'c-s', source: 'court', sourceHandle: 'r_session', target: 'session', targetHandle: 'l', animated: true, style: { stroke: 'var(--iron-signal-integrity)' } },
    { id: 'c-st', source: 'court', sourceHandle: 'r_standing', target: 'standing', targetHandle: 'l', animated: true, label: 'Verdict', style: { stroke: 'var(--iron-signal-integrity)' } },
    { id: 'c-con', source: 'court', sourceHandle: 'r_contract', target: 'contracts', targetHandle: 'l', animated: true, style: { stroke: 'var(--iron-signal-integrity)' } },

], []);

return (
    <div style={{ width: '100%', height: '100%', pointerEvents: 'none' }}>
        <ReactFlow
            nodes={nodes}
            edges={edges}
            nodeTypes={nodeTypes}
            fitView
            proOptions={{ hideAttribution: true }}
            style={{ background: 'transparent' }}
        >
            <Background color="#555" gap={20} size={1} style={{ opacity: 0.1 }} />
        </ReactFlow>
    </div>
);
};
