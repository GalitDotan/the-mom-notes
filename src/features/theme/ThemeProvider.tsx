import { useCallback, useLayoutEffect, useMemo, useState, type ReactNode } from 'react';
import { ThemeContext } from './theme-context';
import { applyTheme, findTheme, readSavedTheme, saveTheme, type ThemeId } from './themes';

/** Holds the chosen theme, shows it on <html>, and saves it for the next visit. */
export function ThemeProvider({ children }: { children: ReactNode }) {
    const [theme, setThemeState] = useState(readSavedTheme);

    // index.html already applied the saved theme before first paint; this keeps
    // <html> in step with the state, including when the saved value was unknown.
    useLayoutEffect(() => {
        applyTheme(theme);
    }, [theme]);

    const setTheme = useCallback((id: ThemeId) => {
        const next = findTheme(id);
        if (next === undefined) return;
        saveTheme(next);
        setThemeState(next);
    }, []);

    const value = useMemo(() => ({ theme, setTheme }), [theme, setTheme]);

    return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}
