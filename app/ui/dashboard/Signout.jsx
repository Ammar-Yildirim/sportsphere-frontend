'use client';

import { PowerIcon } from "@heroicons/react/24/outline";
import {authApi} from '@/app/axiosConfig';
import {useRouter} from 'next/navigation';
import useAuth from "@/app/hooks/useAuth";

export default function Signout(){
    const router = useRouter()
    const {setToken} = useAuth()

    async function handleSignout(){
        try{
            const logout = await authApi.get('/logout')
            setToken(null)
            router.push('/auth/login')
        }catch (err){
            console.log(err.response)
        }
    }

    return (
      <form action={handleSignout}>
        <button className="flex h-[48px] w-full grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3">
          <PowerIcon className="w-6" />
          <div className="hidden md:block">Sign Out</div>
        </button>
      </form>
    );
}