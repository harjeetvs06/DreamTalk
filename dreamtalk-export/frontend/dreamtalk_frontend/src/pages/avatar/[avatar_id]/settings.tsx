import { useRouter } from 'next/router';

export default function SettingsPlaceholder() {
  const router = useRouter();
  const { avatar_id } = router.query;

  return (
    <div className="min-h-screen bg-[#0A0B0A] text-[#F5F5F0] flex items-center justify-center p-6 font-sans">
      <div className="max-w-md w-full p-8 md:p-10 rounded-3xl text-center bg-[#161715]">
        <h1 className="text-xl font-bold font-heading mb-2 text-[#F5F5F0]">Avatar Settings</h1>
        <p className="text-sm text-[#9CA39A] mb-6 leading-relaxed">
          Settings configuration for avatar model ID {avatar_id} is currently locked. Modification of persona parameters, tone profiles, and gesture inputs will be available in a future version.
        </p>
        <button
          onClick={() => router.push(avatar_id ? `/avatar/${avatar_id}/chat` : '/dashboard')}
          className="py-3.5 px-6 bg-[#C8F02D] hover:bg-[#B3D928] text-[#0A0B0A] font-bold rounded-full text-sm transition-colors focus:outline-none cursor-pointer"
        >
          Return to Conversation
        </button>
      </div>
    </div>
  );
}


