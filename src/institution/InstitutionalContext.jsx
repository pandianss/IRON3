import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { InstitutionalKernel } from '../ice/Kernel';

// The Context holds the specific instance of the Engine
const InstitutionalContext = createContext(null);

export const InstitutionalProvider = ({ children }) => {
    const [error, setError] = useState(null);

    // 1. Boot the Sovereign (Singleton within the App Lifecycle)
    const kernel = useMemo(() => {
        try {
            return new InstitutionalKernel({
                // In a real app, we'd hydrate from persistence here
                initialEvents: []
            });
        } catch (e) {
            console.error("ICE BOOT FAILURE:", e);
            setError(e);
            return null;
        }
    }, []);

    // 2. Reactive State (The React View of the Institution)
    const [snapshot, setSnapshot] = useState(() =>
        kernel ? kernel.getSnapshot() : { mandates: null }
    );

    useEffect(() => {
        if (!kernel) return;

        // Sync initial snapshot even if history is not empty
        setSnapshot(kernel.getSnapshot());

        // Subscribe to Engine Updates
        const unsubscribe = kernel.subscribe((newSnapshot) => {
            console.log("ICE: State Update Detected", newSnapshot);
            setSnapshot(newSnapshot);
        });

        // GENESIS SIMULATION (For MVP)
        // If empty, start the contract so we have something to show
        if (kernel.getSnapshot().history.length === 0) {
            console.log("ICE: Genesis Ingest - CONTRACT_CREATED");
            kernel.ingest('CONTRACT_CREATED', {}, 'USER_HOST');
        }

        return unsubscribe;
    }, [kernel]);

    const value = {
        kernel,
        snapshot
    };

    if (error) {
        return (
            <div style={{ padding: 40, color: 'red', fontFamily: 'monospace' }}>
                <h1>INSTITUTIONAL KERNEL PANIC</h1>
                <pre>{error.message}</pre>
                <pre>{error.stack}</pre>
            </div>
        );
    }

    if (!kernel) {
        return (
            <div style={{ padding: 40, fontFamily: 'monospace', color: '#666' }}>
                INSTITUTIONAL KERNEL BOOTING...
            </div>
        );
    }

    return (
        <InstitutionalContext.Provider value={value}>
            {children}
        </InstitutionalContext.Provider>
    );
};

// --- HOOKS ---

/**
 * Access the Kernel directly (mostly for Ingesting events).
 */
export const useSovereignKernel = () => {
    const context = useContext(InstitutionalContext);
    if (!context) throw new Error("useSovereignKernel must be used within InstitutionalProvider");
    return context.kernel;
};

/**
 * The Primary Reader Hook.
 * UI components should ask for a Mandate, not raw state.
 * @param {string} type - 'NARRATIVE' | 'MOTION' | 'SURFACE'
 */
export const useInstitutionalMandate = (type) => {
    const context = useContext(InstitutionalContext);
    if (!context) throw new Error("useInstitutionalMandate must be used within InstitutionalProvider");

    // Safety check for initialization
    if (!context.snapshot || !context.snapshot.mandates) return null;

    if (type === 'NARRATIVE') return context.snapshot.mandates.narrative;
    if (type === 'MOTION') return context.snapshot.mandates.motion;
    if (type === 'SURFACE') return context.snapshot.mandates.surfaces;

    return context.snapshot.mandates;
};

export const useInstitutionalSnapshot = () => {
    const context = useContext(InstitutionalContext);
    if (!context) throw new Error("useInstitutionalSnapshot must be used within InstitutionalProvider");
    return context.snapshot;
};
