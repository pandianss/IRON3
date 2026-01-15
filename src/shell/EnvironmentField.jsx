import React from 'react';

export function EnvironmentField({ institution }) {
    return (
        <div className="iron-environment" style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            zIndex: -1,
            background: '#111',
            color: '#333'
        }}>
            {/* atmospheric, motion, standing aura later */}
            <div style={{ padding: 20 }}>[ENVIRONMENT FIELD]</div>
        </div>
    )
}
