'use client'

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function AdminHomePage() {
  const router = useRouter();
  
  useEffect(() => {
    router.push('/admin/users');
  }, []);
  
  return null;
}