import { createContext, useContext } from 'react';
import type { AppTheme, ThemeId } from './themes';

export type ThemeContextValue = {
    theme: AppTheme;
    setTheme: (id: ThemeId) => void;
};

export const ThemeContext = createContext<ThemeContextValue | null>(null);

/** The current theme and a way to change it. Needs a ThemeProvider above it. */
export function useTheme(): ThemeContextValue {
    const context = useContext(ThemeContext);
    if (context === null) {
        throw new Error('useTheme must be used inside a ThemeProvider.');
    }
    return context;
}
