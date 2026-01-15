import React from 'react';
import '../../styles/InstitutionalTheme.css';

/**
 * A2. Verdict Panel (Authority Layer)
 * Behavior 3.2 Implementation
 * 
 * Role: Institutional explanation.
 * Triggers: Daily pass, Breach declaration, Recovery.
 */
export const VerdictPanel = ({ type, title, message, action }) => {
    // type: 'PASS' | 'BREACH' | 'RECOVERY' | 'RISK'

    const getVerdictStyle = () => {
        switch (type) {
            case 'BREACH':
                return {
                    borderColor: 'var(--iron-brand-breach)',
                    background: 'rgba(217, 83, 79, 0.05)'
                };
            case 'RECOVERY':
                return {
                    borderColor: 'var(--iron-brand-recovery)',
                    background: 'rgba(162, 155, 254, 0.05)'
                };
            case 'RISK':
                return {
                    borderColor: 'var(--iron-brand-risk)',
                    background: 'rgba(240, 173, 78, 0.05)'
                };
            default: // PASS/Standard
                return {
                    borderColor: 'var(--iron-brand-stable)',
                    background: 'var(--iron-infra-panel)'
                };
        }
    };

    const style = getVerdictStyle();

    return (
        <div style={{
            border: `1px solid ${style.borderColor}`,
            background: style.background,
            padding: 'var(--iron-space-lg)',
            borderRadius: 'var(--iron-radius-sm)',
            marginBottom: 'var(--iron-space-lg)',
            animation: 'slideIn 0.3s ease-out'
        }}>
            <div className="text-sm-caps" style={{ color: style.borderColor, marginBottom: 'var(--iron-space-sm)' }}>
                SYSTEM VERDICT
            </div>

            <h2 className="font-authority" style={{
                fontSize: '1.25rem',
                marginBottom: 'var(--iron-space-md)',
                color: 'var(--iron-text-primary)'
            }}>
                {title}
            </h2>

            <p className="font-human text-body" style={{ marginBottom: '0' }}>
                {message}
            </p>

            {action && (
                <div style={{ marginTop: 'var(--iron-space-lg)' }}>
                    {action}
                </div>
            )}
        </div>
    );
};
