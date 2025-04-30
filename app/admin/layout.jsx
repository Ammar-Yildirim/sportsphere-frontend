"use client";

import { useEffect, useState } from "react";
import { AdminAuthProvider } from "@/app/Providers/AdminAuthProvider";
import useAdminAuth from "@/app/hooks/useAdminAuth";
import { adminAuthApi } from "@/app/axiosConfig";
import { useRouter, usePathname } from "next/navigation";
import AdminNavbar from "@/app/ui/admin/AdminNavbar";
import Spinner from "@/app/ui/dashboard/Spinner";
import { poppins } from "@/app/ui/fonts";

function AdminLayoutContent({ children }) {
  const { adminToken, setAdminToken } = useAdminAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkAdminAuth() {
      if (pathname === "/admin/login") {
        setLoading(false);
        return;
      }

      try {
        if (!adminToken) {
          const { data } = await adminAuthApi.get("/refresh");
          setAdminToken(data.token);
          setLoading(false);
        } else {
          setLoading(false);
        }
      } catch (err) {
        router.push("/admin/login");
      }
    }

    checkAdminAuth();
  }, [pathname]);

  if (loading) {
    return (
      <div className="w-full h-screen">
        <Spinner />
      </div>
    );
  }

  if (pathname === "/admin/login") {
    return children;
  }

  return (
    <div className={`${poppins.className} flex md:flex-row h-screen flex-col`}>
      <div className="w-full flex-none md:w-64">
        <AdminNavbar />
      </div>
      {children}
    </div>
  );
}

export default function AdminLayout({ children }) {
  return (
    <AdminAuthProvider>
      <AdminLayoutContent>{children}</AdminLayoutContent>
    </AdminAuthProvider>
  );
}