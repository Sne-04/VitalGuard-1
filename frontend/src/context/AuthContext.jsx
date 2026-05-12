import React, { createContext, useContext, useEffect, useState } from 'react';
import { useUser, useAuth as useClerkAuth, useClerk } from '@clerk/clerk-react';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const { user, isLoaded: isUserLoaded } = useUser();
    const { getToken, isLoaded: isAuthLoaded, isSignedIn } = useClerkAuth();
    const { signOut } = useClerk();

    const [token, setToken] = useState(localStorage.getItem('token'));

    useEffect(() => {
        if (isSignedIn) {
            getToken().then(setToken);
        } else {
            setToken(null);
        }
    }, [isSignedIn, getToken]);

    const loading = !isUserLoaded || !isAuthLoaded;

    const mappedUser = user ? {
        id: user.id,
        _id: user.id,
        name: user.fullName || user.firstName || 'User',
        email: user.primaryEmailAddress?.emailAddress,
        age: 30, // Default for now
        gender: 'Not specified',
        medicalHistory: { comorbidities: [], allergies: [], currentMedications: [] }
    } : null;

    useEffect(() => {
        if (token) {
            localStorage.setItem('token', token);
        } else {
            localStorage.removeItem('token');
        }
    }, [token]);

    const value = {
        user: mappedUser,
        token,
        isAuthenticated: !!isSignedIn,
        loading,
        logout: signOut,
        login: () => {}, // Handled by Clerk
        register: () => {} // Handled by Clerk
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
