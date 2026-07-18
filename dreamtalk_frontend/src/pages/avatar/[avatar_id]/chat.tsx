import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import gsap from 'gsap';
import {
  LiveKitRoom,
  RoomAudioRenderer,
  VideoTrack,
  useTracks,
  useTranscriptions,
  useDataChannel,
  useLocalParticipant,
} from '@livekit/components-react';
import { Track } from 'livekit-client';
import ProtectedRoute from '@/components/ProtectedRoute';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/context/AuthContext';

interface AvatarDetails {
  avatar_id: string;
  name: string;
  profession: string;
  relationship: string;
  tone: string;
  voice_complete: boolean;
  face_complete: boolean;
}

interface EmotionPayload {
  name: string;
  display_name: string;
  intensity: 'low' | 'medium' | 'high' | string;
}

// Avatar's live video feed
function AvatarStage() {
  const tracks = useTracks([Track.Source.Camera]);
  const avatarTrack = tracks.find((t) =>
    t.participant.identity.toLowerCase().includes('avatar')
  );

  return (
    <div className="relative w-full h-full bg-[#111111] rounded-xl overflow-hidden flex items-center justify-center">
      {avatarTrack ? (
        <VideoTrack trackRef={avatarTrack} className="w-full h-full object-cover" />
      ) : (
        <div className="text-white/50 text-sm">Waiting for avatar to join...</div>
      )}
      <div className="absolute top-3 right-3">
        <EmotionPill />
      </div>
      <RoomAudioRenderer />
    </div>
  );
}

// Emotion pill — accent-emotion color reserved ONLY for this, intensity via opacity/size not color
function EmotionPill() {
  const { message } = useDataChannel('emotion');
  const [emotion, setEmotion] = useState<EmotionPayload | null>(null);
  const pillRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!message) return;
    try {
      const decoded = new TextDecoder().decode(message.payload);
      const parsed = JSON.parse(decoded);
      if (parsed.emotion) {
        setEmotion(parsed.emotion);
      }
    } catch {
      // ignore malformed payloads
    }
  }, [message]);

  useEffect(() => {
    if (pillRef.current && emotion) {
      gsap.fromTo(
        pillRef.current,
        { scale: 0.95, opacity: 0.6 },
        { scale: 1, opacity: 1, duration: 0.2, ease: 'sine.out' }
      );
    }
  }, [emotion]);

  if (!emotion) return null;

  const intensityScale =
    emotion.intensity === 'high' ? 1.08 : emotion.intensity === 'low' ? 0.92 : 1;
  const intensityOpacity =
    emotion.intensity === 'high' ? 1 : emotion.intensity === 'low' ? 0.7 : 0.85;

  return (
    <div
      ref={pillRef}
      style={{ transform: `scale(${intensityScale})`, opacity: intensityOpacity }}
      className="text-white text-xs px-3 py-1.5 rounded-full font-bold uppercase tracking-wider select-none bg-[#F97316]"
    >
      {emotion.display_name}
    </div>
  );
}

// Live captions for both sides of the conversation
function TranscriptPanel() {
  const transcriptions = useTranscriptions();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [transcriptions]);

  return (
    <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3">
      {transcriptions.length === 0 ? (
        <div className="text-[#6B7280] text-sm text-center mt-8">
          Start speaking. Your words will appear here.
        </div>
      ) : (
        transcriptions.map((seg) => {
          const isAvatar = seg.participant?.identity?.toLowerCase().includes('avatar');
          return (
            <div key={seg.id} className={`flex ${isAvatar ? 'justify-start' : 'justify-end'}`}>
              <div
                className={`max-w-[75%] px-4 py-2 rounded-lg text-sm leading-relaxed ${
                  isAvatar
                    ? 'bg-[#FAFAFA] text-[#111111] rounded-bl-none'
                    : 'bg-[#2563EB] text-white rounded-br-none'
                }`}
              >
                {seg.text}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}

// Mic toggle control
function MicControl() {
  const { localParticipant, isMicrophoneEnabled } = useLocalParticipant();

  return (
    <button
      onClick={() => localParticipant.setMicrophoneEnabled(!isMicrophoneEnabled)}
      className={`flex items-center justify-center w-12 h-12 rounded-full transition-colors ${
        isMicrophoneEnabled
          ? 'bg-[#2563EB] text-white'
          : 'bg-[#FAFAFA] text-[#111111] shadow-dream-rest'
      }`}
      title={isMicrophoneEnabled ? 'Mute microphone' : 'Unmute microphone'}
    >
      {isMicrophoneEnabled ? (
        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 14a3 3 0 003-3V5a3 3 0 10-6 0v6a3 3 0 003 3z" />
          <path d="M19 11a1 1 0 10-2 0 5 5 0 01-10 0 1 1 0 10-2 0 7 7 0 006 6.93V20H8a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07A7 7 0 0019 11z" />
        </svg>
      ) : (
        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M3 3l18 18-1.4 1.4-3.06-3.06A6.97 6.97 0 0112 19a7 7 0 01-7-7 1 1 0 112 0 5 5 0 004.54 4.98l-1.6-1.6A3 3 0 019 12V9.83L1.6 2.4 3 1zm9-.99a3 3 0 013 3v6c0 .3-.03.58-.1.85l-1.5-1.5V5a1.5 1.5 0 00-2.94-.44L9.02 3.12A3 3 0 0112 2.01zM19 11a1 1 0 10-2 0 4.98 4.98 0 01-.86 2.8l1.44 1.44A6.97 6.97 0 0019 11z" />
        </svg>
      )}
    </button>
  );
}

export default function ChatRoom() {
  const router = useRouter();
  const { avatar_id: avatarId } = router.query;
  const { user_id } = useAuth();

  const [avatar, setAvatar] = useState<AvatarDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  const [token, setToken] = useState<string | null>(null);
  const [serverUrl, setServerUrl] = useState<string | null>(null);
  const [connecting, setConnecting] = useState(false);

  useEffect(() => {
    if (!router.isReady || !avatarId || !user_id) return;

    const checkAvatarAccess = async () => {
      setLoading(true);
      setErrorMsg('');
      try {
        const { data, error } = await supabase
          .from('avatar_config')
          .select('avatar_id, name, profession, relationship, tone, voice_complete, face_complete')
          .eq('avatar_id', avatarId)
          .eq('user_id', user_id)
          .single();

        if (error || !data) {
          router.replace('/dashboard');
          return;
        }

        if (!data.voice_complete || !data.face_complete) {
          if (process.env.NODE_ENV === 'development') {
            console.warn('DEV MODE: bypassing voice/face completion check');
          } else {
            if (!data.voice_complete) {
              router.replace(`/avatar/create/voice?id=${avatarId}`);
              return;
            }
            if (!data.face_complete) {
              router.replace(`/avatar/create/face?id=${avatarId}`);
              return;
            }
          }
        }

        setAvatar(data);
      } catch (err) {
        console.error(err);
        setErrorMsg('An error occurred loading the session.');
      } finally {
        setLoading(false);
      }
    };

    checkAvatarAccess();
  }, [router.isReady, avatarId, user_id, router]);

  const startSession = async () => {
    if (!avatarId || typeof avatarId !== 'string' || !user_id) return;
    setConnecting(true);
    setErrorMsg('');

    const roomName = `room-${avatarId}-${Date.now()}`;

    try {
      const res = await fetch('/api/avatar/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ avatar_id: avatarId, room_name: roomName, user_id }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || `Session error: status ${res.status}`);
      }

      const data = await res.json();
      setToken(data.token);
      setServerUrl(data.serverUrl);
    } catch (err) {
      console.error(err);
      setErrorMsg('Could not connect to the avatar. Please try again.');
    } finally {
      setConnecting(false);
    }
  };

  const endSession = () => {
    setToken(null);
    setServerUrl(null);
  };

  if (loading || !avatar) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-[#111111] font-semibold text-lg">Initializing connection...</div>
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-white text-[#111111] font-sans selection:bg-[#2563EB]/25">
        {/* Navigation */}
        <header className="shadow-dream-rest py-4 px-6 bg-white relative z-10">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <span
                className="font-bold text-lg cursor-pointer"
                onClick={() => router.push('/dashboard')}
              >
                DreamTalk
              </span>
              <span className="text-xs text-[#6B7280]">/</span>
              <span className="text-xs font-semibold text-[#6B7280]">{avatar.name}</span>
            </div>

            <div className="flex items-center space-x-4">
              <Link
                href={`/avatar/${avatar.avatar_id}/settings`}
                title="Avatar Settings"
                className="p-1.5 bg-[#FAFAFA] hover:bg-gray-100 text-[#111111] rounded-md transition-colors shadow-dream-rest flex items-center justify-center w-8 h-8"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                  />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </Link>
            </div>
          </div>
        </header>

        {errorMsg && (
          <div className="max-w-6xl mx-auto mt-6 px-6">
            <div className="p-4 bg-red-50 text-[#DC2626] text-sm rounded-lg shadow-dream-rest">
              {errorMsg}
            </div>
          </div>
        )}

        <main className="max-w-6xl mx-auto py-10 px-6 md:px-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Avatar profile card */}
          <div className="lg:col-span-1 shadow-dream-rest rounded-xl p-6 bg-[#FAFAFA] flex flex-col justify-between h-[520px]">
            <div>
              <div className="h-32 bg-white shadow-dream-rest rounded-xl flex items-center justify-center mb-6">
                <span className="text-4xl font-bold text-[#6B7280]">
                  {avatar.name.slice(0, 2).toUpperCase()}
                </span>
              </div>
              <h2 className="text-xl font-bold text-[#111111]">{avatar.name}</h2>
              <p className="text-sm text-[#6B7280] mt-1">{avatar.profession}</p>

              <div className="mt-6 space-y-3 pt-6">
                <div className="flex justify-between text-xs">
                  <span className="text-[#6B7280] font-medium">Relationship</span>
                  <span className="font-semibold">{avatar.relationship}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-[#6B7280] font-medium">Speaking Tone</span>
                  <span className="font-semibold">{avatar.tone}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-[#6B7280] font-medium">Connection</span>
                  <span
                    className={`font-semibold flex items-center gap-1 ${
                      token ? 'text-[#16A34A]' : 'text-[#6B7280]'
                    }`}
                  >
                    <span
                      className={`h-2 w-2 rounded-full inline-block ${
                        token ? 'bg-[#16A34A] animate-pulse' : 'bg-gray-300'
                      }`}
                    />
                    {token ? 'Active' : 'Idle'}
                  </span>
                </div>
              </div>
            </div>

            {!token ? (
              <button
                onClick={startSession}
                disabled={connecting}
                className="w-full bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-semibold py-2.5 rounded-lg transition disabled:opacity-50"
              >
                {connecting ? 'Connecting...' : 'Start Call'}
              </button>
            ) : (
              <button
                onClick={endSession}
                className="w-full bg-white text-[#DC2626] font-semibold py-2.5 rounded-lg shadow-dream-rest hover:shadow-dream-hover transition"
              >
                End Call
              </button>
            )}
          </div>

          {/* Right: Live avatar video + transcript + mic control */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            {token && serverUrl ? (
              <LiveKitRoom
                token={token}
                serverUrl={serverUrl}
                connect={true}
                audio={true}
                video={false}
                onDisconnected={endSession}
                style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}
              >
                <div className="h-[280px]">
                  <AvatarStage />
                </div>

                <div className="h-[280px] shadow-dream-rest rounded-xl bg-white overflow-hidden flex flex-col">
                  <TranscriptPanel />
                </div>

                <div className="flex justify-center">
                  <MicControl />
                </div>
              </LiveKitRoom>
            ) : (
              <div className="h-[520px] shadow-dream-rest rounded-xl bg-[#FAFAFA] flex items-center justify-center">
                <div className="text-[#6B7280] text-sm">
                  Press &quot;Start Call&quot; to speak with {avatar.name}.
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
