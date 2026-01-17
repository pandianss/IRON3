import React, { useEffect, useState } from 'react';
import '../../../ui/styles/sovereign.css';

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
        <div className="genesis-container">
            <div className="genesis-terminal">
                {terminalLines.map((line, i) => (
                    <div key={i} className="genesis-line">{line}</div>
                ))}
                <div className="genesis-cursor">_</div>
            </div>

            <div className="genesis-status">
                STATUS: <span className="genesis-status-value">{status}</span>
            </div>
        </div>
    );
};
