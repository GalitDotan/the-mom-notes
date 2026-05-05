const STORAGE_KEY_PREFIX = 'momnotes';

const getStorageKey = (name) => `${STORAGE_KEY_PREFIX}_${name}`;

const parseJSON = (value) => {
    try {
        return JSON.parse(value);
    } catch (error) {
        return null;
    }
};

const readCollection = (collectionName) => {
    if (typeof window === 'undefined') return [];
    const raw = localStorage.getItem(getStorageKey(collectionName));
    return raw ? parseJSON(raw) || [] : [];
};

const writeCollection = (collectionName, items) => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(getStorageKey(collectionName), JSON.stringify(items));
};

const generateId = () => `${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 11)}`;
const now = () => new Date().toISOString();

const normalizeValue = (value) => {
    if (value === undefined || value === null) {
        return value;
    }
    if (typeof value === 'string') {
        return value.trim();
    }
    return value;
};

const matchesCriteria = (item, criteria = {}) => {
    return Object.entries(criteria).every(([key, criterion]) => {
        if (criterion === undefined || criterion === null) return true;
        const itemValue = item[key];
        if (Array.isArray(itemValue)) {
            return itemValue.includes(criterion);
        }
        if (typeof itemValue === 'string' && typeof criterion === 'string') {
            return itemValue === criterion;
        }
        return itemValue === criterion;
    });
};

const sortItems = (items, sort) => {
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

        if (valueA > valueB) return desc ? -1 : 1;
        if (valueA < valueB) return desc ? 1 : -1;
        return 0;
    });
};

const createEntityStore = (collectionName) => ({
    list: async (sort) => {
        const collection = readCollection(collectionName);
        return sortItems(collection, sort);
    },

    filter: async (criteria = {}, sort = '', limit) => {
        const collection = readCollection(collectionName);
        let results = collection.filter((item) => matchesCriteria(item, criteria));
        results = sortItems(results, sort);
        if (typeof limit === 'number') {
            results = results.slice(0, limit);
        }
        return results;
    },

    get: async (id) => {
        const collection = readCollection(collectionName);
        return collection.find((item) => item.id === id) || null;
    },

    create: async (data) => {
        const collection = readCollection(collectionName);
        const nowValue = now();
        const newItem = {
            id: data.id || generateId(),
            ...data,
            created_date: data.created_date || nowValue,
            updated_date: data.updated_date || nowValue,
        };
        collection.push(newItem);
        writeCollection(collectionName, collection);
        return newItem;
    },

    update: async (id, data) => {
        const collection = readCollection(collectionName);
        const index = collection.findIndex((item) => item.id === id);
        if (index === -1) {
            throw new Error(`Record not found for update: ${id}`);
        }
        const updatedItem = {
            ...collection[index],
            ...data,
            updated_date: now(),
        };
        collection[index] = updatedItem;
        writeCollection(collectionName, collection);
        return updatedItem;
    },

    delete: async (id) => {
        const collection = readCollection(collectionName);
        const filtered = collection.filter((item) => item.id !== id);
        writeCollection(collectionName, filtered);
        return true;
    },
});

export { createEntityStore };
