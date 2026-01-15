import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { InstitutionalProvider } from './institution/InstitutionalContext';
import { GovernanceProvider, useGovernance } from './context/GovernanceContext';
import { IronAppShell } from './shell/IronAppShell';

// Public Pages
import { LandingPage } from './public/pages/LandingPage';

/**
 * THE SOVEREIGN SPINE CONNECTOR

 */
const InstitutionalBridge = ({ onStateSync }) => {
    const { institutionalState, loading, kernel } = useGovernance();

    useEffect(() => {
        let status = 'ALIVE';
        if (loading) status = 'BOOTING';
        if (!institutionalState && !loading) status = 'NO_INSTITUTION';

        // If the kernel has encountered a terminal cycle error
        if (institutionalState?.error) status = 'DEGRADED';

        onStateSync({
            ...institutionalState,
            status,
            error: institutionalState?.error,
            kernel // Pass kernel through bridge for recovery actions
        });
    }, [institutionalState, loading, onStateSync]);

    return null;
};

/**
 * THE GOVERNED APP
 * Only accessible via /app route. Fully wrapped in the Spine.
 */
export default function App() {
    return (
        <InstitutionalProvider>
            <Routes>
                {/* Public SEO Root Site */}
                <Route path="/" element={<LandingPage />} />

                {/* Governed Application Spine */}
                <Route path="/app/*" element={<GovernedApp />} />

                {/* Redirects */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </InstitutionalProvider>
    );
}

/**
 * THE GOVERNED APP
 */
const GovernedApp = () => {
    const [institution, setInstitution] = useState(null);

    return (
        <IronAppShell institution={institution}>
            <AuthProvider>
                <GovernanceProvider>
                    <InstitutionalBridge onStateSync={setInstitution} />
                </GovernanceProvider>
            </AuthProvider>
        </IronAppShell>
    );
};

