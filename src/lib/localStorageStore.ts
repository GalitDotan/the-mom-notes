/**
 * Browser-local persistence for entity collections.
 *
 * Each collection is stored as a JSON array under `momnotes_<collection>`.
 * These keys hold users' existing research data, so they must not change
 * without a migration.
 */

import { storageKeys } from '@/lib/constants';

/** Fields every stored entity has. Other fields are entity-specific. */
export type EntityRecord = {
    id: string;
    created_date: string;
    updated_date: string;
    [field: string]: unknown;
};

/**
 * Field name to sort by, optionally prefixed with `-` for descending order,
 * e.g. `'-updated_date'`.
 */
export type SortSpec = string;

export type EntityStore<T extends EntityRecord> = {
    list: (sort?: SortSpec) => Promise<T[]>;
    filter: (criteria?: Partial<Record<string, unknown>>, sort?: SortSpec, limit?: number) => Promise<T[]>;
    get: (id: string) => Promise<T | null>;
    create: (data: Partial<T>) => Promise<T>;
    update: (id: string, data: Partial<T>) => Promise<T>;
    delete: (id: string) => Promise<true>;
};

export const getStorageKey = (collectionName: string) => `${storageKeys.collectionPrefix}_${collectionName}`;

const isEntityRecord = (value: unknown): value is EntityRecord =>
    typeof value === 'object' && value !== null && typeof (value as { id?: unknown }).id === 'string';

/**
 * Reads a collection, failing loudly on malformed data.
 *
 * Treating unreadable data as an empty collection would cause the next
 * write to overwrite it, silently destroying the user's research notes.
 */
const readCollection = <T extends EntityRecord>(collectionName: string): T[] => {
    if (typeof window === 'undefined') return [];

    const key = getStorageKey(collectionName);
    const raw = localStorage.getItem(key);
    if (raw === null) return [];

    let parsed: unknown;
    try {
        parsed = JSON.parse(raw);
    } catch {
        throw new Error(`Stored data for "${collectionName}" is not valid JSON (localStorage key "${key}").`);
    }

    if (!Array.isArray(parsed) || !parsed.every(isEntityRecord)) {
        throw new Error(`Stored data for "${collectionName}" is not a list of records (localStorage key "${key}").`);
    }

    // Structure is validated above; entity-specific fields are not.
    return parsed as T[];
};

const writeCollection = <T extends EntityRecord>(collectionName: string, items: T[]) => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(getStorageKey(collectionName), JSON.stringify(items));
};

const generateId = () => `${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 11)}`;
const now = () => new Date().toISOString();

/**
 * A record matches when every non-null criterion equals the record's field,
 * or, for array fields, when the array contains the criterion.
 */
const matchesCriteria = (item: EntityRecord, criteria: Partial<Record<string, unknown>>) =>
    Object.entries(criteria).every(([key, criterion]) => {
        if (criterion === undefined || criterion === null) return true;
        const itemValue = item[key];
        if (Array.isArray(itemValue)) {
            return itemValue.includes(criterion);
        }
        return itemValue === criterion;
    });

/** Sorts a copy of `items`. Records missing the sort field go last. */
const sortItems = <T extends EntityRecord>(items: T[], sort?: SortSpec): T[] => {
    if (!sort) return items;
    const desc = sort.startsWith('-');
    const field = desc ? sort.slice(1) : sort;

    return [...items].sort((a, b) => {
        const valueA = a[field];
        const valueB = b[field];

        if (valueA == null && valueB == null) return 0;
        if (valueA == null) return 1;
        if (valueB == null) return -1;

        if (typeof valueA === 'string' && typeof valueB === 'string') {
            return desc ? valueB.localeCompare(valueA) : valueA.localeCompare(valueB);
        }

        if (typeof valueA === 'number' && typeof valueB === 'number') {
            return desc ? valueB - valueA : valueA - valueB;
        }

        return 0;
    });
};

export const createEntityStore = <T extends EntityRecord = EntityRecord>(collectionName: string): EntityStore<T> => ({
    list: async (sort) => sortItems(readCollection<T>(collectionName), sort),

    filter: async (criteria = {}, sort = '', limit) => {
        const matches = readCollection<T>(collectionName).filter((item) => matchesCriteria(item, criteria));
        const sorted = sortItems(matches, sort);
        return typeof limit === 'number' ? sorted.slice(0, limit) : sorted;
    },

    get: async (id) => readCollection<T>(collectionName).find((item) => item.id === id) ?? null,

    create: async (data) => {
        const collection = readCollection<T>(collectionName);
        const timestamp = now();
        // `data` may omit entity-specific fields; the generic store cannot verify them.
        const newItem = {
            ...data,
            id: data.id || generateId(),
            created_date: data.created_date || timestamp,
            updated_date: data.updated_date || timestamp,
        } as T;
        collection.push(newItem);
        writeCollection(collectionName, collection);
        return newItem;
    },

    update: async (id, data) => {
        const collection = readCollection<T>(collectionName);
        const index = collection.findIndex((item) => item.id === id);
        if (index === -1) {
            throw new Error(`Record not found for update: ${id}`);
        }
        const updatedItem: T = {
            ...collection[index],
            ...data,
            // Identity is stable: an update can never change a record's id.
            id: collection[index].id,
            updated_date: now(),
        };
        collection[index] = updatedItem;
        writeCollection(collectionName, collection);
        return updatedItem;
    },

    delete: async (id) => {
        const collection = readCollection<T>(collectionName);
        writeCollection(collectionName, collection.filter((item) => item.id !== id));
        return true;
    },
});
