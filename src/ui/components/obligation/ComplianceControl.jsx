import React, { useState, useRef, useEffect } from 'react';
import '../../styles/InstitutionalTheme.css';

/**
 * B3. Compliance Control
 * Role: Mechanism to satisfy obligation.
 * Visual Law: Physically grounded, Deliberate affordance.
 * Behavioral Law: Must acknowledge acceptance.
 */
export const ComplianceControl = ({ label, onComplete, variant = 'standard' }) => {
    // variant: 'standard' | 'breach' | 'rest'

    // MVP: For now, standard click. 
    // TODO: Implement "Press and Hold" logic in future refinement.

    const getButtonStyle = () => {
        if (variant === 'breach') return 'btn-institutional btn-breach-action';
        if (variant === 'standard') return 'btn-institutional btn-start-action';
        return 'btn-institutional'; // rest/neutral
    };

    return (
        <button
            className={getButtonStyle()}
            onClick={onComplete}
            style={{
                padding: 'var(--iron-space-lg)',
                marginTop: 'var(--iron-space-md)'
            }}
        >
            <span className="font-authority" style={{ fontSize: '1rem', letterSpacing: '1px' }}>
                {label}
            </span>
        </button>
    );
};
