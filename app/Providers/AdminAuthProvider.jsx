'use client'

import { createContext, useState } from 'react';

const AdminAuthContext = createContext({});

export const AdminAuthProvider = ({ children }) => {
  const [adminToken, setAdminToken] = useState(null);

  return (
    <AdminAuthContext.Provider value={{ 
      adminToken, 
      setAdminToken,
    }}>
      {children}
    </AdminAuthContext.Provider>
  );
};

export default AdminAuthContext;