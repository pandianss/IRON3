import React, { useEffect } from 'react';
import { ExperienceKernel } from './experienceKernel';

/**
 * STANDING GATE (UX-CONTRACT-02)
 * Enforcement layer that validates surface contracts and asserts standing recognition.
 */
export const StandingGate = ({ surfaceName, contract, snapshot, children }) => {
    // 1. Assert Standing Recognition
    // In a real implementation, we would use a context or a ref to detect 
    // if a Standing-aware component (like InstitutionStatusBar) is mounted and active.
    // For now, we perform runtime contract validation via the Kernel.

    useEffect(() => {
        try {
            if (contract) {
                ExperienceKernel.validateSurfaceContract(surfaceName, contract, snapshot);
            }
        } catch (err) {
            // Institutional Violation: Standing Supremacy Breach
            console.error("UX-CONTRACT VIOLATION:", err.message);
        }
    }, [surfaceName, contract, snapshot]);

    try {
        // CHOKE-POINT: The Kernel MUST authorize the render
        ExperienceKernel.validateSurfaceContract(surfaceName, contract, snapshot);
    } catch (err) {
        // If contract validation fails, we block the render and show a specific error
        return (
            <div style={styles.breach}>
                <div style={styles.title}>UX-CONTRACT BREACH</div>
                <div style={styles.message}>{err.message}</div>
                <div style={styles.subtext}>Surface "{surfaceName}" is non-compliant with current Standing.</div>
            </div>
        );
    }

    return <>{children}</>;
};

const styles = {
    breach: {
        background: '#200',
        padding: '40px',
        border: '2px solid #f44',
        color: '#f88',
        fontFamily: 'monospace',
        textAlign: 'center',
        margin: '20px'
    },
    title: {
        fontSize: '1.2rem',
        fontWeight: 'bold',
        marginBottom: '10px',
        letterSpacing: '2px'
    },
    message: {
        fontSize: '0.9rem',
        marginBottom: '20px',
        opacity: 0.8
    },
    subtext: {
        fontSize: '0.7rem',
        opacity: 0.5
    }
};
