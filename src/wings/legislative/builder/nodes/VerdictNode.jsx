import React, { memo } from 'react';
import { Handle, Position } from 'reactflow';

// IVC-01 Design Styles
const baseStyle = {
    background: 'var(--iron-infra-panel)',
    padding: '10px',
    borderRadius: 'var(--iron-radius-sm)',
    minWidth: '140px',
    color: 'var(--iron-text-primary)',
    fontFamily: 'var(--font-institutional)',
    fontSize: '0.8rem',
    textAlign: 'center'
};

const grantStyle = {
    ...baseStyle,
    border: '1px solid var(--iron-signal-integrity)', // Green/Viridian
    boxShadow: '0 0 10px rgba(78, 159, 131, 0.1)'
};

const denyStyle = {
    ...baseStyle,
    border: '1px solid var(--iron-signal-breach)', // Red/Crimson
    boxShadow: '0 0 10px rgba(207, 68, 68, 0.1)'
};

const labelStyle = {
    fontSize: '0.7rem',
    marginBottom: '5px',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    fontWeight: 'bold',
    fontFamily: 'var(--font-systemic)'
};

export default memo(({ data }) => {
    const isGrant = data.verdict === 'GRANT';

    return (
        <div style={isGrant ? grantStyle : denyStyle}>
            {/* Input from Constraint */}
            <Handle
                type="target"
                position={Position.Top}
                style={{ background: isGrant ? 'var(--iron-signal-integrity)' : 'var(--iron-signal-breach)', width: '8px', height: '8px', borderRadius: 0 }}
            />

            <div style={{ ...labelStyle, color: isGrant ? 'var(--iron-signal-integrity)' : 'var(--iron-signal-breach)' }}>
                {isGrant ? 'VERDICT: VALID' : 'VERDICT: INVALID'}
            </div>
            <div>{data.label}</div>
        </div>
    );
});
