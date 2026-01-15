import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { GovernanceProvider, useGovernance } from './context/GovernanceContext';
import StateMirror from './ui/screens/home/StateMirror';
import InstitutionalBriefing from './ui/screens/onboarding/InstitutionalBriefing';
import BehavioralDeclaration from './ui/screens/declaration/BehavioralDeclaration';
import DailyAdjudication from './ui/screens/adjudication/DailyAdjudication';
import FractureNarrative from './ui/screens/adjudication/FractureNarrative';
import { CivilState } from './core/protocols/CivilCode';

// Mock Auth Context (since original was deleted or missing)
const AuthProvider = ({ children }) => {
    // Hardcoded user for MVP demo
    const [currentUser] = useState({ uid: 'test_citizen_001', displayName: 'Citizen 001' });
    return (
        // Provide mock auth context if needed by GovernanceContext (it imports useAuth)
        // We'll need to patch GovernanceContext to handle this or provide a real AuthContext
        <AuthContext.Provider value={{ currentUser }}>
            {children}
        </AuthContext.Provider>
    );
};
import { createContext, useContext } from 'react';
export const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);


const AppRoutes = () => {
    const { civilContext, loading, isFractured } = useGovernance();

    if (loading) return <div style={{ padding: 20 }}>CONNECTING TO LEDGER...</div>;

    // FRACTURE LOCKOUT LOGIC
    if (isFractured && window.location.pathname !== '/fracture') {
        return <Navigate to="/fracture" />;
    }

    // determine start screen based on state
    // For MVP demo, allow navigation
    return (
        <Routes>
            <Route path="/" element={<StateMirror />} />
            <Route path="/briefing" element={<InstitutionalBriefing onComplete={() => window.location.href = '/declaration'} />} />
            <Route path="/declaration" element={<BehavioralDeclaration onComplete={() => window.location.href = '/'} />} />
            <Route path="/daily" element={<DailyAdjudication />} />
            <Route path="/fracture" element={<FractureNarrative />} />
            <Route path="*" element={<Navigate to="/" />} />
        </Routes>
    );
};

function App() {
    return (
        <Router>
            <AuthProvider>
                <GovernanceProvider>
                    <AppRoutes />
                </GovernanceProvider>
            </AuthProvider>
        </Router>
    )
}

export default App;
