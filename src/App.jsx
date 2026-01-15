import React, { useState, createContext, useContext } from 'react';
import { GovernanceProvider, useGovernance } from './context/GovernanceContext';
import { InstitutionalShell } from './institution/InstitutionalShell';

// Mock Auth Context (since original was deleted or missing)
const AuthProvider = ({ children }) => {
    // Hardcoded user for MVP demo
    const [currentUser] = useState({ uid: 'test_citizen_001', displayName: 'Citizen 001' });
    return (
        <AuthContext.Provider value={{ currentUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

const AppContent = () => {
    const { institutionalState, loading } = useGovernance();

    // The Single Governed Flow
    return <InstitutionalShell institutionalState={institutionalState} loading={loading} />;
};

function App() {
    return (
        <AuthProvider>
            <GovernanceProvider>
                <AppContent />
            </GovernanceProvider>
        </AuthProvider>
    )
}

export default App;
