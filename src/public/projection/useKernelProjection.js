
import { useState, useEffect } from 'react';
import { ProjectionAuthority } from '../../ice/projection/ProjectionAuthority';

/**
 * useKernelProjection Hook
 * 
 * The standard way for UI components to read Institutional State.
 * Polls the Projection Authority (or subscribes if we add events later).
 * 
 * @returns {Object} { institution, sovereignty, refresh }
 */
export const useKernelProjection = () => {
    const [institution, setInstitution] = useState(ProjectionAuthority.getInstitutionProjection());
    const [sovereignty, setSovereignty] = useState(ProjectionAuthority.getSovereigntyProjection());

    const refresh = () => {
        setInstitution(ProjectionAuthority.getInstitutionProjection());
        setSovereignty(ProjectionAuthority.getSovereigntyProjection());
    };

    // Initial Load
    useEffect(() => {
        refresh();

        // Optional: Polling for updates if the kernel pushes changes async
        const interval = setInterval(refresh, 1000);
        return () => clearInterval(interval);
    }, []);

    return {
        institution,
        sovereignty,
        refresh
    };
};
