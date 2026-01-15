import React from 'react';
import '../../ui/styles/design-tokens.css';

/**
 * Layer 4: Environmental Field
 * The lowest layer. Always present.
 * Carries atmosphere, motion fields, and background state.
 */
export const EnvironmentField = () => {
    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            zIndex: -1,
            background: 'var(--iron-gradient-void)',
            color: 'var(--iron-text-primary)',
            pointerEvents: 'none', // Allow clicks to pass through
            overflow: 'hidden'
        }}>
            {/* Subtle Texture or Grain could go here */}
            <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                opacity: 0.03,
                backgroundImage: 'radial-gradient(circle at 50% 50%, #ffffff 1px, transparent 1px)',
                backgroundSize: '24px 24px'
            }} />
        </div>
    );
};
