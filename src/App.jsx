import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { InstitutionalProvider } from './institution/InstitutionalContext';
import { GovernanceProvider, useGovernance } from './context/GovernanceContext';
import { IronAppShell } from './shell/IronAppShell';

// Public Pages
import { LandingPage } from './public/pages/LandingPage';
import { WhatIsIron } from './public/pages/WhatIsIron';
import { InstitutionalProductivity } from './public/pages/InstitutionalProductivity';
import { PersonalInstitution } from './public/pages/PersonalInstitution';
import { InstitutionalCatalog } from './public/pages/InstitutionalCatalog';

/**
 * THE SOVEREIGN SPINE CONNECTOR
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

    return null;
};

/**
 * THE GOVERNED APP
 * Only accessible via /app route. Fully wrapped in the Spine.
 */
const GovernedApp = () => {
    const [institution, setInstitution] = useState(null);

    return (
        <IronAppShell institution={institution}>
            <AuthProvider>
                <InstitutionalProvider>
                    <GovernanceProvider>
                        <InstitutionalBridge onStateSync={setInstitution} />
                    </GovernanceProvider>
                </InstitutionalProvider>
            </AuthProvider>
        </IronAppShell>
    );
};

export default function App() {
    return (
        <Routes>
            {/* Public SEO Root Site */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/what-is-iron" element={<WhatIsIron />} />
            <Route path="/institutional-productivity" element={<InstitutionalProductivity />} />
            <Route path="/personal-institution" element={<PersonalInstitution />} />
            <Route path="/catalog" element={<InstitutionalCatalog />} />

            {/* Governed Application Spine */}
            <Route path="/app/*" element={<GovernedApp />} />

            {/* Redirects */}
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
}
