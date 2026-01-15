import React, { createContext, useContext } from 'react';
import { useSovereignKernel, useInstitutionalSnapshot } from '../institution/InstitutionalContext';
import { useAuth } from './AuthContext';

export const GovernanceContext = createContext(null);

export const GovernanceProvider = ({ children }) => {
    const { currentUser: user } = useAuth();

    // Connect to the Sovereign Kernel
    const kernel = useSovereignKernel();
    const snapshot = useInstitutionalSnapshot();

    // The 'institutionalState' expected by the Shell is the 'state' domain of the snapshot
    // Snapshot structure from Kernel: { history, state, mandates }
    // State structure: { standing, authority, session, ... }
    const institutionalState = snapshot.state;

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
            institutionalState,
            loading,
            declare
        }}>
            {children}
        </GovernanceContext.Provider>
    );
};

export const useGovernance = () => useContext(GovernanceContext);
