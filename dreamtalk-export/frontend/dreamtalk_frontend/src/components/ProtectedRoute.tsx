import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/context/AuthContext';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { session, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !session) {
      router.replace('/login');
    }
  }, [session, loading, router]);

  if (loading || !session) {
    return (
      <div className="min-h-screen bg-[#0A0B0A] flex items-center justify-center">
        <div className="text-[#F5F5F0] font-medium text-lg">Loading...</div>
      </div>
    );
  }

  return <>{children}</>;
}

