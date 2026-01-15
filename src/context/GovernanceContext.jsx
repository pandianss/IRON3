import React, { createContext, useContext, useEffect, useState } from 'react';
import { EngineService } from '../services/engine/EngineService';
import { useAuth } from './AuthContext';
import { evaluateInstitution } from '../institution/standing-engine/evaluateInstitution';



export const GovernanceContext = createContext(null);

export const GovernanceProvider = ({ children }) => {
    const { currentUser: user } = useAuth();
    const [institutionalState, setInstitutionalState] = useState(null);
    const [loading, setLoading] = useState(true);

    // Initial Load
    useEffect(() => {
        if (!user) {
            setLoading(false);
            return;
        }

        loadLedger();
    }, [user]);

    const loadLedger = async () => {
        try {
            // "Thin Adapter" - only fetches facts.
            // In MVP, we might mock this fetch.
            // TODO: Replace with real EngineService.fetchLedger(user.uid)
            // For now, simulating a ledger from localStorage or creating initial

            console.log("Loading ledger for", user.uid);

            // Mock Ledger for now (or read local)
            const savedLedger = localStorage.getItem(`iron_ledger_${user.uid}`);
            let ledger = savedLedger ? JSON.parse(savedLedger) : [];

            if (ledger.length === 0) {
                // Article III: "The first ledger entry is the act of contract creation."
                // But we can't auto-create until Induction.
                // So empty ledger = PRE_INDUCTION.
            }

            const now = new Date().toISOString();
            const state = evaluateInstitution(ledger, now);

            setInstitutionalState(state);
        } catch (e) {
            console.error("Ledger Load Failed", e);
        } finally {
            setLoading(false);
        }
    };

    // Action: Declare (Write to Ledger)
    const declare = async (event, payload = {}) => {
        if (!user) return;

        try {
            // 1. Write to Ledger (via Service)
            // await EngineService.appendEvent(user.uid, event, payload);

            // Simulating Write:
            const newItem = {
                type: event,
                payload,
                timestamp: new Date().toISOString()
            };

            const savedLedger = localStorage.getItem(`iron_ledger_${user.uid}`);
            let ledger = savedLedger ? JSON.parse(savedLedger) : [];
            ledger.push(newItem);
            localStorage.setItem(`iron_ledger_${user.uid}`, JSON.stringify(ledger));

            // 2. Re-evaluate
            const newState = evaluateInstitution(ledger, new Date().toISOString());
            setInstitutionalState(newState);

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
