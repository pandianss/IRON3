import React, { useEffect, useState } from 'react';

/**
 * GENESIS SURFACE
 * The initial interface for the Sovereign Spine.
 * Handles boot sequence, calibration to user identity, and initial authority handshake.
 */
export const GenesisSurface = ({ kernel, status }) => {
    const [terminalLines, setTerminalLines] = useState([
        "> SOVEREIGN SPINE KERNEL v4.0",
        "> INITIALIZING..."
    ]);

    useEffect(() => {
        if (status === 'BOOTING') {
            const sequence = [
                { text: "> MOUNTING LEGISLATIVE WING...", delay: 800 },
                { text: "> MOUNTING EXECUTIVE WING...", delay: 1600 },
                { text: "> MOUNTING EXPERIENTIAL WING...", delay: 2400 },
                { text: "> MOUNTING JUDICIAL WING...", delay: 3200 },
                { text: "> VERIFYING SOVEREIGNTY...", delay: 4000 },
                { text: "> SYSTEM READY.", delay: 4800 }
            ];

            let timeouts = [];
            sequence.forEach(({ text, delay }) => {
                const id = setTimeout(() => {
                    setTerminalLines(prev => [...prev, text]);
                }, delay);
                timeouts.push(id);
            });

            return () => timeouts.forEach(clearTimeout);
        }
    }, [status]);

    return (
        <div style={styles.container}>
            <div style={styles.terminal}>
                {terminalLines.map((line, i) => (
                    <div key={i} style={styles.line}>{line}</div>
                ))}
                <div style={styles.cursor}>_</div>
            </div>

            <div style={styles.status}>
                STATUS: <span style={{ color: 'var(--iron-brand-ascending)' }}>{status}</span>
            </div>
        </div>
    );
};

const styles = {
    container: {
        height: '100vh',
        width: '100vw',
        background: 'var(--iron-infra-void)',
        color: 'var(--iron-text-primary)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        fontFamily: 'var(--font-authority)',
        padding: '40px'
    },
    terminal: {
        maxWidth: '600px',
        width: '100%',
        textAlign: 'left'
    },
    line: {
        marginBottom: '12px',
        opacity: 0.8,
        fontSize: '1rem',
        letterSpacing: '1px'
    },
    cursor: {
        animation: 'blink 1s step-end infinite'
    },
    status: {
        marginTop: '60px',
        fontSize: '0.8rem',
        opacity: 0.5,
        letterSpacing: '2px'
    }
};
