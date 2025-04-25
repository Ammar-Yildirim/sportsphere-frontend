'use client';

import {
  UserGroupIcon,
  CalendarDaysIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link'
import { usePathname } from 'next/navigation';
import { clsx } from 'clsx';

export default function AdminNavbarLinks() {
  const pathName = usePathname();
  
  return (
    <>
      <Link
        href='/admin/users'
        className={clsx(
          'flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-700 md:flex-none md:justify-start md:p-2 md:px-3',
          {
            'bg-sky-100 text-blue-700': pathName === '/admin/users',
          },
        )}
      >
        <UserGroupIcon className="w-6" />
        <p className="hidden md:block">Users</p>
      </Link>
      <Link
        href='/admin/events'
        className={clsx(
          'flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-700 md:flex-none md:justify-start md:p-2 md:px-3',
          {
            'bg-sky-100 text-blue-700': pathName === '/admin/events',
          },
        )}
      >
        <CalendarDaysIcon className="w-6" />
        <p className="hidden md:block">Events</p>
      </Link>
    </>
  )
}