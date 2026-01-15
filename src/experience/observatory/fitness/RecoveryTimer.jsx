import React from 'react';

/**
 * RECOVERY TIMER (Fitness Focus)
 * Displays the countdown to the next authorized training window.
 */
export const RecoveryTimer = ({ law }) => {
    const { isAuthorized, mandates = [] } = law || { isAuthorized: true };

    // In a real app, this would calculate time until 5 AM (end of rest window)
    const restMandate = mandates.find(m => m.type === 'CIRCADIAN_RESTRAINT');

    return (
        <div style={{ padding: '20px', border: '1px solid var(--iron-border)', background: 'rgba(0,0,0,0.2)' }}>
            <div style={{ fontSize: '0.7rem', opacity: 0.5, letterSpacing: '2px', marginBottom: '15px' }}>
                RECOVERY_PROTOCOL
            </div>

            {isAuthorized ? (
                <div>
                    <div style={{ fontSize: '1.2rem', color: 'var(--iron-brand-stable)' }}>WINDOW: OPEN</div>
                    <p style={{ fontSize: '0.8rem', opacity: 0.6, marginTop: '10px' }}>
                        Physiological markers indicate readiness for institutional load.
                    </p>
                </div>
            ) : (
                <div>
                    <div style={{ fontSize: '1.2rem', color: 'var(--iron-brand-breach)' }}>WINDOW: SEALED</div>
                    <div style={{ fontSize: '2rem', fontFamily: 'var(--font-authority)', marginTop: '10px' }}>
                        REST_MANDATORY
                    </div>
                    <p style={{ fontSize: '0.8rem', opacity: 0.6, marginTop: '10px' }}>
                        Access to high-load surfaces is restricted until system stabilization.
                    </p>
                    {restMandate && (
                        <div style={{ marginTop: '20px', color: 'var(--iron-brand-risk)', fontSize: '0.7rem' }}>
                            [!] {restMandate.message}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};
