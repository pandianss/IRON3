import React from 'react';
import { useInstitutionalMandate, useInstitutionalSnapshot } from '../../../institution/logic/InstitutionalContext';
import '../../styles/InstitutionalTheme.css';

/**
 * A2. Verdict Panel (Authority Layer)
 * Behavior 3.2 Implementation
 * 
 * Role: Institutional explanation.
 * Source: MANDATE ENGINE (useInstitutionalMandate)
 */
export const VerdictPanel = () => {
    const narrative = useInstitutionalMandate('NARRATIVE');
    const snapshot = useInstitutionalSnapshot();

    if (!narrative) return null; // Authority is silent

    const { tone, message } = narrative;

    const getToneStyle = () => {
        switch (tone) {
            case 'ALARM':
                return {
                    borderColor: 'var(--iron-brand-breach)',
                    background: 'rgba(217, 83, 79, 0.05)'
                };
            case 'WARNING':
                return {
                    borderColor: 'var(--iron-brand-risk)',
                    background: 'rgba(240, 173, 78, 0.05)'
                };
            case 'AUTHORITY':
                return {
                    borderColor: 'var(--iron-brand-recovery)',
                    background: 'rgba(162, 155, 254, 0.05)'
                };
            case 'GUIDANCE': // Standard
            default:
                return {
                    borderColor: 'var(--iron-brand-stable)',
                    background: 'var(--iron-infra-panel)'
                };
        }
    };

    const style = getToneStyle();

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
                {tone}
            </h2>

            <p className="font-human text-body" style={{ marginBottom: '0' }}>
                {message}
            </p>

            {/* Constitutional Surfacing (Minimum Viable) */}
            <div style={{
                marginTop: 'var(--iron-space-md)',
                paddingTop: 'var(--iron-space-sm)',
                borderTop: '1px solid rgba(0,0,0,0.1)',
                fontSize: '0.8rem',
                opacity: 0.7,
                fontFamily: 'var(--font-mono)'
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>LIFECYCLE: {snapshot?.state?.lifecycle?.stage || 'UNKNOWN'}</span>
                    <span>STANDING: {snapshot?.state?.standing?.state || 'UNKNOWN'}</span>
                </div>
                {snapshot?.state?.lifecycle?.baselineSI && (
                    <div style={{ marginTop: '5px' }}>BASELINE: {snapshot.state.lifecycle.baselineSI.toFixed(2)}</div>
                )}
            </div>
        </div>
    );
};

