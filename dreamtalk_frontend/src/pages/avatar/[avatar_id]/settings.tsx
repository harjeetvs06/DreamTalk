import { useRouter } from 'next/router';

export default function SettingsPlaceholder() {
  const router = useRouter();
  const { avatar_id } = router.query;

  return (
    <div className="min-h-screen bg-white text-[#111111] flex items-center justify-center p-6 font-sans">
      <div className="max-w-md w-full shadow-dream-rest p-8 rounded-lg text-center bg-[#FAFAFA]">
        <h1 className="text-xl font-bold mb-2">Avatar Settings</h1>
        <p className="text-sm text-gray-500 mb-6">
          Settings configuration for avatar model ID {avatar_id} is currently locked. Modification of persona parameters, tone profiles, and gesture inputs will be available in a future version.
        </p>
        <button
          onClick={() => router.push(avatar_id ? `/avatar/${avatar_id}/chat` : '/dashboard')}
          className="py-2.5 px-4 bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-semibold rounded-md text-sm transition-colors focus:outline-none"
        >
          Return to Conversation
        </button>
      </div>
    </div>
  );
}
