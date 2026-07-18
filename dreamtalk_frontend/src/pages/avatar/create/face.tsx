/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import ProtectedRoute from '@/components/ProtectedRoute';
import { uploadFaceSample } from '@/lib/brainApi';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/context/AuthContext';

export default function CreateFace() {
  const router = useRouter();
  const { id: avatarId } = router.query;
  const { user_id } = useAuth();
  
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [avatarName, setAvatarName] = useState('Alex');

  // Verify avatar config exists and is owned by this user
  useEffect(() => {
    if (!router.isReady || !avatarId || !user_id) return;

    const checkAvatarConfig = async () => {
      try {
        const { data, error } = await supabase
          .from('avatar_config')
          .select('name')
          .eq('avatar_id', avatarId)
          .eq('user_id', user_id)
          .single();

        if (error || !data) {
          setErrorMsg('Avatar configuration not found or unauthorized.');
        } else {
          setAvatarName(data.name);
        }
      } catch (err) {
        console.error(err);
        setErrorMsg('Failed to check avatar configuration.');
      }
    };

    checkAvatarConfig();
  }, [router.isReady, avatarId, user_id]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
      setErrorMsg('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!avatarId || typeof avatarId !== 'string') {
      setErrorMsg('Invalid avatar identifier.');
      return;
    }
    if (!file) {
      setErrorMsg('Please select a video/face sample file first.');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    try {
      // Call face avatar api proxy
      const data = await uploadFaceSample(avatarId, file);

      if (!data.success) {
        throw new Error(data.message || 'Face model upload failed.');
      }

      // Update Supabase configuration complete state
      const { error: updateError } = await supabase
        .from('avatar_config')
        .update({
          face_complete: true,
          face_sample_url: data.face_sample_url || '',
        })
        .eq('avatar_id', avatarId)
        .eq('user_id', user_id);

      if (updateError) {
        throw updateError;
      }

      // Route back to Dashboard on complete
      router.push('/dashboard');
    } catch (err: any) {
      setErrorMsg(err.message || 'An error occurred uploading the face sample.');
    } finally {
      setLoading(false);
    }
  };

  const handleDevSkip = async () => {
    if (!avatarId || typeof avatarId !== 'string') {
      setErrorMsg('Invalid avatar identifier.');
      return;
    }
    setLoading(true);
    setErrorMsg('');
    try {
      const { error: updateError } = await supabase
        .from('avatar_config')
        .update({
          face_complete: true,
        })
        .eq('avatar_id', avatarId)
        .eq('user_id', user_id);

      if (updateError) {
        throw updateError;
      }

      router.push(`/avatar/${avatarId}/chat`);
    } catch (err: any) {
      setErrorMsg(err.message || 'An error occurred skipping the face setup.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-white text-[#111111] font-sans">
        {/* Header */}
        <header className="shadow-dream-rest py-4 px-6 md:px-12 bg-white relative z-10">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <span className="font-bold text-lg tracking-tight cursor-pointer" onClick={() => router.push('/dashboard')}>
              DreamTalk
            </span>
            <button
              onClick={() => router.push('/dashboard')}
              className="text-xs px-3 py-1.5 bg-[#FAFAFA] hover:bg-gray-100 text-[#111111] rounded-md font-medium transition-colors shadow-dream-rest"
            >
              Cancel Wizard
            </button>
          </div>
        </header>

        {/* Wizard Progress Bar */}
        <div className="max-w-4xl mx-auto pt-10 px-6">
          <div className="flex items-center justify-center space-x-4 md:space-x-8 mb-12 text-sm font-semibold">
            <div className="flex items-center space-x-2 text-gray-500 cursor-pointer" onClick={() => router.push(`/avatar/create/config?id=${avatarId}`)}>
              <span className="h-8 w-8 rounded-full flex items-center justify-center text-sm font-bold bg-green-50 text-green-700">✓</span>
              <span>Identity & Traits</span>
            </div>
            <div className="h-px bg-gray-300 w-12 md:w-20" />
            <div className="flex items-center space-x-2 text-gray-500 cursor-pointer" onClick={() => router.push(`/avatar/create/voice?id=${avatarId}`)}>
              <span className="h-8 w-8 rounded-full flex items-center justify-center text-sm font-bold bg-green-50 text-green-700">✓</span>
              <span>Voice Setup</span>
            </div>
            <div className="h-px bg-gray-300 w-12 md:w-20" />
            <div className="flex items-center space-x-2 text-[#2563EB]">
              <span className="h-8 w-8 rounded-full border-2 border-[#2563EB] flex items-center justify-center text-sm font-bold">3</span>
              <span>Face Setup</span>
            </div>
          </div>

          <div className="text-center mb-12">
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-[#111111]">Face Model Sync</h1>
            <p className="text-sm text-gray-500 mt-2 max-w-md mx-auto">
              Upload a clear video or image clip (MP4 or MOV) to sync physical gestures and facial features for {avatarName}.
            </p>
          </div>

          {errorMsg && (
            <div className="max-w-xl mx-auto mb-6 p-4 bg-red-50 text-red-700 text-sm rounded-md shadow-sm">
              {errorMsg}
            </div>
          )}

          <div className="pb-16">
            <form onSubmit={handleSubmit} className="space-y-6 max-w-xl mx-auto bg-white p-6 md:p-8 rounded-lg shadow-dream-rest">
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-[#111111] uppercase tracking-wider mb-2">
                  Face Video File
                </label>
                
                <div className="flex flex-col items-center justify-center rounded-lg p-8 bg-[#FAFAFA] text-center transition-shadow shadow-dream-rest hover:shadow-dream-hover relative cursor-pointer group">
                  <input
                    type="file"
                    accept="video/*,image/*"
                    required
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div className="space-y-1">
                    <svg
                      className="mx-auto h-8 w-8 text-gray-400 group-hover:text-[#2563EB] transition-colors"
                      stroke="currentColor"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                      />
                    </svg>
                    <p className="text-sm font-semibold text-[#111111]">
                      {file ? file.name : 'Click to select video file'}
                    </p>
                    <p className="text-xs text-gray-500">MP4, MOV or image files under 50MB</p>
                  </div>
                </div>
              </div>

              {file && (
                <div className="bg-[#FAFAFA] rounded p-3 text-xs flex justify-between items-center text-[#111111] shadow-sm">
                  <div>
                    <span className="font-semibold block truncate max-w-[280px]">{file.name}</span>
                    <span className="text-gray-500 font-medium">{(file.size / (1024 * 1024)).toFixed(2)} MB</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setFile(null)}
                    className="text-red-600 hover:text-red-700 font-semibold"
                  >
                    Clear
                  </button>
                </div>
              )}

              <button
                type="submit"
                disabled={loading || !file}
                className="w-full py-2.5 px-4 bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-semibold rounded-md text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-[#2563EB]/50 disabled:opacity-50"
              >
                {loading ? 'Processing visual model...' : 'Complete Avatar Integration'}
              </button>

              {process.env.NODE_ENV === 'development' && (
                <button
                  type="button"
                  onClick={handleDevSkip}
                  disabled={loading}
                  className="w-full mt-4 text-xs text-gray-400 hover:text-gray-600 underline text-center cursor-pointer transition-colors focus:outline-none disabled:opacity-50"
                >
                  Skip for now (dev only)
                </button>
              )}
            </form>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
