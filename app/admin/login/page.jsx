'use client'

import { useState } from 'react';
import { adminAuthApi } from '@/app/axiosConfig';
import useAdminAuth from '@/app/hooks/useAdminAuth';
import { useRouter } from 'next/navigation';
import SportSphereLogo from '@/app/ui/sportsphere-logo';
import { lusitana } from '@/app/ui/fonts';
import { FaExclamationCircle } from "react-icons/fa";
import { LoginSchema as AdminLoginSchema } from '@/app/schemas/schemas';

export default function AdminLoginPage() {
  const { setAdminToken } = useAdminAuth();
  const router = useRouter();
  const [errorMessages, setErrorMessages] = useState([]);

  async function handleAdminLogin(formData) {
    const data = Object.fromEntries(formData);
    const validatedData = AdminLoginSchema.safeParse(data);

    if (!validatedData.success) {
      const formattedErrors = validatedData.error.errors.map(error => error.message);
      setErrorMessages(formattedErrors);
      return;
    }

    setErrorMessages([]);

    try {
      const { data } = await adminAuthApi.post("/authenticate", {
        ...validatedData.data,
      });

      setAdminToken(data.token);
      router.push("/admin/users");
    } catch (err) {
      if (!err.response) {
        setErrorMessages([
          "Server's are down, please try again later"
        ]);
        return;
      }

      setErrorMessages([err.response.data.message || 'Authentication failed. Please check your credentials.']);
    }
  }

  return (
    <main className="flex items-center justify-center md:h-screen">
      <div className="relative mx-auto flex w-full max-w-[500px] flex-col space-y-2.5 p-4">
        <div className="flex h-20 w-full items-end rounded-lg bg-blue-700 p-3 md:h-36">
          <div className="w-32 text-white md:w-80">
            <SportSphereLogo />
          </div>
        </div>
        <form action={handleAdminLogin}>
          <div className="flex-1 rounded-lg bg-gray-50 px-6 pb-4 pt-6">
            <div className="w-full">
              <h1 className={`${lusitana.className} mb-3 text-xl`}>
                Admin Login
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
                  placeholder="Enter admin email address"
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
                  placeholder="Enter admin password"
                  name="password"
                  type="password"
                  required
                ></input>
              </div>

              <button
                className="text-lg font-medium w-full h-10 bg-blue-700 rounded-lg text-gray-50 mt-5 cursor-pointer hover:bg-blue-600
              focus-visible:outline-blue-500 active:bg-blue-800"
                type="submit"
              >
                Log in
              </button>

              <div className="mt-3">
                {errorMessages.length > 0 && (
                  <div className="bg-red-50 p-3 rounded-md border border-red-200">
                    {errorMessages.map((error, index) => (
                      <div key={index} className="flex items-center space-x-1 mb-1">
                        <FaExclamationCircle className="text-red-500 h-4 w-4 flex-shrink-0" />
                        <p className="text-sm text-red-500">{error}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </form>
      </div>
    </main>
  );
}