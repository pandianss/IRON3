import React from 'react';

export function SystemMessageLayer({ institution }) {
    if (!institution) {
        return (
            <div className="iron-system-message" style={{
                position: 'fixed',
                bottom: 20,
                right: 20,
                background: '#330000',
                color: '#ff0000',
                padding: '8px 12px',
                border: '1px solid #ff0000',
                zIndex: 90
            }}>
                No institution present.
            </div>
        )
    }

    if (institution.status === 'BOOTING') {
        return <div className="iron-system-message" style={{
            position: 'fixed',
            bottom: 20,
            right: 20,
            background: '#333300',
            color: '#ffff00',
            padding: '8px 12px',
            border: '1px solid #ffff00',
            zIndex: 90
        }}>Institution booting…</div>
    }

    if (institution.status === 'DEGRADED') {
        return <div className="iron-system-message" style={{
            position: 'fixed',
            bottom: 20,
            right: 20,
            background: '#330000',
            color: '#ff0000',
            padding: '8px 12px',
            border: '1px solid #ff0000',
            zIndex: 90
        }}>Institution degraded.</div>
    }

    return null
}
