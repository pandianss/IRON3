import React, { memo } from 'react';
import { Handle, Position } from 'reactflow';

// IVC-01 Design Styles
const nodeStyle = {
    background: 'var(--iron-infra-panel)',
    border: '1px solid var(--iron-structure-border)',
    borderLeft: '3px solid var(--iron-signal-risk)', // Amber for Constraints/Risk
    padding: '10px',
    borderRadius: 'var(--iron-radius-sm)',
    minWidth: '150px',
    color: 'var(--iron-text-primary)',
    fontFamily: 'var(--font-institutional)',
    fontSize: '0.8rem'
};

const labelStyle = {
    fontSize: '0.7rem',
    color: 'var(--iron-text-secondary)',
    marginBottom: '5px',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    fontFamily: 'var(--font-systemic)'
};

export default memo(({ data }) => {
    return (
        <div style={nodeStyle}>
            {/* Input from Trigger */}
            <Handle
                type="target"
                position={Position.Top}
                style={{ background: 'var(--iron-text-secondary)', width: '8px', height: '8px', borderRadius: 0 }}
            />

            <div style={labelStyle}>CONSTRAINT</div>
            <div>{data.label}</div>
            <div style={{ fontSize: '0.65rem', opacity: 0.6, marginTop: '4px' }}>
                Type: {data.constraintType}
            </div>

            {/* Output to Verdict or Next Constraint */}
            <Handle
                type="source"
                position={Position.Bottom}
                style={{ background: 'var(--iron-text-secondary)', width: '8px', height: '8px', borderRadius: 0 }}
            />
        </div>
    );
});
