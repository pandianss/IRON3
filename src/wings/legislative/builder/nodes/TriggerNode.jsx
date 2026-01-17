import React, { memo } from 'react';
import { Handle, Position } from 'reactflow';

// IVC-01 Design Styles
const nodeStyle = {
    background: 'var(--iron-infra-panel)',
    border: '1px solid var(--iron-signal-active)', // Cyan for Triggers (Active State)
    padding: '10px',
    borderRadius: 'var(--iron-radius-sm)',
    minWidth: '150px',
    color: 'var(--iron-text-primary)',
    fontFamily: 'var(--font-institutional)',
    fontSize: '0.8rem',
    boxShadow: '0 4px 10px rgba(91, 192, 222, 0.1)'
};

const labelStyle = {
    fontSize: '0.7rem',
    color: 'var(--iron-signal-active)',
    marginBottom: '5px',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    fontFamily: 'var(--font-systemic)'
};

export default memo(({ data }) => {
    return (
        <div style={nodeStyle}>
            <div style={labelStyle}>TRIGGER</div>
            <div>{data.label}</div>

            {/* Triggers only have outputs */}
            <Handle
                type="source"
                position={Position.Bottom}
                style={{ background: 'var(--iron-signal-active)', width: '8px', height: '8px', borderRadius: 0 }}
            />
        </div>
    );
});
