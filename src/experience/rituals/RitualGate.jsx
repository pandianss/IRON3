import React from 'react';
import { ExperienceKernel } from '../kernel/experienceKernel';
import { ThresholdSurface } from '../observatory/ThresholdSurface';

/**
 * RITUAL GATE
 * High-priority UI layer that blocks experience access until ritual completion.
 * Driven by ExperienceKernel.requireDailyRitual().
 */
export const RitualGate = ({ snapshot, children }) => {
    const ritual = ExperienceKernel.requireDailyRitual(snapshot);

    if (!ritual.required) {
        return children;
    }

    // Instead of a hardcoded overlay, we now use the ThresholdSurface
    // which serves as the "Institutional Threshold".
    return (
        <ThresholdSurface
            orientation={{
                phase: ritual.phase,
                standing: ritual.standing,
                tone: 'formal' // Default for ritual threshold
            }}
        />
    );
};

const styles = {
    overlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: 'rgba(0,0,0,0.95)',
        zIndex: 2000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backdropFilter: 'blur(10px)'
    },
    card: {
        width: '100%',
        maxWidth: '400px',
        background: '#111',
        border: '1px solid #333',
        padding: '32px',
        display: 'flex',
        flexDirection: 'column',
        gap: '24px',
        textAlign: 'center'
    },
    header: {
        fontSize: '0.7rem',
        letterSpacing: '2px',
        color: '#f44',
        fontWeight: 'bold',
        fontFamily: 'monospace'
    },
    content: {
        display: 'flex',
        flexDirection: 'column',
        gap: '16px'
    },
    text: {
        fontSize: '1.2rem',
        fontFamily: 'serif',
        lineHeight: 1.4,
        color: '#eee'
    },
    stats: {
        display: 'flex',
        justifyContent: 'center',
        gap: '40px',
        padding: '20px 0',
        borderTop: '1px solid #222',
        borderBottom: '1px solid #222'
    },
    stat: {
        display: 'flex',
        flexDirection: 'column',
        gap: '4px'
    },
    label: {
        fontSize: '0.6rem',
        color: '#666',
        letterSpacing: '1px'
    },
    value: {
        fontSize: '0.9rem',
        color: '#fff',
        fontFamily: 'monospace'
    },
    footer: {
        display: 'flex',
        flexDirection: 'column',
        gap: '12px'
    },
    button: {
        background: 'transparent',
        border: '1px solid #fff',
        color: '#fff',
        padding: '12px',
        cursor: 'pointer',
        fontSize: '0.8rem',
        letterSpacing: '1px',
        transition: 'all 0.2s',
        '&:hover': {
            background: '#fff',
            color: '#000'
        }
    },
    warning: {
        fontSize: '0.6rem',
        color: '#444',
        fontStyle: 'italic'
    }
};
