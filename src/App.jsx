import React from 'react';
import { GovernanceProvider, useGovernance } from './context/GovernanceContext';
import { InstitutionalShell } from './institution/InstitutionalShell';
import { InstitutionalProvider } from './institution/InstitutionalContext';
import { AuthProvider } from './context/AuthContext';
import './ui/styles/InstitutionalTheme.css';

const AppContent = () => {
    const { institutionalState, loading } = useGovernance();
    return <InstitutionalShell institutionalState={institutionalState} loading={loading} />;
};

function App() {
    return (
        <AuthProvider>
            <InstitutionalProvider>
                <GovernanceProvider>
                    <AppContent />
                </GovernanceProvider>
            </InstitutionalProvider>
        </AuthProvider>
    );
}

export default App;
