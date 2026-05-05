const USER_STORAGE_KEY = 'momnotes_user';

const isValidEmail = (value) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(value);
};

const readUser = () => {
  try {
    const stored = localStorage.getItem(USER_STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
};

const writeUser = (user) => {
  localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
};

const login = async (email, name) => {
  if (!email || !name) {
    throw new Error('Email and name are required');
  }

  if (!isValidEmail(email)) {
    throw new Error('Invalid email format');
  }

  const user = {
    id: `local_${Date.now()}`,
    email,
    name,
    created_at: new Date().toISOString(),
  };

  writeUser(user);
  return user;
};

const me = async () => {
  return readUser();
};

export const User = { login, me };
export default User;