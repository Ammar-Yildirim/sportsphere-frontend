"use client";

import { useEffect, useState } from "react";
import Navbar from "@/app/ui/dashboard/Navbar";
import { poppins } from "@/app/ui/fonts";
import useAuth from "@/app/hooks/useAuth";
import { authApi } from "@/app/axiosConfig";
import { useRouter } from "next/navigation";
import Spinner from "@/app/ui/dashboard/Spinner";

export default function Layout({ children }) {
  const { token, setToken } = useAuth();
  const { setUserId } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkAuth() {
      try {
        if (!token) {
          const { data } = await authApi.get("/refresh");
          setToken(data.token);
          setUserId(data.userId);
          setLoading(false);
        } else {
          setLoading(false);
        }
      } catch (err) {
        console.log(err);
        router.push("/auth/login");
      }
    }

    checkAuth();
  }, []);

  if (loading) {
    return (
      <div className="w-full h-screen">
        <Spinner />
      </div>
    );
  }

  return (
    <div className={`${poppins.className} flex md:flex-row h-screen flex-col`}>
      <div className="w-full flex-none md:w-64">
        <Navbar />
      </div>
      {children}
    </div>
  );
}
