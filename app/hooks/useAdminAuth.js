'use client'

import { useContext } from "react";
import AdminAuthContext from "@/app/Providers/AdminAuthProvider";

const useAdminAuth = () => {
    return useContext(AdminAuthContext);
}

export default useAdminAuth;