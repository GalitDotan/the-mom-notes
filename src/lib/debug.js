/**
 * Debug helper for localStorage and entity operations
 * Available in browser console as window.DEBUG
 */

export const createDebugHelper = () => {
  return {
    // View localStorage contents
    viewStorage: () => {
      const data = {};
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        data[key] = JSON.parse(localStorage.getItem(key));
      }
      return data;
    },

    // View a specific collection
    viewCollection: (name) => {
      const key = `momnotes_${name}`;
      const value = localStorage.getItem(key);
      return value ? JSON.parse(value) : null;
    },

    // Clear all momnotes data
    clearAll: () => {
      const keys = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key?.startsWith('momnotes_')) {
          keys.push(key);
        }
      }
      keys.forEach(key => localStorage.removeItem(key));
      console.log(`Cleared ${keys.length} storage keys:`, keys);
    },

    // Get current user
    getUser: () => {
      const user = localStorage.getItem('momnotes_user');
      return user ? JSON.parse(user) : null;
    },

    // Set user (for testing)
    setUser: (email, name) => {
      const user = {
        id: `local_${Date.now()}`,
        email,
        name,
        created_at: new Date().toISOString(),
      };
      localStorage.setItem('momnotes_user', JSON.stringify(user));
      console.log('User set:', user);
      return user;
    },

    // Test localStorage write/read
    testStorage: () => {
      const testKey = 'momnotes_test_' + Date.now();
      const testData = { test: true, timestamp: Date.now() };
      try {
        localStorage.setItem(testKey, JSON.stringify(testData));
        const retrieved = JSON.parse(localStorage.getItem(testKey));
        localStorage.removeItem(testKey);
        console.log('✓ localStorage working correctly');
        return true;
      } catch (error) {
        console.error('✗ localStorage error:', error);
        return false;
      }
    },

    // View dashboards
    getDashboards: () => {
      return JSON.parse(localStorage.getItem('momnotes_dashboards') || '[]');
    },

    // Test create dashboard
    testCreateDashboard: async (name, ownerEmail) => {
      try {
        const dashboards = JSON.parse(localStorage.getItem('momnotes_dashboards') || '[]');
        const newDashboard = {
          id: `${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 11)}`,
          name,
          owner_email: ownerEmail,
          created_date: new Date().toISOString(),
          updated_date: new Date().toISOString(),
        };
        dashboards.push(newDashboard);
        localStorage.setItem('momnotes_dashboards', JSON.stringify(dashboards));
        console.log('✓ Test dashboard created:', newDashboard);
        return newDashboard;
      } catch (error) {
        console.error('✗ Failed to create test dashboard:', error);
        return null;
      }
    },
  };
};
