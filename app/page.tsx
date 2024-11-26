'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation'; // Asegúrate de importar desde 'next/navigation'
import useAuthStore from '@/store/auth/AuthStore';

export default function Home() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard');
    } else {
      router.push('/auth');
    }
  }, [isAuthenticated, router]);

  return null; 
}
