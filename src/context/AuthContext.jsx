import React, { createContext, useContext, useState } from 'react';

export const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(() => {
        const saved = localStorage.getItem('iron_user');
        return saved ? JSON.parse(saved) : null;
    });

    const login = (userData) => {
        const user = userData || { uid: 'citizen_' + Math.random().toString(36).substr(2, 9), displayName: 'Citizen' };
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
