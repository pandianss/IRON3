import React from 'react';

export function NoInstitutionSurface({ onInitialize }) {
    return (
        <div style={styles.container}>
            <div style={styles.content}>
                <div style={styles.glitchTitle}>SOVEREIGNTY_VOID</div>
                <h1 style={styles.title}>The Institution is Unformed.</h1>
                <p style={styles.text}>
                    You stand at the threshold of the Iron. No biological commitments have been formalized.
                    No authority has been established.
                </p>
                <div style={styles.divider} />
                <p style={styles.requirement}>
                    REQUIREMENT: Initiate the Forge to establish institutional standing.
                </p>
                <button onClick={onInitialize} style={styles.button}>
                    INITIATE_FORMATION
                </button>
            </div>
        </div>
    );
}

NoInstitutionSurface.contract = {
    supportedPhases: ['pre_institutional'],
    authorityRange: [0, 0]
};

const styles = {
    container: {
        height: '100vh',
        background: '#000',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#fff',
        padding: '20px',
        textAlign: 'center'
    },
    content: {
        maxWidth: '450px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '24px'
    },
    glitchTitle: {
        fontFamily: 'monospace',
        fontSize: '0.7rem',
        letterSpacing: '5px',
        color: '#ff4d00',
        opacity: 0.6
    },
    title: {
        fontFamily: 'serif',
        fontSize: '2.4rem',
        margin: 0,
        fontWeight: 'normal',
        letterSpacing: '1px'
    },
    text: {
        fontSize: '1rem',
        lineHeight: 1.6,
        opacity: 0.5,
        fontFamily: 'sans-serif'
    },
    divider: {
        width: '40px',
        height: '1px',
        background: '#ff4d00',
        margin: '10px 0'
    },
    requirement: {
        fontSize: '0.7rem',
        fontFamily: 'monospace',
        letterSpacing: '1px',
        color: '#ff4d00'
    },
    button: {
        background: 'transparent',
        border: '1px solid #fff',
        color: '#fff',
        padding: '16px 32px',
        fontSize: '0.9rem',
        fontFamily: 'monospace',
        letterSpacing: '2px',
        cursor: 'pointer',
        transition: 'all 0.2s',
        marginTop: '20px',
        '&:hover': {
            background: '#fff',
            color: '#000'
        }
    }
};
