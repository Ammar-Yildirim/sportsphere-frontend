import { AuthProvider } from '@/app/context/AuthProvider'; 

export default function ProtectedLayout({ children }) {

  return (
    <div>
      <AuthProvider>
          Layout {children}
      </AuthProvider>   
    </div>
  );
}
