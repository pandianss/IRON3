
import { useState, useEffect } from 'react';
import { createProjection, subscribeToState } from '@/interfaces';

/**
 * useKernelProjection Hook
 * 
 * The standard way for UI components to read Institutional State.
 * Subscribes to the authoritative Interface Pack.
 * 
 * @returns {Object} { institution: snapshot, sovereignty: snapshot, refresh }
 */
export const useKernelProjection = () => {
    const [snapshot, setSnapshot] = useState(() => createProjection());

    useEffect(() => {
        // Initial Sync
        setSnapshot(createProjection());

        // Reactive Sync
        const unsubscribe = subscribeToState((newSnapshot) => {
            setSnapshot(newSnapshot);
        });

        return unsubscribe;
    }, []);

    return {
        institution: snapshot.domains, // Domain mapping
        sovereignty: snapshot,
        refresh: () => setSnapshot(createProjection())
    };
};
