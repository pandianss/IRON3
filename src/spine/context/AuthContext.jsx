import React, { createContext, useContext, useState } from 'react';

export const AuthContext = createContext(null);
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        console.warn("AuthContext is missing. Returning safe default.");
        return { currentUser: null, login: () => { }, logout: () => { } };
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(() => {
        const saved = localStorage.getItem('iron_user');
        return saved ? JSON.parse(saved) : null;
    });

    const login = (userData) => {
        // Default to Citizen if no data
        let user = userData;
        if (!user) {
            user = { uid: 'citizen_' + Math.random().toString(36).substr(2, 9), displayName: 'Citizen', role: 'CITIZEN' };
        }

        // Mock Enterprise Login
        // Mock Enterprise Login (DEV ONLY)
        if (import.meta.env.DEV && userData?.type === 'ENTERPRISE_TEST') {
            user = {
                uid: 'ent_user_' + Math.random().toString(36).substr(2, 5),
                displayName: 'Restricted Operator',
                role: 'ENTERPRISE_USER',
                enterpriseId: userData.enterpriseId
            };
        }

        setCurrentUser(user);
        localStorage.setItem('iron_user', JSON.stringify(user));
    };

    const logout = () => {
        setCurrentUser(null);
        localStorage.removeItem('iron_user');
    };

    return (
        <AuthContext.Provider value={{ currentUser, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
