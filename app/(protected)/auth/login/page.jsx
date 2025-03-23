'use client'

import { LoginSchema } from '@/app/schemas/schemas';
import {useState} from 'react';
import useAuth from '@/app/hooks/useAuth';
import {authApi} from '@/app/axiosConfig';
import {useRouter} from 'next/navigation';
import SportSphereLogo from '@/app/ui/sportsphere-logo';
import { lusitana } from '@/app/ui/fonts';
import { FaExclamationCircle } from "react-icons/fa";


export default function LoginPage(){
    const {setToken} = useAuth()
    const router = useRouter()
    const [errorMessage, setErrorMessage] = useState(null)

    async function handleLogin(formData) {
        const data = Object.fromEntries(formData)
        const validatedData = LoginSchema.safeParse(data);
    
        if (!validatedData.success) {
            console.log(validatedData.error);
            setErrorMessage("Invalid input! Please check your credentials.");
            return;
        }

        try {
            const response = await authApi.post('/authenticate', {
                ...validatedData.data
            });

            setToken(response.data.token);
            router.push('/dashboard');
        } catch (err) {
            console.error("Error status: ", err);
            setErrorMessage(err.response.data.message)
        }
    }

    return (
      <main className="flex items-center justify-center md:h-screen">
        <div className="relative mx-auto flex w-full max-w-[500px] flex-col space-y-2.5 p-4">
          <div className="flex h-20 w-full items-end rounded-lg bg-blue-500 p-3 md:h-36">
            <div className="w-32 text-white md:w-80">
              <SportSphereLogo />
            </div>
          </div>
          <form action={handleLogin}>
            <div className="flex-1 rounded-lg bg-gray-50 px-6 pb-4 pt-6">
              <div className="w-full">
                <h1 className={`${lusitana.className} mb-3 text-xl`}>
                  Please log in to continue.
                </h1>
                <div>
                  <label
                    className="mb-3 mt-5 block text-xs font-medium text-gray-900"
                    htmlFor="email"
                  >
                    Email
                  </label>
                  <input
                    className="w-full py-[9px] px-1.5 rounded-md border border-gray-300 text-sm outline-none placeholder:text-gray-500
                    focus:border-blue-600"
                    placeholder="Enter your email address here"
                    name="email"
                    type="email"
                    required
                  ></input>
                </div>

                <div>
                  <label
                    className="mb-3 mt-5 block text-xs font-medium text-gray-900"
                    htmlFor="password"
                  >
                    Password
                  </label>
                  <input
                    className="w-full py-[9px] px-1.5 rounded-md border border-gray-300 text-sm outline-none placeholder:text-gray-500
                    focus:border-blue-600"
                    placeholder="Enter password"
                    name="password"
                    type="password"
                    required
                  ></input>
                </div>

                <button
                  className="text-lg font-medium w-full h-10 bg-blue-500 rounded-lg text-gray-50 mt-5 cursor-pointer hover:bg-blue-400
                focus-visible:outline-blue-500 active:bg-blue-600"
                  type="submit"
                >
                  Log in
                </button>

                <div className="flex h-8 items-center space-x-1">
                  {errorMessage && (
                    <>
                      <FaExclamationCircle  className="text-red-500 h-4 w-4" />
                      <p className="text-sm text-red-500">{errorMessage}</p>
                    </>
                  )}
                </div>
              </div>
            </div>
          </form>
        </div>
      </main>
    );
}