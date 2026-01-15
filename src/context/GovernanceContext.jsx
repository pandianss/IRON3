import React, { createContext, useContext, useEffect, useState } from 'react';
import { EngineService } from '../services/engine/EngineService';
import { useAuth } from '../App';
import { CivilState, CivilCode } from '../core/protocols/CivilCode';

// Initial State Template for new users
const INITIAL_CIVIL_STATE = (uid) => ({
    uid,
    civil_state: CivilState.INDUCTION, // Default start
    induction_day: 1,
    risk_level: 'LOW', // LOW, MODERATE, HIGH
    history: {
        fractures: 0,
        recoveries: 0
    },
    today: {
        status: 'PENDING', // PENDING, COMPLETED, EXCUSED, MISSED
        last_action: null
    },
    streak: { count: 0 } // Added for local simulation
});

export const GovernanceContext = createContext(null);

export const GovernanceProvider = ({ children }) => {
    const { currentUser: user } = useAuth();
    const [civilContext, setCivilContext] = useState(null);
    const [loading, setLoading] = useState(true);

    // Subscribe to Local Mock State
    useEffect(() => {
        if (!user) {
            setCivilContext(null);
            setLoading(false);
            return;
        }

        // SIMULATING NETWORK LOAD
        const timer = setTimeout(() => {
            console.log("Governance: Loaded local state for", user.uid);

            // Check if we have state in localStorage for persistence across reloads
            const saved = localStorage.getItem(`iron_state_${user.uid}`);
            if (saved) {
                setCivilContext(JSON.parse(saved));
            } else {
                const initial = INITIAL_CIVIL_STATE(user.uid);
                setCivilContext(initial);
                localStorage.setItem(`iron_state_${user.uid}`, JSON.stringify(initial));
            }

            setLoading(false);
        }, 800);

        return () => clearTimeout(timer);
    }, [user]);

    // Action: Declare (Check-in / Practice)
    const declarePractice = async (type = 'PRACTICE_COMPLETE', payload = {}) => {
        if (!user) return { status: 'error', error: "Identity required." };

        try {
            // Adjudicate first (optimistic check)
            const judgment = CivilCode.adjudicate(civilContext?.civil_state, type);
            if (!judgment.lawful) {
                return { status: 'denied', reason: judgment.reason };
            }

            // Execute (Mock Engine)
            await EngineService.processAction(user.uid, {
                type: type,
                payload,
                timestamp: new Date().toISOString()
            });

            // Update Local State
            setCivilContext(prev => {
                let newState = { ...prev };
                const today = new Date().toISOString().split('T')[0];

                if (type === 'ENTER_RECOVERY') {
                    newState.civil_state = CivilState.RECOVERING;
                    newState.risk_level = 'MODERATE';
                    newState.history.fractures += 1;
                    newState.today = { status: 'PENDING', last_action: 'RECOVERY_STARTED' };
                }
                else if (type === 'PRACTICE_COMPLETE') {
                    // Check if we were recovering
                    if (prev.civil_state === CivilState.RECOVERING) {
                        // Simple logic: 3 days of practice exits recovery
                        if (prev.streak.count >= 2) {
                            newState.civil_state = CivilState.CORE_GOVERNANCE;
                            newState.history.recoveries += 1;
                        }
                    }
                    newState.today = { status: 'COMPLETED', last_action: type };
                    newState.streak.count += 1;
                }
                else if (type === 'REST_TAKEN') {
                    newState.today = { status: 'EXCUSED', last_action: type };
                    // Streak maintained but not increased
                }
                else if (type === 'PRACTICE_MISSED') {
                    // Trigger Fracture for demo purposes if in Core
                    if (prev.civil_state === CivilState.CORE_GOVERNANCE) {
                        newState.civil_state = CivilState.FRACTURED;
                        newState.streak.count = 0; // Frozen/Reset
                    }
                    newState.today = { status: 'MISSED', last_action: type };
                }

                localStorage.setItem(`iron_state_${user.uid}`, JSON.stringify(newState));
                return newState;
            });

            return { status: 'recorded' };
        } catch (err) {
            console.error("Governance declaration failed", err);
            return { status: 'error', error: err.message };
        }
    };

    // Derived Projections
    const currentCondition = civilContext?.civil_state || CivilState.INDUCTION;
    const isFractured = currentCondition === CivilState.FRACTURED;
    const isAtRisk = currentCondition === CivilState.AT_RISK;
    const isRecovering = currentCondition === CivilState.RECOVERING;

    return (
        <GovernanceContext.Provider value={{
            // State
            civilContext,
            loading,

            // Civil Conditions
            currentCondition,
            isFractured,
            isAtRisk,
            isRecovering,

            // Laws & Rights
            currentLaws: CivilCode.LAWS[currentCondition] || CivilCode.LAWS[CivilState.INDUCTION],

            // Actions
            declarePractice,

            // Legacy / Compat
            streak: civilContext?.streak?.count || 0
        }}>
            {children}
        </GovernanceContext.Provider>
    );
};

export const useGovernance = () => useContext(GovernanceContext);
