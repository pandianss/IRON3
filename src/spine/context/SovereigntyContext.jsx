import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { initializeCourt, subscribeToState, createProjection, submitEvent } from '@/interfaces';

// The Context holds the specific instance of the Engine
const SovereigntyContext = createContext(null);

export const SovereigntyProvider = ({ children }) => {
    const [error, setError] = useState(null);

    // 1. Boot the Sovereign (Singleton within the App Lifecycle)
    const court = useMemo(() => {
        try {
            return initializeCourt([]);
        } catch (e) {
            console.error("SOVEREIGN KERNEL BOOT FAILURE:", e);
            setError(e);
            return null;
        }
    }, []);

    // 2. Reactive State (The React View of the Sovereignty)
    const [snapshot, setSnapshot] = useState(() =>
        court ? createProjection() : { mandates: null }
    );

    useEffect(() => {
        if (!court) return;

        // Sync initial snapshot
        setSnapshot(createProjection());

        // Subscribe to Court Updates
        const unsubscribe = subscribeToState((newSnapshot) => {
            console.log("SOVEREIGN: State Update Detected", newSnapshot);
            setSnapshot(newSnapshot);
        });

        return unsubscribe;
    }, [court]);

    const value = {
        court,
        snapshot
    };

    if (error) {
        return (
            <div style={{ padding: 40, color: 'red', fontFamily: 'monospace' }}>
                <h1>SOVEREIGN KERNEL PANIC</h1>
                <pre>{error.message}</pre>
                <pre>{error.stack}</pre>
            </div>
        );
    }

    if (!court) {
        return (
            <div style={{ padding: 40, fontFamily: 'monospace', color: '#666' }}>
                SOVEREIGN KERNEL BOOTING...
            </div>
        );
    }

    return (
        <SovereigntyContext.Provider value={value}>
            {children}
        </SovereigntyContext.Provider>
    );
};

// --- HOOKS ---

export const useSovereignKernel = () => {
    const context = useContext(SovereigntyContext);
    if (!context) throw new Error("useSovereignKernel must be used within SovereigntyProvider");
    // Return a wrapped ingest for backward compatibility or the court itself
    return {
        ingest: (type, payload, actor) => {
            return submitEvent({ type, payload, actor });
        }
    };
};

export const useSovereignSnapshot = () => {
    const context = useContext(SovereigntyContext);
    if (!context) throw new Error("useSovereignSnapshot must be used within SovereigntyProvider");
    return context.snapshot;
};

export const useInstitutionalSnapshot = useSovereignSnapshot;
