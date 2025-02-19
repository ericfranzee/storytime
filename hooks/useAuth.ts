import { useEffect, useState } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '@/app/firebase';

export const useAuth = (): { user: User | null; login: () => void } => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });

    return () => unsubscribe();
  }, []);

  const login = () => {
    // This function can be used to trigger any additional login logic if needed
  };

  return { user, login };
};
