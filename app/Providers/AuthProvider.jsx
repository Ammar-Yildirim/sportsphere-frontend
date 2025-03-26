'use client'

import { createContext, useState} from 'react';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [userId, setUserId] = useState(null);

  return (
    <AuthContext.Provider value={{ 
      token, 
      setToken, 
      userId, 
      setUserId 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
