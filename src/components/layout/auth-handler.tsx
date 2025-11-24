'use client';

import { useUser, useAuth } from '@/firebase';
import { initiateAnonymousSignIn } from '@/firebase/non-blocking-login';
import { useEffect } from 'react';

export default function AuthHandler({ children }: { children: React.ReactNode }) {
    const { user, isUserLoading } = useUser();
    const auth = useAuth();
  
    useEffect(() => {
      if (!isUserLoading && !user) {
        initiateAnonymousSignIn(auth);
      }
    }, [isUserLoading, user, auth]);
  
    return <>{children}</>;
  }
