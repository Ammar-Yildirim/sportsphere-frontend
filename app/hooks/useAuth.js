'use client'

import { useContext } from "react";
import AuthContext from "@/app/Providers/AuthProvider";

const useAuth = () => {
    return useContext(AuthContext);
}

export default useAuth;