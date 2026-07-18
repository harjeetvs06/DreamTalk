/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import { useRouter } from 'next/router';
import ProtectedRoute from '@/components/ProtectedRoute';
import ConfigForm from '@/components/ConfigForm';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/context/AuthContext';

export default function CreateConfig() {
  const { user_id } = useAuth();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const router = useRouter();

  const handleConfigSubmit = async (formData: any) => {
    if (!user_id) {
      setErrorMsg('You must be logged in to configure an avatar.');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    try {
      const avatar_id = crypto.randomUUID();

      // Insert row into Supabase avatar_config table
      const { error } = await supabase.from('avatar_config').insert({
        avatar_id,
        user_id,
        name: formData.name,
        profession: formData.profession,
        relationship: formData.relationship,
        tone: formData.tone,
        traits: formData.traits, // JSONB structure
        voice_complete: false,
        face_complete: false,
      });

      if (error) {
        setErrorMsg(error.message);
      } else {
        // Successfully created config, route to Voice step
        router.push(`/avatar/create/voice?id=${avatar_id}`);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'An unexpected error occurred during save.');
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
              Back to Dashboard
            </button>
          </div>
        </header>

        {/* Wizard Progress Bar */}
        <div className="max-w-4xl mx-auto pt-10 px-6">
          <div className="flex items-center justify-center space-x-4 md:space-x-8 mb-12 text-sm font-semibold">
            <div className="flex items-center space-x-2 text-[#2563EB]">
              <span className="h-8 w-8 rounded-full border-2 border-[#2563EB] flex items-center justify-center text-sm font-bold">1</span>
              <span>Identity & Traits</span>
            </div>
            <div className="h-px bg-gray-300 w-12 md:w-20" />
            <div className="flex items-center space-x-2 text-gray-400">
              <span className="h-8 w-8 rounded-full border border-gray-300 flex items-center justify-center text-sm font-bold">2</span>
              <span>Voice Setup</span>
            </div>
            <div className="h-px bg-gray-300 w-12 md:w-20" />
            <div className="flex items-center space-x-2 text-gray-400">
              <span className="h-8 w-8 rounded-full border border-gray-300 flex items-center justify-center text-sm font-bold">3</span>
              <span>Face Setup</span>
            </div>
          </div>

          <div className="text-center mb-12">
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-[#111111]">Configure Persona</h1>
            <p className="text-sm text-gray-500 mt-2 max-w-md mx-auto">
              Define the personality traits, background, and relationships that map your avatar twin.
            </p>
          </div>

          {errorMsg && (
            <div className="max-w-xl mx-auto mb-6 p-4 bg-red-50 text-red-700 text-sm rounded-md shadow-sm">
              {errorMsg}
            </div>
          )}

          <div className="pb-16">
            <ConfigForm onSubmit={handleConfigSubmit} loading={loading} />
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
