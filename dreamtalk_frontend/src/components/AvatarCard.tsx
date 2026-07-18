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
      className="group cursor-pointer bg-white rounded-lg p-6 transition-all duration-150 ease-in-out hover:-translate-y-1 shadow-dream-rest hover:shadow-dream-hover flex flex-col justify-between h-44"
    >
      <div>
        <div className="flex justify-between items-start gap-2">
          <h3 className="font-bold text-lg text-[#111111] leading-tight group-hover:text-[#2563EB] transition-colors truncate">
            {avatar.name}
          </h3>
          <span
            className={`text-xs px-2.5 py-0.5 rounded-full font-semibold ${
              isComplete
                ? 'bg-green-50 text-green-700'
                : 'bg-yellow-50 text-yellow-700'
            }`}
          >
            {getStatusText()}
          </span>
        </div>
        <p className="text-sm text-gray-500 mt-1 truncate">{avatar.profession}</p>
        <div className="mt-3 flex gap-2 flex-wrap">
          <span className="text-xs bg-gray-100 px-2 py-0.5 rounded text-gray-600">
            {avatar.relationship}
          </span>
          <span className="text-xs bg-gray-100 px-2 py-0.5 rounded text-gray-600">
            {avatar.tone}
          </span>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between pt-3">
        <span className="text-xs text-[#2563EB] font-semibold group-hover:underline">
          {isComplete ? 'Interface' : 'Continue wizard'} →
        </span>
      </div>
    </div>
  );
}
