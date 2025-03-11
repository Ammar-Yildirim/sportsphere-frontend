"use client";

import { useEffect, useState } from "react";
import Navbar from "@/app/ui/dashboard/Navbar";
import { poppins } from "@/app/ui/fonts";
import useAuth from "@/app/hooks/useAuth";
import { authApi } from "@/app/axiosConfig";
import { useRouter } from "next/navigation";

export default function Layout({ children }) {
  // const { token, setToken } = useAuth();
  // const router = useRouter();
  // const [loading, setLoading] = useState(true);

  // useEffect(() => {
  //   async function checkAuth() {
  //     console.log(token);
  //     try {
  //       if (!token) {
  //         const newAccessToken = await authApi.get("refresh");
  //         setToken(newAccessToken.data.token);
  //         console.log("New Access Token: " + newAccessToken.data.token);
  //         setLoading(false);
  //       } else {
  //         setLoading(false);
  //       }
  //     } catch (err) {
  //       console.log(err);
  //       console.log("No ACCESS or REFRESH token present");
  //       router.push("/auth/login");
  //     }
  //   }

  //   checkAuth();
  // }, []);

  // if (loading) {
  //   return <div>Loading...</div>;
  // }

  return (
    <div className={`${poppins.className} flex md:flex-row h-screen flex-col`}>
      <div className="w-full flex-none md:w-64">
        <Navbar />
      </div>
      {children}
    </div>
  );
}
