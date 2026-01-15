import React, { createContext, useContext, useState } from 'react';

export const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    // Hardcoded user for MVP demo
    const [currentUser] = useState({ uid: 'test_citizen_001', displayName: 'Citizen 001' });

    return (
        <AuthContext.Provider value={{ currentUser }}>
            {children}
        </AuthContext.Provider>
    );
};
