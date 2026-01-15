import React from 'react';
import { AuthProvider } from './context/AuthContext';
import { InstitutionalProvider } from './institution/InstitutionalContext';
import { GovernanceProvider, useGovernance } from './context/GovernanceContext';
import { IronAppShell } from './shell/IronAppShell';

/**
 * Connects the React Context world to the Rigid Spine world.
 * Isolates the Shell from Context failures.
 */
const IronConnector = () => {
    let institution = null;

    try {
        const { institutionalState, loading } = useGovernance();

        // 1. Loading State -> Booting
        if (loading) {
            institution = { status: 'BOOTING' };
        }
        // 2. Real State -> Active
        else if (institutionalState) {
            institution = {
                ...institutionalState,
                status: 'ALIVE', // Explicit signal for the Spine
                // Ensure 'standing' string exists for the Status Bar
                standing: institutionalState.standing?.state || 'UNKNOWN'
            };
        }
        // 3. No State -> Null (Handled by Shell as "No Institution")

    } catch (err) {
        console.error("Governance Bridge Failure:", err);
        // institution remains null, triggering NoInstitutionSurface
    }

    return <IronAppShell institution={institution} />;
};

export default function App() {
    return (
        <AuthProvider>
            <InstitutionalProvider>
                <GovernanceProvider>
                    <IronConnector />
                </GovernanceProvider>
            </InstitutionalProvider>
        </AuthProvider>
    );
}
