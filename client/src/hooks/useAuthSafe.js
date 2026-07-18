import { useAuth as useClerkAuth } from '@clerk/clerk-react';

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
const isValidKey = PUBLISHABLE_KEY && PUBLISHABLE_KEY.startsWith("pk_");

/**
 * A safe wrapper around Clerk's useAuth hook.
 * If Clerk is not configured or initialized, it falls back gracefully
 * to a signed-out state rather than throwing a render error.
 */
export function useAuthSafe() {
  if (isValidKey) {
    return useClerkAuth();
  }
  
  // Safe mock return when Clerk is disabled/unconfigured
  return {
    isSignedIn: false,
    userId: null,
    orgId: null,
    sessionId: null,
    actor: null,
    getToken: async () => null,
  };
}
