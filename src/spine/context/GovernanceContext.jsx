import React, { createContext, useContext } from 'react';
import { useSovereignKernel, useSovereignSnapshot as useInstitutionalSnapshot } from './SovereigntyContext';
import { useAuth } from './AuthContext';
import { AuditEngine } from '../../wings/judicial/audit/AuditEngine';

export const GovernanceContext = createContext(null);

export const GovernanceProvider = ({ children }) => {
    const { currentUser: user } = useAuth();

    // Connect to the Sovereign Kernel
    const kernel = useSovereignKernel();
    const snapshot = useInstitutionalSnapshot();

    // The 'institutionalState' expected by the Shell is the full snapshot
    const institutionalState = React.useMemo(() => (!snapshot ? null : snapshot), [snapshot]);

    const loading = !institutionalState;

    // Action: Declare (Write to Ledger via Kernel)
    const declare = async (event, payload = {}) => {
        if (!user) return;
        try {
            console.log(`GOVERNANCE: Declaring ${event}`, payload);

            // JUDICIAL HOOK: Witness the act formally
            AuditEngine.witnessAct(event, payload, user.uid);

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
            declare,
            dismantle: () => kernel.dismantle()
        }}>
            {children}
        </GovernanceContext.Provider>
    );
};

export const useGovernance = () => {
    const context = useContext(GovernanceContext);
    if (!context) {
        console.warn("useGovernance used outside of Provider or Context is null");
        return { kernel: null, institutionalState: null, loading: true };
    }
    return context;
};
