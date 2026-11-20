/**
 * The locally signed-in user. This is a name and email kept in the browser,
 * not authentication: there is no password or server.
 */
const USER_STORAGE_KEY = 'momnotes_user';

export type StoredUser = {
  id: string;
  email: string;
  name: string;
  created_at: string;
};

const isValidEmail = (value: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(value);
};

const isStoredUser = (value: unknown): value is StoredUser => {
  if (typeof value !== 'object' || value === null) return false;
  const candidate = value as Record<string, unknown>;
  return ['id', 'email', 'name', 'created_at'].every((field) => typeof candidate[field] === 'string');
};

/** The stored user, or null when absent, unreadable or of an unexpected shape. */
const readUser = (): StoredUser | null => {
  let parsed: unknown;
  try {
    const stored = localStorage.getItem(USER_STORAGE_KEY);
    parsed = stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
  if (parsed !== null && !isStoredUser(parsed)) {
    console.warn('Ignoring stored user record with an unexpected shape.');
    return null;
  }
  return parsed;
};

const writeUser = (user: StoredUser) => {
  localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
};

const clearUser = () => {
  localStorage.removeItem(USER_STORAGE_KEY);
};

const login = async (email: string, name: string): Promise<StoredUser> => {
  if (!email || !name) {
    throw new Error('Email and name are required');
  }

  if (!isValidEmail(email)) {
    throw new Error('Invalid email format');
  }

  const user: StoredUser = {
    id: `local_${Date.now()}`,
    email,
    name,
    created_at: new Date().toISOString(),
  };

  writeUser(user);
  return user;
};

const logout = async (): Promise<void> => {
  clearUser();
};

const me = async (): Promise<StoredUser | null> => {
  return readUser();
};

export const User = { login, logout, me };
export default User;
