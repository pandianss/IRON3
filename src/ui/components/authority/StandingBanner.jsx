import React from 'react';
import '../../styles/InstitutionalTheme.css';

/**
 * A1. Standing Banner
 * Role: Declares the current institutional state.
 * Visual Law: Always above the fold, Largest typographic authority.
 */
export const StandingBanner = ({ standing, era }) => {
    // standing: { state, entropy, streak, since }
    // era: { id, status, start } (Optional)

    const getDisplayState = (s) => {
        if (s === 'INSTITUTIONAL') return 'SOVEREIGN'; // More meaningful than "Institutional"
        return s.replace('_', ' ');
    };

    const stateLabel = getDisplayState(standing.state);
    const eraLabel = era ? `ERA ${era.id.split('_')[1]}` : 'GENESIS ERA';

    return (
        <div className="surface-authority" style={{
            width: '100%',
            textAlign: 'center',
            paddingTop: 'var(--iron-space-xl)',
            paddingBottom: 'var(--iron-space-xl)',
            borderBottom: 'var(--civil-border)'
        }}>
            {/* 1. Jurisdiction / Context */}
            <div className="text-sm-caps" style={{
                marginBottom: 'var(--iron-space-sm)',
                opacity: 0.7
            }}>
                CURRENT STANDING
            </div>

            {/* 2. The Verdict (State) */}
            <h1 className="font-authority" style={{
                fontSize: '3.5rem',
                color: 'var(--theme-accent)',
                margin: 0,
                lineHeight: 1,
                textShadow: '0 0 30px var(--theme-accent-dim)'
            }}>
                {stateLabel}
            </h1>

            {/* 3. Temporal Context (Era) */}
            <div className="text-sm-caps" style={{
                marginTop: 'var(--iron-space-md)',
                color: 'var(--iron-text-secondary)',
                letterSpacing: '0.15em'
            }}>
                {eraLabel}
            </div>

            {/* 4. Streak Badging (Optional Inline or passed as children? Constitution says keep Banner focused) */}
            {/* We will leave streak to the Temporal Layer components (ContinuityBand) positioned below this. */}
        </div>
    );
};
