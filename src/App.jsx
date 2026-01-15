import React, { useState, useEffect } from 'react';
import { AuthProvider } from './context/AuthContext';
import { InstitutionalProvider } from './institution/InstitutionalContext';
import { GovernanceProvider, useGovernance } from './context/GovernanceContext';
import { IronAppShell } from './shell/IronAppShell';

/**
 * THE SOVEREIGN SPINE CONNECTOR
 * This component lives inside the providers and feeds state UP to the Spine.
 * Wait, feeding UP is hard in React.
 * Better: App.jsx wraps Providers around its INTERNAL content, but the 
 * Spine itself is provided a 'setInstitution' hook or similar.
 */

const InstitutionalBridge = ({ onStateSync }) => {
    const { institutionalState, loading } = useGovernance();

    useEffect(() => {
        let status = 'ALIVE';
        if (loading) status = 'BOOTING';
        if (!institutionalState && !loading) status = 'NO_INSTITUTION';

        onStateSync({
            ...institutionalState,
            status,
            standing: institutionalState?.standing?.state || 'UNKNOWN'
        });
    }, [institutionalState, loading, onStateSync]);

    return null; // Invisible bridge
};

export default function App() {
    const [institution, setInstitution] = useState(null);

    return (
        <IronAppShell institution={institution}>
            <AuthProvider>
                <InstitutionalProvider>
                    <GovernanceProvider>
                        <InstitutionalBridge onStateSync={setInstitution} />
                        {/* 
                            Content routing is now handled by the Spine's 
                            ActiveSurfaceFrame which receives the sync'd state.
                        */}
                    </GovernanceProvider>
                </InstitutionalProvider>
            </AuthProvider>
        </IronAppShell>
    );
}

