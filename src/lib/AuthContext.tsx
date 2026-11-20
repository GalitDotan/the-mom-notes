import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { User } from '@/entities/all';

/** The signed-in user, as stored by the local `User` entity. */
export type AuthUser = {
    id: string;
    email: string;
    name: string;
    created_at: string;
};

type AuthContextValue = {
    user: AuthUser | null;
    isAuthenticated: boolean;
    isLoadingAuth: boolean;
    authChecked: boolean;
    logout: () => Promise<void>;
    checkUserAuth: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

const isAuthUser = (value: unknown): value is AuthUser => {
    if (typeof value !== 'object' || value === null) return false;
    const candidate = value as Record<string, unknown>;
    return ['id', 'email', 'name', 'created_at'].every((field) => typeof candidate[field] === 'string');
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [isLoadingAuth, setIsLoadingAuth] = useState(true);
    const [authChecked, setAuthChecked] = useState(false);

    const checkUserAuth = useCallback(async () => {
        setIsLoadingAuth(true);
        try {
            const storedUser: unknown = await User.me();
            if (storedUser !== null && !isAuthUser(storedUser)) {
                console.warn('Ignoring stored user record with an unexpected shape.');
            }
            setUser(isAuthUser(storedUser) ? storedUser : null);
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
