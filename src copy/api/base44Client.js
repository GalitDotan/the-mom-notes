import { createClient } from '@base44/sdk';
// import { getAccessToken } from '@base44/sdk/utils/auth-utils';

// Create a client with authentication required
export const base44 = createClient({
  appId: "683aa752ded8787c2f8f8a57", 
  requiresAuth: true // Ensure authentication is required for all operations
});
