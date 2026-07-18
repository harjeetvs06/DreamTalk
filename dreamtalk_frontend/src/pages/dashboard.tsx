/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import ProtectedRoute from '@/components/ProtectedRoute';
import AvatarCard from '@/components/AvatarCard';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/context/AuthContext';

interface AvatarConfig {
  avatar_id: string;
  name: string;
  profession: string;
  relationship: string;
  tone: string;
  voice_complete: boolean;
  face_complete: boolean;
}

export default function Dashboard() {
  const { user, user_id } = useAuth();
  const [avatars, setAvatars] = useState<AvatarConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    if (!user_id) return;

    const fetchAvatars = async () => {
      setLoading(true);
      setError('');
      try {
        const { data, error } = await supabase
          .from('avatar_config')
          .select('avatar_id, name, profession, relationship, tone, voice_complete, face_complete')
          .eq('user_id', user_id)
          .order('created_at', { ascending: false });

        if (error) {
          setError(error.message);
        } else {
          setAvatars(data || []);
        }
      } catch (err: any) {
        setError(err.message || 'Failed to retrieve avatars.');
      } finally {
        setLoading(false);
      }
    };

    fetchAvatars();
  }, [user_id]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-white text-[#111111] font-sans selection:bg-[#2563EB]/25">
        {/* Navigation Header */}
        <header className="shadow-dream-rest py-4 px-6 md:px-12 bg-white relative z-10">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <span className="font-bold text-lg tracking-tight">DreamTalk</span>
            <div className="flex items-center gap-4">
              <span className="text-xs text-gray-500 hidden sm:inline">{user?.email}</span>
              <button
                onClick={handleSignOut}
                className="text-xs px-3 py-1.5 bg-[#FAFAFA] hover:bg-gray-100 text-[#111111] rounded-md font-medium transition-colors shadow-dream-rest"
              >
                Sign Out
              </button>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="max-w-6xl mx-auto py-12 px-6 md:px-12">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-12">
            <div>
              <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-[#111111]">Your Avatars</h1>
              <p className="text-sm text-gray-500 mt-2">Manage, configure, and interface with your digital twins.</p>
            </div>
            <button
              onClick={() => router.push('/avatar/create/config')}
              className="py-2.5 px-5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-semibold rounded-md text-sm transition-colors text-center shadow-sm"
            >
              + Create New Avatar
            </button>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 text-red-700 text-sm rounded-md shadow-sm">
              {error}
            </div>
          )}

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((n) => (
                <div key={n} className="h-44 rounded-lg animate-pulse bg-[#FAFAFA] shadow-dream-rest" />
              ))}
            </div>
          ) : avatars.length === 0 ? (
            <div className="rounded-lg p-12 text-center max-w-xl mx-auto mt-12 bg-[#FAFAFA] shadow-dream-rest">
              <h3 className="font-bold text-xl text-[#111111] mb-2">No avatars created yet</h3>
              <p className="text-sm text-gray-500 mb-6 max-w-md mx-auto leading-relaxed">
                Get started by configuring your first digital twin, mapping their traits, uploading voice profiles, and syncing their face model.
              </p>
              <button
                onClick={() => router.push('/avatar/create/config')}
                className="py-2.5 px-4 bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-semibold rounded-md text-sm transition-colors"
              >
                Configure First Avatar
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {avatars.map((avatar) => (
                <AvatarCard key={avatar.avatar_id} avatar={avatar} />
              ))}
            </div>
          )}
        </main>
      </div>
    </ProtectedRoute>
  );
}
