import React from 'react';

export const BootScreen = ({ status, error, details }) => {
    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: '#000000',
            color: '#FFFFFF',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: 'monospace',
            zIndex: 9999
        }}>
            <div style={{
                border: error ? '2px solid #ff4444' : '2px solid #333',
                padding: '40px',
                maxWidth: '600px',
                width: '90%'
            }}>
                <h1 style={{
                    margin: '0 0 20px 0',
                    fontSize: '1.5rem',
                    color: error ? '#ff4444' : '#fff'
                }}>
                    {error ? 'INSTITUTIONAL FAILURE' : 'SYSTEM INITIALIZATION'}
                </h1>

                <div style={{ marginBottom: '20px', fontSize: '1.2rem' }}>
                    STATUS: {status || 'UNKNOWN'}
                </div>

                {details && (
                    <div style={{
                        background: '#111',
                        padding: '10px',
                        fontSize: '0.8rem',
                        color: '#888',
                        whiteSpace: 'pre-wrap'
                    }}>
                        {JSON.stringify(details, null, 2)}
                    </div>
                )}

                <div style={{ marginTop: '20px', fontSize: '0.8rem', opacity: 0.5 }}>
                    IRON KERNEL v1.0
                </div>
            </div>
        </div>
    );
};
