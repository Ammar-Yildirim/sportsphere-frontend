import { AuthProvider } from '@/app/context/AuthProvider'; 

export default function ProtectedLayout({ children }) {
  return (
    <AuthProvider>
        {children}
    </AuthProvider>   
  );
}
