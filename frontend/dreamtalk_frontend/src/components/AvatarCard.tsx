import { useRouter } from 'next/router';

interface AvatarConfig {
  avatar_id: string;
  name: string;
  profession: string;
  relationship: string;
  tone: string;
  voice_complete: boolean;
  face_complete: boolean;
}

interface AvatarCardProps {
  avatar: AvatarConfig;
}

export default function AvatarCard({ avatar }: AvatarCardProps) {
  const router = useRouter();

  const isComplete = avatar.voice_complete && avatar.face_complete;

  const getStatusText = () => {
    if (isComplete) return 'Complete';
    if (!avatar.voice_complete) return 'Setup Voice';
    return 'Setup Face';
  };

  const handleCardClick = () => {
    if (isComplete) {
      router.push(`/avatar/${avatar.avatar_id}/chat`);
    } else if (!avatar.voice_complete) {
      router.push(`/avatar/create/voice?id=${avatar.avatar_id}`);
    } else {
      router.push(`/avatar/create/face?id=${avatar.avatar_id}`);
    }
  };

  return (
    <div
      onClick={handleCardClick}
      className="group cursor-pointer bg-[#161715] hover:bg-[#1F211E] rounded-3xl p-6 transition-all duration-200 ease-in-out hover:-translate-y-0.5 flex flex-col justify-between h-44 select-none"
    >
      <div>
        <div className="flex justify-between items-start gap-2">
          <h3 className="font-bold text-lg text-[#F5F5F0] leading-tight group-hover:text-[#C8F02D] transition-colors truncate font-heading">
            {avatar.name}
          </h3>
          <span
            className={`text-xs px-3 py-1 rounded-full font-semibold ${
              isComplete
                ? 'bg-[#C8F02D]/15 text-[#C8F02D]'
                : 'bg-[#9CA39A]/15 text-[#9CA39A]'
            }`}
          >
            {getStatusText()}
          </span>
        </div>
        <p className="text-sm text-[#9CA39A] mt-1 truncate">{avatar.profession}</p>
        <div className="mt-3 flex gap-2 flex-wrap">
          <span className="text-xs bg-[#0A0B0A] px-3 py-1 rounded-full text-[#9CA39A]">
            {avatar.relationship}
          </span>
          <span className="text-xs bg-[#0A0B0A] px-3 py-1 rounded-full text-[#9CA39A]">
            {avatar.tone}
          </span>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between pt-3">
        <span className="text-xs text-[#C8F02D] font-semibold group-hover:underline">
          {isComplete ? 'Interface' : 'Continue wizard'} →
        </span>
      </div>
    </div>
  );
}


