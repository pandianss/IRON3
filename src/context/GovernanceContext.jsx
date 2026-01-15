import React, { createContext, useContext } from 'react';
import { useSovereignKernel, useInstitutionalSnapshot } from '../institution/InstitutionalContext';
import { useAuth } from './AuthContext';

export const GovernanceContext = createContext(null);

export const GovernanceProvider = ({ children }) => {
    const { currentUser: user } = useAuth();

    // Connect to the Sovereign Kernel
    const kernel = useSovereignKernel();
    const snapshot = useInstitutionalSnapshot();

    // The 'institutionalState' expected by the Shell is the full snapshot
    // Snapshot structure from Kernel: { history, state, mandates, activeModules }
    const institutionalState = {
        ...snapshot.state,
        activeModules: snapshot.activeModules,
        history: snapshot.history,
        mandates: snapshot.mandates
    };

    const loading = !institutionalState;

    // Action: Declare (Write to Ledger via Kernel)
    const declare = async (event, payload = {}) => {
        if (!user) return;
        try {
            console.log(`GOVERNANCE: Declaring ${event}`, payload);
            await kernel.ingest(event, payload, user.uid);
            return { success: true };
        } catch (err) {
            console.error("Declaration failed", err);
            return { success: false, error: err.message };
        }
    };

    return (
        <GovernanceContext.Provider value={{
            kernel,
            institutionalState,
            loading,
            declare
        }}>
            {children}
        </GovernanceContext.Provider>
    );
};

export const useGovernance = () => useContext(GovernanceContext);
