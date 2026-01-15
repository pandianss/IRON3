import React from 'react';

export function InstitutionStatusBar({ institution }) {
    return (
        <div className="iron-status-bar" style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            padding: '8px 16px',
            background: '#000',
            color: '#fff',
            fontFamily: 'monospace',
            borderBottom: '1px solid #333',
            zIndex: 100
        }}>
            <strong>IRON</strong>
            <span> | Status: {institution?.status ?? 'NO INSTITUTION'}</span>
            <span> | Standing: {institution?.standing ?? 'UNKNOWN'}</span>
        </div>
    )
}
