import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { User, type StoredUser } from '@/entities/all';

/** The signed-in user, as stored (and validated on read) by the local `User` entity. */
export type AuthUser = StoredUser;

type AuthContextValue = {
    user: AuthUser | null;
    isAuthenticated: boolean;
    isLoadingAuth: boolean;
    authChecked: boolean;
    logout: () => Promise<void>;
    checkUserAuth: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [isLoadingAuth, setIsLoadingAuth] = useState(true);
    const [authChecked, setAuthChecked] = useState(false);

    const checkUserAuth = useCallback(async () => {
        setIsLoadingAuth(true);
        try {
            setUser(await User.me());
        } catch (error) {
            console.error('Auth check failed:', error);
            setUser(null);
        } finally {
            setIsLoadingAuth(false);
            setAuthChecked(true);
        }
    }, []);

    const logout = useCallback(async () => {
        try {
            await User.logout();
            setUser(null);
        } catch (error) {
            console.error('Logout failed:', error);
        }
    }, []);

    useEffect(() => {
        checkUserAuth();
    }, [checkUserAuth]);

    const value = useMemo<AuthContextValue>(() => ({
        user,
        isAuthenticated: user !== null,
        isLoadingAuth,
        authChecked,
        logout,
        checkUserAuth,
    }), [user, isLoadingAuth, authChecked, logout, checkUserAuth]);

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextValue => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
