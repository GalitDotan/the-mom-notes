import { storageKeys } from '@/lib/constants';

export type ThemeAppearance = 'light' | 'dark';

type ThemeDefinition = {
    id: string;
    appearance: ThemeAppearance;
};

/**
 * The app themes. Each id has a palette block in styles/themes.css, keyed on
 * data-theme; data-appearance picks that file's light or dark derivations and
 * drives Tailwind's `dark:` variant. A theme's name and description are
 * translations under `theme.themes.<id>`.
 */
export const THEMES = [
    { id: 'parchment', appearance: 'light' },
    { id: 'frost', appearance: 'light' },
    { id: 'ember', appearance: 'dark' },
    { id: 'velvet', appearance: 'dark' },
    { id: 'ink', appearance: 'dark' },
] as const satisfies readonly ThemeDefinition[];

export type AppTheme = (typeof THEMES)[number];
export type ThemeId = AppTheme['id'];

export const findTheme = (id: unknown): AppTheme | undefined => THEMES.find((theme) => theme.id === id);

/** Must match the attributes index.html puts on <html>. */
export const DEFAULT_THEME: AppTheme = findTheme('velvet') ?? THEMES[0];

/** The saved theme, or the default when none is saved or the saved one is not a known theme. */
export function readSavedTheme(): AppTheme {
    try {
        const saved: unknown = JSON.parse(localStorage.getItem(storageKeys.theme) ?? 'null');
        const savedId = typeof saved === 'object' && saved !== null ? (saved as { id?: unknown }).id : undefined;
        return findTheme(savedId) ?? DEFAULT_THEME;
    } catch {
        return DEFAULT_THEME;
    }
}

/**
 * Saves the theme together with its appearance: index.html applies both
 * before the app's code has loaded, so it cannot look the appearance up here.
 */
export function saveTheme(theme: AppTheme) {
    try {
        localStorage.setItem(storageKeys.theme, JSON.stringify({ id: theme.id, appearance: theme.appearance }));
    } catch {
        // Storage is unavailable (e.g. blocked): the choice lasts for this visit only.
    }
}

/** Shows the theme: themes.css and the `dark:` variant read these attributes on <html>. */
export function applyTheme(theme: AppTheme) {
    const root = document.documentElement;
    root.dataset.theme = theme.id;
    root.dataset.appearance = theme.appearance;
}
