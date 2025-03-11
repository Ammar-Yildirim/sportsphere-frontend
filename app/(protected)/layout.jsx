"use client";

import { AuthProvider } from "@/app/Providers/AuthProvider";

export default function ProtectedLayout({ children }) {
  return <AuthProvider>{children}</AuthProvider>;
}
