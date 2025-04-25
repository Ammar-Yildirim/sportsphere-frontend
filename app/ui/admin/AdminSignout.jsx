// app/ui/admin/AdminSignout.jsx
'use client'

import { PowerIcon } from '@heroicons/react/24/outline';
import { adminAuthApi } from '@/app/axiosConfig';
import useAdminAuth from '@/app/hooks/useAdminAuth';
import { useRouter } from 'next/navigation';

export default function AdminSignout() {
  const { adminToken, setAdminToken } = useAdminAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      if (adminToken) {
        await adminAuthApi.get('/logout');
      }
    } catch (error) {
      console.error('Error during logout:', error);
    } finally {
      setAdminToken(null);
      router.push('/admin/login');
    }
  };

  return (
    <button
      className="flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-700 md:flex-none md:justify-start md:p-2 md:px-3"
      onClick={handleSignOut}
    >
        <PowerIcon className="w-6" />   
      <div className="hidden md:block">Sign Out</div>
    </button>
  );
}