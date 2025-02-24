'use client';

import {
    CalendarDaysIcon,
    HomeIcon,
  } from '@heroicons/react/24/outline';
import Link from 'next/link'
import { usePathname } from 'next/navigation';
import {clsx} from 'clsx';

export default function NavbarLinks(){
    const pathName = usePathname();
    
    return(
        <>
            <Link
            href='/dashboard'
            className={clsx(
              'flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3',
              {
                'bg-sky-100 text-blue-600': pathName === '/dashboard',
              },
            )}
          >
            <HomeIcon className="w-6" />
            <p className="hidden md:block">Home</p>
          </Link>
          <Link
            href='/dashboard/events'
            className={clsx(
              'flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3',
              {
                'bg-sky-100 text-blue-600': pathName === '/dashboard/events',
              },
            )}
          >
            <CalendarDaysIcon className="w-6" />
            <p className="hidden md:block">Events</p>
          </Link>
        </>
    )
}