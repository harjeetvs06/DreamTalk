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
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-[#111111] font-medium text-lg">Loading...</div>
      </div>
    );
  }

  return <>{children}</>;
}
