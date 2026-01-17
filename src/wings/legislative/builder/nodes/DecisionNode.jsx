import React, { memo } from 'react';
import { Handle, Position } from 'reactflow';

// IVC-01 Design Styles
const diamondStyle = {
    width: '100px',
    height: '100px',
    background: 'var(--iron-infra-panel)',
    border: '1px solid var(--iron-signal-active)',
    transform: 'rotate(45deg)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
    position: 'relative'
};

const innerContentStyle = {
    transform: 'rotate(-45deg)', // Counter-rotate text
    textAlign: 'center',
    width: '140px', // Wider to fit text
    position: 'absolute'
};

const labelStyle = {
    fontSize: '0.7rem',
    color: 'var(--iron-text-primary)',
    fontFamily: 'var(--font-systemic)',
    wordBreak: 'break-word',
    lineHeight: '1.2'
};

export default memo(({ data }) => {
    return (
        <div style={{ padding: '20px' }}> {/* Wrapper for spacing */}
            <div style={diamondStyle}>
                {/* Input (Top - relative to diamond) */}
                <Handle
                    type="target"
                    position={Position.Top}
                    id="in"
                    style={{ background: 'var(--iron-text-secondary)', width: '8px', height: '8px', borderRadius: 0, top: '-4px', left: '50%', transform: 'translate(-50%, 0)' }}
                />

                <div style={innerContentStyle}>
                    <div style={{ ...labelStyle, color: 'var(--iron-signal-active)', fontSize: '0.6rem', marginBottom: '2px' }}>DECISION</div>
                    <div style={labelStyle}>{data.label || "?"}</div>
                </div>

                {/* Output YES (Right) */}
                <Handle
                    type="source"
                    position={Position.Right}
                    id="yes"
                    style={{ background: 'var(--iron-signal-integrity)', width: '8px', height: '8px', borderRadius: 0, right: '-4px', top: '50%', transform: 'translate(0, -50%)' }}
                />

                {/* Output NO (Left) */}
                <Handle
                    type="source"
                    position={Position.Left}
                    id="no"
                    style={{ background: 'var(--iron-signal-breach)', width: '8px', height: '8px', borderRadius: 0, left: '-4px', top: '50%', transform: 'translate(0, -50%)' }}
                />
            </div>

            {/* Visual Labels for Handles */}
            <div style={{ position: 'absolute', right: '-10px', top: '50%', fontSize: '0.6rem', color: 'var(--iron-signal-integrity)' }}>YES</div>
            <div style={{ position: 'absolute', left: '-10px', top: '50%', fontSize: '0.6rem', color: 'var(--iron-signal-breach)' }}>NO</div>
        </div>
    );
});
