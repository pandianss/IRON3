import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { SovereignKernel } from '../../wings/executive/SovereignKernel.js';

// The Context holds the specific instance of the Engine
const SovereigntyContext = createContext(null);

export const SovereigntyProvider = ({ children }) => {
    const [error, setError] = useState(null);

    // 1. Boot the Sovereign (Singleton within the App Lifecycle)
    const kernel = useMemo(() => {
        try {
            return new SovereignKernel({
                // In a real app, we'd hydrate from persistence here
                initialEvents: []
            });
        } catch (e) {
            console.error("SOVEREIGN KERNEL BOOT FAILURE:", e);
            setError(e);
            return null;
        }
    }, []);

    // 2. Reactive State (The React View of the Sovereignty)
    const [snapshot, setSnapshot] = useState(() =>
        kernel ? kernel.getSnapshot() : { mandates: null }
    );

    useEffect(() => {
        if (!kernel) return;

        // Sync initial snapshot
        setSnapshot(kernel.getSnapshot());

        // Subscribe to Engine Updates
        const unsubscribe = kernel.subscribe((newSnapshot) => {
            console.log("SOVEREIGN: State Update Detected", newSnapshot);
            setSnapshot(newSnapshot);
        });

        return unsubscribe;
    }, [kernel]);

    const value = {
        kernel,
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

    if (!kernel) {
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
    return context.kernel;
};

export const useInstitutionalMandate = (type) => { // Kept for backward compat during refactor
    const context = useContext(SovereigntyContext);
    if (!context) throw new Error("useInstitutionalMandate must be used within SovereigntyProvider");
    if (!context.snapshot || !context.snapshot.mandates) return null;

    if (type === 'NARRATIVE') return context.snapshot.mandates.narrative;
    if (type === 'MOTION') return context.snapshot.mandates.motion;
    if (type === 'SURFACE') return context.snapshot.mandates.surfaces;

    return context.snapshot.mandates;
};

export const useSovereignSnapshot = () => {
    const context = useContext(SovereigntyContext);
    if (!context) throw new Error("useSovereignSnapshot must be used within SovereigntyProvider");
    return context.snapshot;
};

// Also export as old name if needed for very quick refactor, but better to fix
export const useInstitutionalSnapshot = useSovereignSnapshot;
