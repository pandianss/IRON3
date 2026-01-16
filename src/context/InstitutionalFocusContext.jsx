import React, { createContext, useContext, useState, useEffect } from 'react';

const InstitutionalFocusContext = createContext(null);

export const InstitutionalFocusProvider = ({ children, activeModules }) => {
    const [focusedModuleId, setFocusedModuleId] = useState(null);

    // Auto-focus logic: If no module is focused but modules exist, focus the first one.
    useEffect(() => {
        if (!focusedModuleId && activeModules && activeModules.length > 0) {
            setFocusedModuleId(activeModules[0]);
        }
        // If the focused module is no longer active, reset to the first one available or null
        if (focusedModuleId && activeModules && !activeModules.includes(focusedModuleId)) {
            setFocusedModuleId(activeModules.length > 0 ? activeModules[0] : null);
        }
    }, [activeModules, focusedModuleId]);

    return (
        <InstitutionalFocusContext.Provider value={{ focusedModuleId, setFocusedModuleId }}>
            {children}
        </InstitutionalFocusContext.Provider>
    );
};

export const useInstitutionalFocus = () => {
    const context = useContext(InstitutionalFocusContext);
    if (!context) {
        throw new Error('useInstitutionalFocus must be used within an InstitutionalFocusProvider');
    }
    return context;
};
