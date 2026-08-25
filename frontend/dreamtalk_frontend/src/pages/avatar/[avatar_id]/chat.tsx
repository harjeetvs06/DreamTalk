/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import gsap from 'gsap';
import ProtectedRoute from '@/components/ProtectedRoute';
import ChatInterface, { Message } from '@/components/ChatInterface';
import { sendChatMessage } from '@/lib/brainApi';
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

interface EmotionState {
  name: string;
  display_name: string;
  secondary_emotion?: string;
  vad?: any;
  pad?: any;
  intensity?: number;
}

export default function ChatRoom() {
  const router = useRouter();
  const { avatar_id: avatarId } = router.query;
  const { user_id } = useAuth();

  const [avatar, setAvatar] = useState<AvatarDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState<Message[]>([]);
  const [sending, setSending] = useState(false);
  const [emotion, setEmotion] = useState<string | EmotionState>('neutral');
  const [errorMsg, setErrorMsg] = useState('');

  const emotionPillRef = useRef<HTMLDivElement>(null);

  // Client-side Gate: Fetch and check completion of the avatar
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

        // Check if steps are complete
        if (!data.voice_complete || !data.face_complete) {
          if (process.env.NODE_ENV === 'development') {
            console.warn("DEV MODE: bypassing voice/face completion check");
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
      } catch (err: any) {
        console.error(err);
        setErrorMsg('An error occurred loading the session.');
      } finally {
        setLoading(false);
      }
    };

    checkAvatarAccess();
  }, [router.isReady, avatarId, user_id, router]);

  // Pulse emotion pill when emotion state updates
  useEffect(() => {
    if (emotionPillRef.current && emotion) {
      gsap.fromTo(
        emotionPillRef.current,
        { scale: 1, opacity: 0.85 },
        { scale: 1.1, opacity: 1, duration: 0.25, yoyo: true, repeat: 1, ease: 'sine.inOut' }
      );
    }
  }, [emotion]);

  const handleSendMessage = async (text: string) => {
    if (!avatarId || typeof avatarId !== 'string' || !user_id) return;

    // Append user message
    const userMsg: Message = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text,
    };
    setMessages((prev) => [...prev, userMsg]);
    setSending(true);

    try {
      const data = await sendChatMessage(avatarId, user_id, text);
      
      // Append avatar message response
      const avatarMsg: Message = {
        id: `avatar-${Date.now()}`,
        sender: 'avatar',
        text: data.response,
      };
      setMessages((prev) => [...prev, avatarMsg]);
      
      if (data.emotion) {
        setEmotion(data.emotion);
      }
    } catch (err: any) {
      console.error(err);
      const errMsg: Message = {
        id: `error-${Date.now()}`,
        sender: 'avatar',
        text: 'Sorry, I lost connection to my neural core. Please try again.',
      };
      setMessages((prev) => [...prev, errMsg]);
    } finally {
      setSending(false);
    }
  };

  if (loading || !avatar) {
    return (
      <div className="min-h-screen bg-[#0A0B0A] flex items-center justify-center">
        <div className="text-[#F5F5F0] font-semibold text-lg">Initializing connection...</div>
      </div>
    );
  }

  const emotionLabel = typeof emotion === 'string' ? emotion : (emotion?.display_name || emotion?.name || 'neutral');
  const emotionIntensity = typeof emotion === 'object' && emotion && typeof emotion.intensity === 'number' ? emotion.intensity : 1;

  return (
    <ProtectedRoute>
      <div className="h-screen w-screen flex flex-col bg-[#0A0B0A] text-[#F5F5F0] font-sans selection:bg-[#C8F02D]/30 selection:text-[#C8F02D] overflow-hidden">
        {/* Top App Header Bar */}
        <header className="py-3.5 px-6 bg-[#161715] relative z-10 border-b border-[#1F211E] flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <span className="font-bold text-lg cursor-pointer font-heading text-[#F5F5F0]" onClick={() => router.push('/dashboard')}>
                DreamTalk
              </span>
              <span className="text-xs text-[#9CA39A]">/</span>
              <span className="text-xs font-semibold text-[#9CA39A]">{avatar.name}</span>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Emotion Indicator Pill */}
              <div
                ref={emotionPillRef}
                className="text-white text-xs px-3.5 py-1.5 rounded-full font-bold uppercase tracking-wider select-none shadow-sm"
                style={{
                  backgroundColor: `rgba(249, 115, 22, ${0.4 + 0.6 * emotionIntensity})`,
                }}
              >
                Mood: {emotionLabel}
              </div>

              {/* Small gear icon linking to settings */}
              <Link
                href={`/avatar/${avatar.avatar_id}/settings`}
                title="Avatar Settings"
                className="p-2 bg-[#0A0B0A] hover:bg-[#1F211E] text-[#F5F5F0] rounded-full transition-colors flex items-center justify-center w-10 h-10"
              >
                <svg className="h-5 w-5 text-[#F5F5F0]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </Link>
            </div>
          </div>
        </header>

        {errorMsg && (
          <div className="px-4 pt-3 flex-shrink-0">
            <div className="p-3 bg-red-950/50 text-red-400 text-sm rounded-2xl border-0">
              {errorMsg}
            </div>
          </div>
        )}

        {/* Full Screen Main Workspace Layout */}
        <main className="flex-1 flex flex-col lg:flex-row gap-4 p-4 overflow-hidden h-full w-full">
          {/* Left Side: Full-Height Avatar Profile Card */}
          <div className="w-full lg:w-80 xl:w-96 flex-shrink-0 rounded-3xl p-6 bg-[#161715] flex flex-col justify-between overflow-y-auto h-full">
            <div>
              <div className="h-32 bg-[#0A0B0A] rounded-2xl flex items-center justify-center mb-6">
                <span className="text-4xl font-extrabold text-[#C8F02D] font-heading">
                  {avatar.name.slice(0, 2).toUpperCase()}
                </span>
              </div>
              <h2 className="text-2xl font-extrabold text-[#F5F5F0] font-heading">{avatar.name}</h2>
              <p className="text-sm text-[#9CA39A] mt-1">{avatar.profession}</p>
              
              <div className="mt-6 space-y-4 pt-6 border-t border-[#1F211E]">
                <div className="flex justify-between text-xs">
                  <span className="text-[#9CA39A] font-medium">Relationship</span>
                  <span className="font-semibold text-[#F5F5F0]">{avatar.relationship}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-[#9CA39A] font-medium">Speaking Tone</span>
                  <span className="font-semibold text-[#F5F5F0]">{avatar.tone}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-[#9CA39A] font-medium">Connection</span>
                  <span className="text-[#C8F02D] font-semibold flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-[#C8F02D] inline-block animate-pulse" /> Sync Active
                  </span>
                </div>
              </div>
            </div>

            <div className="text-xs text-[#9CA39A] leading-relaxed pt-6 border-t border-[#1F211E]">
              This conversation is fully encrypted. The digital twin responds based on configured personality metrics.
            </div>
          </div>

          {/* Right Side: Full-Height Main Chat Workspace */}
          <div className="flex-1 h-full min-w-0 flex flex-col">
            <ChatInterface
              messages={messages}
              onSendMessage={handleSendMessage}
              sending={sending}
            />
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}


