import { useEffect, useState, useCallback } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '@/app/firebase';

// Define the structure of the auth state and actions
interface AuthState {
  user: User | null;
  loading: boolean; // Add loading state
  error: string | null; // Add error state
}

interface AuthActions {
  login: () => void; // Keep login if needed for other triggers
  logout: () => Promise<void>; // Add logout function
}

export const useAuth = (): AuthState & AuthActions => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true); // Start loading initially
  const [error, setError] = useState<string | null>(null);

  // Function to call the session login API
  const createSession = useCallback(async (firebaseUser: User | null) => {
    setError(null); // Reset error
    if (firebaseUser) {
      try {
        const idToken = await firebaseUser.getIdToken();
        const response = await fetch('/api/auth/sessionLogin', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ idToken }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to create session');
        }
        // console.log('Session cookie created successfully.'); // Removed
        setUser(firebaseUser); // Confirm user state after successful session creation
      } catch (err) {
        console.error('Error creating session:', err);
        setError((err as Error).message || 'Session creation failed.');
        // Optionally sign out the user on the client if session creation fails
        await auth.signOut();
        setUser(null);
      }
    } else {
      // User logged out, clear session (optional: call a logout API endpoint)
      // For simplicity, we assume logout clears client state and middleware handles redirects
      setUser(null);
      // Optionally call a server endpoint to clear the cookie if needed
      // await fetch('/api/auth/sessionLogout', { method: 'POST' });
    }
    setLoading(false); // Stop loading once session logic is complete
  }, []);

  useEffect(() => {
    setLoading(true); // Set loading true when listener starts
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      console.log('Auth state changed:', firebaseUser?.uid);
      if (firebaseUser) {
        console.log('Attempting to create session for user:', firebaseUser.uid);
      } else {
        console.log('Attempting to clear session for logged out user.');
      }
      createSession(firebaseUser); // Call session creation/clearing logic
    });

    // Cleanup subscription on unmount
    return () => {
      unsubscribe();
      setLoading(false); // Ensure loading is false on unmount
    };
  }, [createSession]); // Add createSession to dependency array

  // Placeholder login function (might not be needed if modals handle sign-in directly)
  const login = () => {
    // This function might be redundant now, but kept for compatibility
    console.log("useAuth login function called (may be redundant)");
  };

  // Logout function
  const logout = async () => {
    setLoading(true);
    setError(null);
    try {
      await auth.signOut(); // Sign out from Firebase client
      // The onAuthStateChanged listener will trigger createSession(null)
      // Optionally call a server endpoint to explicitly clear the cookie
      await fetch('/api/auth/sessionLogout', { method: 'POST' }); // Assuming you create this endpoint
      // console.log('User logged out.'); // Removed
    } catch (err) {
      console.error('Logout error:', err);
      setError((err as Error).message || 'Logout failed.');
    } finally {
      // Loading state will be handled by the onAuthStateChanged listener callback
    }
  };


  return { user, loading, error, login, logout };
};
