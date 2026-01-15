import React, { useMemo } from 'react';
import { interpretStanding, StandingBand } from '../../institution/StandingInterpreter';

/**
 * Standing Theme Adapter
 * Translates interpreted standing into visual system values.
 * Reference: DESIGN_TO_CODE_SPEC.md Section 2.2
 */
export const StandingThemeAdapter = ({ institutionalState, children }) => {

    const interpretation = useMemo(() => interpretStanding(institutionalState), [institutionalState]);
    const { standingBand, motionIntensity } = interpretation;

    // Define Tokens per Band
    const getThemeVariables = (band) => {
        switch (band) {
            case StandingBand.ASCENDING:
                return {
                    '--iron-accent': 'var(--iron-brand-ascending)',
                    '--iron-accent-dim': 'var(--iron-brand-ascending-dim)',
                    '--iron-glow-level': '0.8'
                };
            case StandingBand.RISK:
                return {
                    '--iron-accent': 'var(--iron-brand-risk)',
                    '--iron-accent-dim': 'var(--iron-brand-risk-dim)',
                    '--iron-glow-level': '0.6'
                };
            case StandingBand.BREACH:
                return {
                    '--iron-accent': 'var(--iron-brand-breach)',
                    '--iron-accent-dim': 'var(--iron-brand-breach-dim)',
                    '--iron-glow-level': '0'
                };
            case StandingBand.RECOVERY:
                return {
                    '--iron-accent': 'var(--iron-brand-recovery)',
                    '--iron-accent-dim': 'var(--iron-brand-recovery-dim)',
                    '--iron-glow-level': '0.3'
                };
            case StandingBand.STABLE:
            default:
                return {
                    '--iron-accent': 'var(--iron-brand-stable)',
                    '--iron-accent-dim': 'var(--iron-brand-stable-dim)',
                    '--iron-glow-level': '0.5'
                };
        }
    };

    const themeVars = getThemeVariables(standingBand);

    // Combine with Motion Vars
    const style = {
        ...themeVars,
        '--iron-motion-intensity': motionIntensity,
        '--theme-accent': themeVars['--iron-accent'], // Backwards compat
        '--theme-accent-dim': themeVars['--iron-accent-dim'] // Backwards compat
    };

    // We apply this to a distinct "Theme Root"
    return (
        <div
            className={`iron-theme-adapter band-${standingBand.toLowerCase()}`}
            style={style}
        >
            {children}
        </div>
    );
};
