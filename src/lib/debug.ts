/**
 * Debug helper for localStorage and entity operations.
 * Exposed as `window.DEBUG` in development builds only (see main.tsx).
 */

const STORAGE_KEY_PREFIX = 'momnotes_';
const USER_STORAGE_KEY = 'momnotes_user';

/** Parses JSON, falling back to the raw string for non-JSON values. */
const parseStoredValue = (raw: string | null): unknown => {
    if (raw === null) return null;
    try {
        return JSON.parse(raw);
    } catch {
        return raw;
    }
};

export const createDebugHelper = () => ({
    /** All localStorage contents for this origin. */
    viewStorage: () => {
        const data: Record<string, unknown> = {};
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key !== null) {
                data[key] = parseStoredValue(localStorage.getItem(key));
            }
        }
        return data;
    },

    /** A single collection, e.g. `viewCollection('notes')`. */
    viewCollection: (name: string) => parseStoredValue(localStorage.getItem(`${STORAGE_KEY_PREFIX}${name}`)),

    /** Removes every momnotes_* key, i.e. all local research data. */
    clearAll: () => {
        const keys: string[] = [];
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key?.startsWith(STORAGE_KEY_PREFIX)) {
                keys.push(key);
            }
        }
        keys.forEach((key) => localStorage.removeItem(key));
        console.log(`Cleared ${keys.length} storage keys:`, keys);
    },

    getUser: () => parseStoredValue(localStorage.getItem(USER_STORAGE_KEY)),

    /** Signs in as the given user without going through the login page. */
    setUser: (email: string, name: string) => {
        const user = {
            id: `local_${Date.now()}`,
            email,
            name,
            created_at: new Date().toISOString(),
        };
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
        console.log('User set:', user);
        return user;
    },

    /** Checks that localStorage can be written and read back. */
    testStorage: () => {
        const testKey = `${STORAGE_KEY_PREFIX}test_${Date.now()}`;
        try {
            localStorage.setItem(testKey, JSON.stringify({ test: true }));
            const retrieved = parseStoredValue(localStorage.getItem(testKey));
            localStorage.removeItem(testKey);
            const ok = typeof retrieved === 'object' && retrieved !== null;
            console.log(ok ? '✓ localStorage working correctly' : '✗ localStorage read-back mismatch');
            return ok;
        } catch (error) {
            console.error('✗ localStorage error:', error);
            return false;
        }
    },

    getDashboards: () => parseStoredValue(localStorage.getItem(`${STORAGE_KEY_PREFIX}dashboards`)) ?? [],
});
